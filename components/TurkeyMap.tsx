"use client";

import { useState } from "react";
import map from "@/data/provinces.json";
import { percent } from "@/lib/matchups";
import type { Results, Tally } from "@/lib/store";

const CLOSE_MARGIN = 6;
export const provincesByName = [...map.provinces].sort((x, y) => x.name.localeCompare(y.name, "tr"));

function fill(t: Tally | undefined) {
  if (!t || t.a + t.b === 0) return "var(--empty)";
  if (t.a === t.b) return "url(#tie)";
  const pa = percent(t);
  const side = pa >= 50 ? "a" : "b";
  return `var(--${side}${Math.abs(pa - 50) < CLOSE_MARGIN ? "-soft" : ""})`;
}

export function TurkeyMap({ results, names }: { results: Results; names: { a: string; b: string } }) {
  const [active, setActive] = useState<string | null>(null);
  const tallies = Object.values(results.cities);
  const leadA = tallies.filter((t) => t.a > t.b).length;
  const leadB = tallies.filter((t) => t.b > t.a).length;

  const province = map.provinces.find((p) => p.code === active);
  const tally = active ? results.cities[active] : undefined;
  let tip = <>Bir ile dokun ya da listeden seç</>;
  if (province) {
    const pa = tally ? percent(tally) : 50;
    tip = !tally ? (
      <>{province.name} — henüz oy yok</>
    ) : tally.a === tally.b ? (
      <>{province.name} — berabere</>
    ) : (
      <>
        {province.name} — %{pa >= 50 ? pa : 100 - pa} {pa >= 50 ? names.a : names.b}
      </>
    );
  }

  return (
    <section className="map-section">
      <h2>Türkiye ne diyor?</h2>
      <div className="score">
        <div className="tile side-a">
          <b>{leadA} il</b>
          <span>{names.a}</span>
        </div>
        <div className="tile side-b">
          <b>{leadB} il</b>
          <span>{names.b}</span>
        </div>
      </div>
      <svg
        className="map"
        viewBox={`-6 -6 ${map.width + 24} ${map.height + 24}`}
        role="img"
        aria-label={`İllere göre sonuç: ${leadA} ilde ${names.a}, ${leadB} ilde ${names.b} önde`}
        onPointerOver={(e) => {
          const code = (e.target as SVGElement).dataset.code;
          if (code) setActive(code);
        }}
      >
        <defs>
          {/* Berabere iller: iki tarafın rengiyle çizgili */}
          <pattern id="tie" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="16" fill="var(--a)" />
            <rect x="8" width="8" height="16" fill="var(--b)" />
          </pattern>
        </defs>
        <g className="map-shadow" transform="translate(9 9)">
          {map.provinces.map((p) => (
            <path key={p.code} d={p.d} />
          ))}
        </g>
        <g className="map-land">
          {map.provinces.map((p) => (
            <path key={p.code} d={p.d} data-code={p.code} fill={fill(results.cities[p.code])} className={p.code === active ? "active" : undefined} />
          ))}
        </g>
      </svg>
      <p className="tip">{tip}</p>
      <label className="city">
        İl
        <select value={active ?? ""} onChange={(e) => setActive(e.target.value)}>
          <option value="" disabled>Seç</option>
          {provincesByName.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </label>
      <div className="legend">
        <span><i style={{ background: "var(--a)" }} />{names.a}</span>
        <span><i style={{ background: "var(--a-soft)" }} /><i style={{ background: "var(--b-soft)" }} />kıl payı</span>
        <span><i style={{ background: "var(--b)" }} />{names.b}</span>
        <span><i style={{ background: "linear-gradient(135deg, var(--a) 50%, var(--b) 50%)" }} />berabere</span>
        <span><i style={{ background: "var(--empty)" }} />oy yok</span>
      </div>
    </section>
  );
}
