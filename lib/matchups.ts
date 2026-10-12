export type Choice = "a" | "b";

/** `a` ve `b`, lib/catalog.ts içindeki ürün kimlikleridir. */
export type Matchup = {
  round: number;
  a: string;
  b: string;
  /** Oylamanın kapanacağı an (ISO, UTC). */
  endsAt: string;
};

// Veritabanı boşken açılan ilk kapışma. Sonrakiler adaylardan kendiliğinden açılır.
export const FIRST: Matchup = { round: 1, a: "pingui", b: "sut-dilimi", endsAt: "2026-10-19T18:00:00Z" };

/** Kendiliğinden açılan her raunt bu kadar gün sürer. */
export const ROUND_DAYS = 7;

/** A tarafının yüzdesi (tam sayı). Oy yoksa 50. */
export const percent = (t: { a: number; b: number }) => (t.a + t.b ? Math.round((t.a / (t.a + t.b)) * 100) : 50);

export const isClosed = (m: Matchup, now = Date.now()) => now >= Date.parse(m.endsAt);
