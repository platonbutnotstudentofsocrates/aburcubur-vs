"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, findProduct, pickNextPair, productName, products, type CategoryId, type Nominee } from "@/lib/catalog";
import { percent, type Choice, type Matchup } from "@/lib/matchups";
import type { PastRound, Results } from "@/lib/store";
import { Snack } from "./Snack";
import { provincesByName, TurkeyMap } from "./TurkeyMap";

const number = new Intl.NumberFormat("tr-TR");
const SOCIAL = { instagram: "https://www.instagram.com/aburcuburvs/", tiktok: "https://www.tiktok.com/@aburcubur.vs" };

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Bir şeyler ters gitti. Tekrar dene.");
  return data;
}

function useCountdown(endsAt: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Date.parse(endsAt) - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);
  return left;
}

function formatLeft(ms: number) {
  const s = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const [d, h, m] = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60)];
  if (d) return `${d} gün ${h} saat ${pad(m)} dk`;
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

// Kıl payı bitenlerde "%50" yazmamak için bir ondalık gösterir.
function winShare({ a, b }: { a: number; b: number }) {
  const share = (Math.max(a, b) / (a + b || 1)) * 100;
  return Math.round(share) === 50 && a !== b ? share.toFixed(1).replace(".", ",") : String(Math.round(share));
}

function PastRow({ round }: { round: PastRound }) {
  const { votes } = round;
  const tie = votes.a === votes.b;
  const win: Choice = votes.a >= votes.b ? "a" : "b";
  const lose: Choice = win === "a" ? "b" : "a";
  return (
    <Link className="row" href={`/raunt/${round.round}`} aria-label={`${round.round}. raundun sonuçlarını gör`}>
      <span className="round">{round.round}. raunt</span>
      {tie ? (
        <span>{productName(round.a)} ve {productName(round.b)} berabere</span>
      ) : (
        <span>
          <span className={`chip side-${win}`}>{productName(round[win])}</span> <span className="loser">vs {productName(round[lose])}</span>
        </span>
      )}
      <small>%{winShare(votes)} ›</small>
    </Link>
  );
}

