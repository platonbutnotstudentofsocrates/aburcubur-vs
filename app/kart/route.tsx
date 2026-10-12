import { ImageResponse } from "next/og";
import grid from "@/data/pixel-grid.json";
import { cardFonts, colors, SnackArt } from "@/lib/card";
import { productName } from "@/lib/catalog";
import { percent } from "@/lib/matchups";
import { getCurrent, getResults, type Tally } from "@/lib/store";

const CELL = 18;

function cellColor(t: Tally | undefined, checker: boolean) {
  if (!t || t.a + t.b === 0) return colors.empty;
  // Berabere iller iki rengin damalı karışımıyla gösterilir.
  if (t.a === t.b) return checker ? colors.a : colors.b;
  const pa = percent(t);
  const close = Math.abs(pa - 50) < 6;
  return pa >= 50 ? (close ? colors.aSoft : colors.a) : close ? colors.bSoft : colors.b;
}

// Story boyutunda (1080x1920) paylaşım kartı: /kart?c=a
export async function GET(request: Request) {
  const side = new URL(request.url).searchParams.get("c") === "b" ? "b" : "a";
  const current = await getCurrent();
  const results = await getResults(current.round);
  const name = productName(current[side]);
  const pa = percent(results);
  const pill = { background: colors.pop, border: `6px solid ${colors.ink}`, borderRadius: 999, padding: "12px 40px" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", background: colors.paper, color: colors.ink, fontFamily: "Archivo Black", padding: "120px 54px 130px" }}>
        <div style={{ fontSize: 56 }}>ABUR CUBUR VS</div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 760, padding: "56px 40px", background: colors[side], border: `10px solid ${colors.ink}`, borderRadius: 56, boxShadow: `16px 16px 0 ${colors.ink}`, transform: "rotate(-2deg)" }}>
          <div style={{ fontSize: 44 }}>Ben</div>
          <SnackArt product={current[side]} width={420} />
          <div style={{ fontSize: name.length > 12 ? 64 : 92, marginTop: 12, textAlign: "center" }}>{name}</div>
          <div style={{ fontSize: 44 }}>dedim</div>
        </div>

        <div style={{ display: "flex", width: 972, height: 110, border: `8px solid ${colors.ink}`, borderRadius: 999, overflow: "hidden", fontSize: 54 }}>
          <div style={{ display: "flex", alignItems: "center", paddingLeft: 36, width: `${Math.min(84, Math.max(16, pa))}%`, background: colors.a, borderRight: `8px solid ${colors.ink}` }}>%{pa}</div>
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end", paddingRight: 36, background: colors.b }}>%{100 - pa}</div>
        </div>

        <div style={{ display: "flex", position: "relative", width: grid.cols * CELL, height: grid.rows * CELL }}>
          {grid.cells.map(([q, r, code]) => (
            <div key={`${q}-${r}`} style={{ position: "absolute", left: (q as number) * CELL, top: (r as number) * CELL, width: CELL - 2, height: CELL - 2, background: cellColor(results.cities[code as string], ((q as number) + (r as number)) % 2 === 0) }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 50, ...pill }}>Sen hangisindensin?</div>
          <div style={{ fontSize: 34, marginTop: 24 }}>{new URL(request.url).host}</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: await cardFonts(), headers: { "cache-control": "public, max-age=60" } },
  );
}
