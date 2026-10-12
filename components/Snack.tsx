import { artRects } from "@/lib/art";

export function Snack({ product }: { product: string }) {
  return (
    <svg viewBox="0 0 64 40" shapeRendering="crispEdges" aria-hidden="true">
      {artRects(product).map(([x, y, width, height, fill], i) => (
        <rect key={i} x={x} y={y} width={width} height={height} fill={fill} />
      ))}
    </svg>
  );
}
