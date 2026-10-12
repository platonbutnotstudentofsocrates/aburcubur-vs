// DATABASE_URL varsa gerçek Postgres, yoksa yerelde .data/ altında gömülü Postgres (PGlite).
export type Query = <T = Record<string, unknown>>(text: string, params?: unknown[]) => Promise<T[]>;

const SCHEMA = [
  `create table if not exists matchups (
     round int primary key,
     a text not null,
     b text not null,
     ends_at timestamptz not null
   )`,
  `create table if not exists votes (
     matchup int not null,
     voter text not null,
     choice text not null check (choice in ('a','b')),
     city text,
     ip_hash text not null,
     created_at timestamptz not null default now(),
     primary key (matchup, voter)
   )`,
  `create index if not exists votes_ip on votes (matchup, ip_hash, created_at)`,
  // İlin nereden geldiği: 'ip' (tahmin) ya da 'user' (kişi kendi seçti).
  `alter table votes add column if not exists city_source text`,
  // Sonraki kapışma için adaylar: kişi başı tek ürün (lib/catalog.ts kimliği).
  `create table if not exists nominations (
     matchup int not null,
     voter text not null,
     product text not null,
     ip_hash text not null,
     created_at timestamptz not null default now(),
     primary key (matchup, voter)
   )`,
  `create index if not exists nominations_product on nominations (matchup, product)`,
];

async function connect(): Promise<Query> {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  let query: Query;
  if (url) {
    const postgres = (await import("postgres")).default;
    const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 20 });
    query = (text, params = []) => sql.unsafe(text, params as never[]) as never;
  } else {
    if (process.env.VERCEL) throw new Error("DATABASE_URL tanımlı değil");
    const { PGlite } = await import("@electric-sql/pglite");
    (await import("node:fs")).mkdirSync(".data", { recursive: true });
    const pg = new PGlite(".data/pg");
    query = async (text, params = []) => (await pg.query(text, params)).rows as never;
  }
  for (const statement of SCHEMA) await query(statement);
  return query;
}

const globalForDb = globalThis as { __db?: Promise<Query> };

export function db(): Promise<Query> {
  globalForDb.__db ??= connect().catch((error) => {
    globalForDb.__db = undefined;
    throw error;
  });
  return globalForDb.__db;
}
