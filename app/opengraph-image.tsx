import { ImageResponse } from "next/og";
import { cardFonts, colors, SnackArt } from "@/lib/card";
import { productName } from "@/lib/catalog";
import { getCurrent } from "@/lib/store";

export const alt = "Abur Cubur VS";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const current = await getCurrent();
  const tile = (side: "a" | "b") => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 400, padding: "36px 24px", background: colors[side], border: `8px solid ${colors.ink}`, borderRadius: 40, boxShadow: `12px 12px 0 ${colors.ink}`, transform: `rotate(${side === "a" ? -3 : 3}deg)` }}>
      <SnackArt product={current[side]} width={240} />
      <div style={{ fontSize: 52, marginTop: 20, textAlign: "center" }}>{productName(current[side])}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", background: colors.paper, color: colors.ink, fontFamily: "Archivo Black", padding: "44px 0 48px" }}>
        <div style={{ fontSize: 44 }}>ABUR CUBUR VS</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {tile("a")}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 130, height: 130, margin: "0 -30px", background: colors.pop, border: `8px solid ${colors.ink}`, borderRadius: 999, fontSize: 52 }}>VS</div>
          {tile("b")}
        </div>
        <div style={{ fontSize: 36, background: colors.pop, border: `6px solid ${colors.ink}`, borderRadius: 999, padding: "10px 36px" }}>Oy ver, Türkiye ne diyor gör</div>
      </div>
    ),
    { ...size, fonts: await cardFonts() },
  );
}
