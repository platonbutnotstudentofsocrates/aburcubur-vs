import Link from "next/link";
import { productName } from "@/lib/catalog";
import { getFinishedRounds } from "@/lib/store";

export const metadata = { title: "Veri — Abur Cubur VS" };
export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("tr-TR");

// Biten rauntların herkese açık verisi.
export default async function Veri() {
  const rounds = await getFinishedRounds();
  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">VERİ</h1>
        <span className="round">{rounds.length} raunt</span>
      </header>
      <div className="prose">
        <p>
          Biten her raundun il il oy sayıları herkese açık. Sayfada okuyabilir, yazdırabilir ya da tablo olarak indirebilirsin.
          Kaynak göstererek istediğin gibi kullanabilirsin.
        </p>
        <p>
          Bu bir eğlence anketi, bilimsel bir araştırma değil: iller internet bağlantısından tahmin edilir ya da kişinin kendi seçimidir.
          Devam eden raundun verisi raunt bitince eklenir.
        </p>
      </div>

      {rounds.length > 0 ? (
        <section className="past">
          <div className="downloads">
            <a href="/veri/tum-rauntlar.csv">Hepsini indir (Excel)</a>
          </div>
          {rounds.map((round) => (
            <Link className="row" key={round.round} href={`/raunt/${round.round}`}>
              <span className="round">{round.round}. raunt</span>
              <span>{productName(round.a)} vs {productName(round.b)}</span>
              <small>{number.format(round.votes.a + round.votes.b)} oy ›</small>
            </Link>
          ))}
        </section>
      ) : (
        <p className="tip">İlk raunt bitince verisi burada olacak</p>
      )}

      <Link className="back" href="/">‹ Kapışmaya dön</Link>
    </main>
  );
}
