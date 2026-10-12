import Link from "next/link";
import { productName } from "@/lib/catalog";
import { panelAuthorized, panelEnabled } from "@/lib/panel";
import { getCurrent, getPanelStats, getResults } from "@/lib/store";

export const metadata = { title: "Panel — Abur Cubur VS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("tr-TR");
const SOURCE_NAMES: Record<string, string> = { ig: "Instagram (profil linki)", tiktok: "TikTok (profil linki)", wp: "WhatsApp", x: "X", direkt: "Doğrudan", video: "Video", "": "Kayıt yok (takipten önce)" };
const CITY_SOURCE_NAMES: Record<string, string> = { ip: "IP tahmini", user: "Kişi kendi seçti", "": "İl yok" };

function Bars({ rows, names }: { rows: { label: string; n: number }[]; names: Record<string, string> }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  const total = rows.reduce((sum, r) => sum + r.n, 0) || 1;
  return (
    <div className="bars">
      {rows.map((row) => (
        <div key={row.label} title={`${names[row.label] ?? row.label}: ${number.format(row.n)} oy`}>
          <span>{names[row.label] ?? row.label}</span>
          <i><b style={{ width: `${(row.n / max) * 100}%` }} /></i>
          <em>{number.format(row.n)} · %{Math.round((row.n / total) * 100)}</em>
        </div>
      ))}
    </div>
  );
}

function Hours({ hours }: { hours: { hour: string; n: number }[] }) {
  if (!hours.length) return <p className="hint">Henüz oy yok.</p>;
  // Boş saatleri de göster ki zaman ekseni düzgün aksın.
  const start = new Date(`${hours[0].hour.replace(" ", "T")}:00:00Z`).getTime();
  const end = new Date(`${hours[hours.length - 1].hour.replace(" ", "T")}:00:00Z`).getTime();
  const byHour = new Map(hours.map((h) => [h.hour, h.n]));
  const slots: { hour: string; n: number }[] = [];
  for (let t = start; t <= end; t += 3600_000) {
    const hour = new Date(t).toISOString().slice(0, 13).replace("T", " ");
    slots.push({ hour, n: byHour.get(hour) ?? 0 });
  }
  const max = Math.max(1, ...slots.map((s) => s.n));
  return (
    <>
      <div className="cols" role="img" aria-label="Saat saat oy sayısı">
        {slots.map((slot) => (
          <i key={slot.hour} title={`${slot.hour.slice(8, 10)}.${slot.hour.slice(5, 7)} saat ${slot.hour.slice(11)}:00 — ${number.format(slot.n)} oy`}>
            <b style={{ height: `${(slot.n / max) * 100}%` }} />
          </i>
        ))}
      </div>
      <div className="cols-axis">
        <span>{slots[0].hour.slice(8, 10)}.{slots[0].hour.slice(5, 7)} {slots[0].hour.slice(11)}:00</span>
        <span>en yoğun saat: {number.format(max)} oy</span>
        <span>{slots[slots.length - 1].hour.slice(8, 10)}.{slots[slots.length - 1].hour.slice(5, 7)} {slots[slots.length - 1].hour.slice(11)}:00</span>
      </div>
    </>
  );
}

export default async function Panel({ searchParams }: PageProps<"/panel">) {
  if (!(await panelAuthorized())) {
    const failed = (await searchParams).hata;
    return (
      <main className="card">
        <header className="top"><h1 className="logo">PANEL</h1></header>
        {panelEnabled() ? (
          <form className="nominate" method="post" action="/api/panel">
            <input type="password" name="key" placeholder="Panel anahtarı" aria-label="Panel anahtarı" required />
            <button type="submit">Gir</button>
          </form>
        ) : (
          <p className="hint">{"Panel kapalı. Açmak için Vercel'de PANEL_KEY ortam değişkenini tanımla ve yeniden yayınla."}</p>
        )}
        {failed && <p className="error" role="alert">Anahtar yanlış.</p>}
        <Link className="back" href="/">‹ Kapışmaya dön</Link>
      </main>
    );
  }

  const current = await getCurrent();
  const [results, stats] = await Promise.all([getResults(current.round, true), getPanelStats(current.round)]);
  const total = results.a + results.b;
  const tiles = [
    ["Toplam oy", total],
    [productName(current.a), results.a],
    [productName(current.b), results.b],
    ["Oy gelen il", Object.keys(results.cities).length],
    ["Aday seçen", stats.nominations],
  ] as const;

  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">PANEL</h1>
        <span className="round">{current.round}. raunt</span>
      </header>
      <p className="hint">Bu sayfayı yalnızca anahtarı bilen görür. Saatler Türkiye saatiyle.</p>

      <div className="stats">
        {tiles.map(([label, value]) => (
          <div key={label}><b>{number.format(value)}</b><span>{label}</span></div>
        ))}
      </div>

      <section className="next">
        <h2>Saat saat oy</h2>
        <Hours hours={stats.hours} />
      </section>

      <section className="next">
        <h2>Oylar nereden geldi</h2>
        <Bars rows={stats.sources} names={SOURCE_NAMES} />
      </section>

      <section className="next">
        <h2>İl bilgisi nasıl belirlendi</h2>
        <Bars rows={stats.citySources} names={CITY_SOURCE_NAMES} />
      </section>

      <Link className="back" href="/">‹ Kapışmaya dön</Link>
    </main>
  );
}