export function Game(props: {
  matchup: Matchup;
  vote: Choice | null;
  city: string | null;
  results: Results | null;
  nomination: string | null;
  nominees: Nominee[];
  used: string[];
  past: PastRound[];
}) {
  const { matchup, past } = props;
  const router = useRouter();
  const [vote, setVote] = useState(props.vote);
  const [city, setCity] = useState(props.city);
  const [results, setResults] = useState(props.results);
  const [nomination, setNomination] = useState(props.nomination);
  const [nominees, setNominees] = useState(props.nominees);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ product: "", error: "" });

  const left = useCountdown(matchup.endsAt);
  const closed = left === 0;
  const names = { a: productName(matchup.a), b: productName(matchup.b) };
  const leading = pickNextPair(nominees);
  const selectable = (Object.keys(categories) as CategoryId[])
    .map((id) => ({ id, items: products.filter((p) => p.category === id && !props.used.includes(p.id)) }))
    .filter((group) => group.items.length > 0);
  const shown = results ?? (closed ? props.results : null);
  const pa = shown ? percent(shown) : 50;
  const total = shown ? shown.a + shown.b : 0;
  const winner: Choice | null = closed && shown && shown.a !== shown.b ? (shown.a > shown.b ? "a" : "b") : null;

  // Süre dolunca sunucudan sonucu ya da yeni raundu al.
  useEffect(() => {
    if (closed) router.refresh();
  }, [closed, router]);

  async function cast(choice: Choice) {
    setBusy(true);
    setError("");
    try {
      const data = await post<{ vote: Choice; city: string | null; results: Results }>("/api/vote", { choice, round: matchup.round });
      setVote(data.vote);
      setCity(data.city);
      setResults(data.results);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function changeCity(next: string) {
    setError("");
    try {
      const data = await post<{ city: string; results: Results }>("/api/city", { city: next });
      setCity(data.city);
      setResults(data.results);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function share() {
    const text = vote ? `Ben ${names[vote]} dedim. Sen hangisindensin?` : `${names.a} mı, ${names.b} mi?`;
    const url = window.location.origin;
    if (navigator.share) {
      await navigator.share({ title: "Abur Cubur VS", text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function nominate(product = form.product) {
    if (!product) return setForm({ ...form, error: "Listeden bir ürün seç." });
    try {
      const data = await post<{ nomination: string; nominees: Nominee[] }>("/api/nominate", { product, round: matchup.round });
      setNomination(data.nomination);
      setNominees(data.nominees);
      setForm({ product: "", error: "" });
    } catch (e) {
      setForm({ ...form, error: (e as Error).message });
    }
  }

  const fighter = (side: Choice) => (
    <div className={`fighter side-${side}${vote === side ? " picked" : ""}`}>
      {winner === side && <span className="badge">Kazanan</span>}
      <Snack product={matchup[side]} />
      <h2>{names[side]}</h2>
      {vote === side ? (
        <span className="mine">Senin oyun</span>
      ) : !vote && !closed ? (
        <button onClick={() => cast(side)} disabled={busy}>Oy ver</button>
      ) : null}
    </div>
  );

  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">ABUR CUBUR <em>VS</em></h1>
        <span className="round">{matchup.round}. raunt</span>
      </header>

      <p className="timer">{left === null ? " " : closed ? "Oylama bitti" : `Bitmesine ${formatLeft(left)}`}</p>

      <div className="arena">
        {fighter("a")}
        <span className="vs">VS</span>
        {fighter("b")}
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      {shown ? (
        <>
          <div className="bar" role="img" aria-label={`${names.a} yüzde ${pa}, ${names.b} yüzde ${100 - pa}`}>
            <span className="side-a" style={{ width: `${Math.min(84, Math.max(16, pa))}%` }}>%{pa}</span>
            <span className="side-b">%{100 - pa}</span>
          </div>
          <p className="count">{number.format(total)} oy</p>

          <div className="actions">
            <button onClick={share}>{copied ? "Link kopyalandı" : "Paylaş"}</button>
            {vote && <a href={`/kart?c=${vote}`} target="_blank">Story kartı</a>}
          </div>
          <div className="follow">
            <span>Yeni rauntları kaçırma</span>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener">Instagram</a>
            <a href={SOCIAL.tiktok} target="_blank" rel="noopener">TikTok</a>
          </div>

          {vote && !closed && (
            <label className="mycity">
              <span>{city ? "Oyunun sayıldığı il" : "Hangi ilden oy verdin?"}</span>
              <select value={city ?? ""} onChange={(e) => changeCity(e.target.value)}>
                <option value="" disabled>Seç</option>
                {provincesByName.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
              <small>{city ? "İnternet bağlantından tahmin ettik. Yanlışsa düzelt." : "İlini bulamadık. Seçersen oyun haritada sayılır."}</small>
            </label>
          )}

          <TurkeyMap results={shown} names={names} />
        </>
      ) : (
        <div className="bar locked">Oy ver, sonucu gör</div>
      )}

      <section className="next">
        <h2>{"Sonraki VS'te kim olsun?"}</h2>
        <p className="hint">Listeden bir atıştırmalık seç ya da aşağıdaki öndekilerden birine dokun. Raunt bitince aynı kategoriden en çok seçilen ikili kapışır.</p>
        <form
          className="nominate"
          onSubmit={(e) => {
            e.preventDefault();
            nominate();
          }}
        >
          <select value={form.product} onChange={(e) => setForm({ product: e.target.value, error: "" })} aria-label="Aday ürün">
            <option value="" disabled>Bir ürün seç</option>
            {selectable.map((group) => (
              <optgroup key={group.id} label={categories[group.id]}>
                {group.items.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button type="submit">{nomination ? "Değiştir" : "Gönder"}</button>
        </form>
        {form.error && <p className="error" role="alert">{form.error}</p>}
        {nomination && <p className="yours">Senin adayın: <b>{productName(nomination)}</b></p>}

        {leading && (
          <div className="leading">
            <small>Şu an önde · {categories[leading.category]}</small>
            <div className="pair">
              <span className="side-a"><Snack product={leading.a} />{productName(leading.a)}</span>
              <em>VS</em>
              <span className="side-b"><Snack product={leading.b} />{productName(leading.b)}</span>
            </div>
          </div>
        )}
        {nominees.length > 0 && <h3>En çok seçilenler</h3>}
        {nominees.slice(0, 5).map((n, i) => (
          <button
            className={nomination === n.id ? "row pick chosen" : "row pick"}
            key={n.id}
            onClick={() => nominate(n.id)}
            disabled={nomination === n.id}
            aria-label={`${productName(n.id)} adayını seç`}
          >
            <span className="who">
              <Snack product={n.id} />
              <span>
                {i + 1}. {productName(n.id)}
                <small>{categories[findProduct(n.id)!.category]} · {number.format(n.count)} kişi</small>
              </span>
            </span>
            <em>{nomination === n.id ? "Senin adayın" : "Bunu seç"}</em>
          </button>
        ))}
      </section>

      {past.length > 0 && (
        <section className="past">
          <h2>Kazananlar</h2>
          <p className="hint">Haritasıyla birlikte tüm sonucu görmek için bir raunda dokun.</p>
          {past.map((round) => (
            <PastRow key={round.round} round={round} />
          ))}
        </section>
      )}

      <Link className="datalink" href="/veri">
        <span>Tüm sonuç verileri herkese açık</span>
        <b>Veriyi gör ›</b>
      </Link>

      <footer>
        Eğlence amaçlı bağımsız bir ankettir; adı geçen markalarla bir bağlantısı yoktur. Harita verisi © OpenStreetMap katkıcıları.{" "}
        <Link href="/veri">Veri</Link> · <Link href="/gizlilik">Gizlilik</Link>
      </footer>
    </main>
  );
}
