import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { artRects } from "./art";

// next/og (Satori) için ortak parçalar: yalnızca inline stil ve flex desteklenir.
export const colors = { ink: "#111", paper: "#fff6e0", pop: "#ffe14d", a: "#5bbcff", aSoft: "#c3e6ff", b: "#ff7d95", bSoft: "#ffd0d8", empty: "#efe5c8" };

const font = readFile(join(process.cwd(), "assets/ArchivoBlack-Regular.ttf"));

export async function cardFonts() {
  return [{ name: "Archivo Black", data: await font, weight: 400 as const, style: "normal" as const }];
}

export function SnackArt({ product, width }: { product: string; width: number }) {
  return (
    <svg width={width} height={(width * 40) / 64} viewBox="0 0 64 40">
      {artRects(product).map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
}
