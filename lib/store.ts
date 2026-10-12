import { db } from "./db";
import { findProduct, pickNextPair, type Nominee } from "./catalog";
import { FIRST, isClosed, ROUND_DAYS, type Choice, type Matchup } from "./matchups";

export type Tally = { a: number; b: number };
export type Results = Tally & { cities: Record<string, Tally> };
export type PastRound = Matchup & { votes: Tally };

const IP_VOTES_PER_HOUR = 30;
const RESULTS_TTL_MS = 5000;

type MatchupRow = { round: number; a: string; b: string; ends_at: Date | string };
const toMatchup = (row: MatchupRow): Matchup => ({ round: row.round, a: row.a, b: row.b, endsAt: new Date(row.ends_at).toISOString() });

async function latestMatchup() {
  const query = await db();
  const [row] = await query<MatchupRow>(`select round, a, b, ends_at from matchups order by round desc limit 1`);
  return row ? toMatchup(row) : null;
}

/** Yayındaki kapışma. Süresi dolmuşsa ve en az iki aday varsa sıradaki raundu açar. */
export async function getCurrent(): Promise<Matchup> {
  const query = await db();
  let current = await latestMatchup();
  if (!current) {
    await query(`insert into matchups (round, a, b, ends_at) values ($1, $2, $3, $4::timestamptz) on conflict do nothing`, [
      FIRST.round, FIRST.a, FIRST.b, FIRST.endsAt,
    ]);
    current = (await latestMatchup())!;
  }
  if (isClosed(current)) {
    const next = pickNextPair(await getNominees(current.round));
    if (next) {
      await query(
        `insert into matchups (round, a, b, ends_at) values ($1, $2, $3, now() + make_interval(days => $4)) on conflict do nothing`,
        [current.round + 1, next.a, next.b, ROUND_DAYS],
      );
      // IP özetleri yalnızca hile sınırı için gerekli; biten raunt için silinir.
      await query(`update votes set ip_hash = '' where matchup <= $1 and ip_hash <> ''`, [current.round]);
      await query(`update nominations set ip_hash = '' where matchup <= $1 and ip_hash <> ''`, [current.round]);
      current = (await latestMatchup())!;
    }
  }
  return current;
}

export async function getMatchup(round: number): Promise<Matchup | null> {
  const query = await db();
  const [row] = await query<MatchupRow>(`select round, a, b, ends_at from matchups where round = $1`, [round]);
  return row ? toMatchup(row) : null;
}

export async function getPastRounds(currentRound: number): Promise<PastRound[]> {
  const query = await db();
  const rows = await query<MatchupRow & { a_votes: number; b_votes: number }>(
    `select m.round, m.a, m.b, m.ends_at,
            count(*) filter (where v.choice = 'a')::int as a_votes,
            count(*) filter (where v.choice = 'b')::int as b_votes
       from matchups m left join votes v on v.matchup = m.round
      where m.round < $1
      group by m.round order by m.round desc limit 30`,
    [currentRound],
  );
  return rows.map((row) => ({ ...toMatchup(row), votes: { a: row.a_votes, b: row.b_votes } }));
}

/** Süresi dolmuş tüm rauntlar, yeniden eskiye. Verisi herkese açıktır. */
export async function getFinishedRounds(): Promise<PastRound[]> {
  const query = await db();
  const rows = await query<MatchupRow & { a_votes: number; b_votes: number }>(
    `select m.round, m.a, m.b, m.ends_at,
            count(*) filter (where v.choice = 'a')::int as a_votes,
            count(*) filter (where v.choice = 'b')::int as b_votes
       from matchups m left join votes v on v.matchup = m.round
      where m.ends_at <= now()
      group by m.round order by m.round desc`,
  );
  return rows.map((row) => ({ ...toMatchup(row), votes: { a: row.a_votes, b: row.b_votes } }));
}

const cache = new Map<number, { at: number; results: Results }>();

export async function getResults(round: number, fresh = false): Promise<Results> {
  const hit = cache.get(round);
  if (!fresh && hit && Date.now() - hit.at < RESULTS_TTL_MS) return hit.results;
  const query = await db();
  const rows = await query<{ choice: Choice; city: string | null; n: number }>(
    `select choice, city, count(*)::int as n from votes where matchup = $1 group by choice, city`,
    [round],
  );
  const results: Results = { a: 0, b: 0, cities: {} };
  for (const row of rows) {
    results[row.choice] += row.n;
    if (row.city) (results.cities[row.city] ??= { a: 0, b: 0 })[row.choice] += row.n;
  }
  cache.set(round, { at: Date.now(), results });
  return results;
}

export async function getVote(round: number, voter: string) {
  const query = await db();
  const [row] = await query<{ choice: Choice; city: string | null }>(`select choice, city from votes where matchup = $1 and voter = $2`, [round, voter]);
  return row ?? null;
}

export async function setCity(round: number, voter: string, city: string) {
  const query = await db();
  await query(`update votes set city = $3, city_source = 'user' where matchup = $1 and voter = $2`, [round, voter, city]);
}

async function ipLimited(table: "votes" | "nominations", round: number, ipHash: string) {
  const query = await db();
  const [{ n }] = await query<{ n: number }>(
    `select count(*)::int as n from ${table} where matchup = $1 and ip_hash = $2 and created_at > now() - interval '1 hour'`,
    [round, ipHash],
  );
  return n >= IP_VOTES_PER_HOUR;
}

export async function castVote(round: number, voter: string, choice: Choice, city: string | null, ipHash: string) {
  if (await ipLimited("votes", round, ipHash)) return "limited" as const;
  const query = await db();
  await query(
    `insert into votes (matchup, voter, choice, city, city_source, ip_hash) values ($1, $2, $3, $4, $5, $6) on conflict do nothing`,
    [round, voter, choice, city, city ? "ip" : null, ipHash],
  );
  return "ok" as const;
}

/** Daha önce kapışmış (ya da şu an kapışan) ürünler; yeniden aday olamazlar. */
export async function getUsedProducts(): Promise<Set<string>> {
  const query = await db();
  const rows = await query<{ a: string; b: string }>(`select a, b from matchups`);
  return new Set(rows.flatMap((row) => [row.a, row.b]));
}

/** Bu raundun adayları, çoktan aza. Kapışmış ürünler sayılmaz. */
export async function getNominees(round: number): Promise<Nominee[]> {
  const query = await db();
  const [rows, used] = await Promise.all([
    query<Nominee>(
      `select product as id, count(*)::int as count from nominations where matchup = $1
        group by product order by count(*) desc, min(created_at)`,
      [round],
    ),
    getUsedProducts(),
  ]);
  return rows.filter((row) => findProduct(row.id) && !used.has(row.id));
}

export async function getNomination(round: number, voter: string) {
  const query = await db();
  const [row] = await query<{ product: string }>(`select product from nominations where matchup = $1 and voter = $2`, [round, voter]);
  return row?.product ?? null;
}

/** Kişi başı tek aday; tekrar seçerse adayı değişir. */
export async function nominate(round: number, voter: string, product: string, ipHash: string) {
  const query = await db();
  if (!(await getNomination(round, voter)) && (await ipLimited("nominations", round, ipHash))) return "limited" as const;
  await query(
    `insert into nominations (matchup, voter, product, ip_hash) values ($1, $2, $3, $4)
     on conflict (matchup, voter) do update set product = excluded.product`,
    [round, voter, product, ipHash],
  );
  return "ok" as const;
}
