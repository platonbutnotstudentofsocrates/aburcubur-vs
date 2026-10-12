import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Donate } from "@/components/Donate";
import { PrintButton } from "@/components/PrintButton";
import { Snack } from "@/components/Snack";
import { TurkeyMap } from "@/components/TurkeyMap";
import { productName } from "@/lib/catalog";
import { provinceRows } from "@/lib/export";
import { isClosed, percent, type Choice } from "@/lib/matchups";
import { getMatchup, getResults } from "@/lib/store";

const number = new Intl.NumberFormat("tr-TR");

// Bitmiş bir raundun tüm sonucu: yüzde, oy sayısı ve il il harita.
export default async function RoundPage({ params }: PageProps<"/raunt/[round]">) {
  const round = Number((await params).round);
  const matchup = Number.isInteger(round) ? await getMatchup(round) : null;
  if (!matchup) notFound();
  if (!isClosed(matchup)) redirect("/");

  const results = await getResults(matchup.round);
  const names = { a: productName(matchup.a), b: productName(matchup.b) };
  const pa = percent(results);
  const winner: Choice | null = results.a === results.b ? null : results.a > results.b ? "a" : "b";

  const fighter = (side: Choice) => (
    <div className={`fighter side-${side}${winner === side ? " picked" : ""}`}>
      {winner === side && <span className="badge">Kazanan</span>}
      <Snack product={matchup[side]} />
      <h2>{names[side]}</h2>
      <span className="mine">{number.format(results[side])} oy</span>
    </div>
  );

  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">ABUR CUBUR <em>VS</em></h1>
        <span className="round">{matchup.round}. raunt</span>
      </header>
      <p className="timer">{new Date(matchup.endsAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" })} tarihinde bitti</p>

      <div className="arena">
        {fighter("a")}
        <span className="vs">VS</span>
        {fighter("b")}
      </div>

      <div className="bar" role="img" aria-label={`${names.a} yüzde ${pa}, ${names.b} yüzde ${100 - pa}`}>
        <span className="side-a" style={{ width: `${Math.min(84, Math.max(16, pa))}%` }}>%{pa}</span>
        <span className="side-b">%{100 - pa}</span>
      </div>
      <p className="count">{number.format(results.a + results.b)} oy</p>

      <TurkeyMap results={results} names={names} />

      <section className="next">
        <h2>İl il sonuçlar</h2>
        <Donate />
        <div className="downloads">
          <a href={`/veri/raunt-${matchup.round}.csv`}>İndir (Excel)</a>
          <PrintButton />
        </div>
        <table className="data">
          <thead>
            <tr>
              <th>İl</th>
              <th>{names.a}</th>
              <th>{names.b}</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {provinceRows(results).map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td className={row.a > row.b ? "lead-a" : undefined}>{number.format(row.a)}</td>
                <td className={row.b > row.a ? "lead-b" : undefined}>{number.format(row.b)}</td>
                <td>{number.format(row.a + row.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Link className="back" href="/veri">‹ Tüm rauntların verisi</Link>
    </main>
  );
}
