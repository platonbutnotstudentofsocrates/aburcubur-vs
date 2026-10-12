// data/src/tr-provinces.geojson -> data/provinces.json (SVG yolları) + data/pixel-grid.json (paylaşım kartı için)
// Kaynak: geoBoundaries TUR ADM1 (OpenStreetMap, ODbL), mapshaper ile sadeleştirildi.
import { readFileSync, writeFileSync } from 'node:fs';

const geo = JSON.parse(readFileSync(new URL('../data/src/tr-provinces.geojson', import.meta.url)));
const WIDTH = 1000;
const KX = Math.cos((39 * Math.PI) / 180);

const polysOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const all = geo.features.flatMap((f) => polysOf(f.geometry).flatMap((p) => p[0]));
const minLon = Math.min(...all.map((p) => p[0]));
const maxLon = Math.max(...all.map((p) => p[0]));
const maxLat = Math.max(...all.map((p) => p[1]));
const minLat = Math.min(...all.map((p) => p[1]));
const S = WIDTH / ((maxLon - minLon) * KX);
const HEIGHT = Math.ceil((maxLat - minLat) * S);
const proj = ([lon, lat]) => [(lon - minLon) * KX * S, (maxLat - lat) * S];

const provinces = geo.features
  .map((f) => {
    const rings = polysOf(f.geometry).map((p) => p[0].map(proj));
    return {
      code: f.properties.shapeISO.replace('TR-', ''),
      name: f.properties.shapeName.replace('Hakkâri', 'Hakkari'),
      rings,
      d: rings.map((r) => 'M' + r.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L') + 'Z').join(''),
    };
  })
  .sort((x, y) => x.code.localeCompare(y.code));

const inRing = (x, y, r) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i];
    const [xj, yj] = r[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const COLS = 54;
const cell = WIDTH / COLS;
const ROWS = Math.ceil(HEIGHT / cell);
const cells = [];
for (let r = 0; r < ROWS; r++)
  for (let q = 0; q < COLS; q++) {
    const x = (q + 0.5) * cell;
    const y = (r + 0.5) * cell;
    const p = provinces.find((pr) => pr.rings.some((ring) => inRing(x, y, ring)));
    if (p) cells.push([q, r, p.code]);
  }

writeFileSync(
  new URL('../data/provinces.json', import.meta.url),
  JSON.stringify({ width: WIDTH, height: HEIGHT, provinces: provinces.map(({ code, name, d }) => ({ code, name, d })) }),
);
writeFileSync(new URL('../data/pixel-grid.json', import.meta.url), JSON.stringify({ cols: COLS, rows: ROWS, cells }));
console.log(`${provinces.length} il, ${WIDTH}x${HEIGHT}, ${cells.length} piksel`);
