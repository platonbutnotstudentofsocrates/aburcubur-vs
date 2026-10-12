// Aday olabilecek ürünlerin tamamı. Yeni ürün eklemek için listeye bir satır yaz:
// çizim, şekil ve üç renkten kendiliğinden üretilir. Renklerin anlamı şekle göre değişir (bkz. lib/art.ts).
export type Shape =
  | "bar" | "nutbar" | "twin" | "wafer" | "sandwich" | "biscuit" | "cake" | "layer"
  | "chip" | "triangle" | "puff" | "cone" | "stick" | "striped" | "drops" | "bear" | "roll" | "gum";

export const categories = {
  cikolata: "Çikolata",
  gofret: "Gofret",
  biskuvi: "Bisküvi",
  kek: "Kek",
  sutlu: "Sütlü atıştırmalık",
  cips: "Cips",
  dondurma: "Dondurma",
  sekerleme: "Şekerleme ve sakız",
} as const;

export type CategoryId = keyof typeof categories;
export type Product = { id: string; name: string; category: CategoryId; shape: Shape; colors: [string, string, string] };

const p = (id: string, name: string, category: CategoryId, shape: Shape, ...colors: [string, string, string]): Product => ({ id, name, category, shape, colors });

export const products: Product[] = [
  p("albeni", "Albeni", "cikolata", "bar", "#6b3a25", "#d9a15c", "#c9791f"),
  p("metro", "Metro", "cikolata", "bar", "#6b3a25", "#e8c9a0", "#c9791f"),
  p("snickers", "Snickers", "cikolata", "nutbar", "#6b3a25", "#e8c9a0", "#c9791f"),
  p("mars", "Mars", "cikolata", "bar", "#5a2d1a", "#c9a27a", "#c9791f"),
  p("twix", "Twix", "cikolata", "twin", "#6b3a25", "#d9a15c", "#c9791f"),
  p("bounty", "Bounty", "cikolata", "bar", "#6b3a25", "#ffffff", "#f1ece0"),
  p("caramio", "Caramio", "cikolata", "bar", "#6b3a25", "#c9791f", "#e8a53a"),
  p("canga", "Canga", "cikolata", "nutbar", "#5a2d1a", "#f3e3c3", "#c9791f"),
  p("bueno", "Kinder Bueno", "cikolata", "twin", "#6b3a25", "#f3e3c3", "#e8c383"),
  p("damak", "Damak", "cikolata", "nutbar", "#6b3a25", "#8b5a2b", "#7a4a2b"),
  p("tadelle", "Tadelle", "cikolata", "bar", "#6b3a25", "#8b5a2b", "#5a2d1a"),
  p("karam", "Eti Karam", "cikolata", "bar", "#2a1710", "#3b1f14", "#1a0e09"),

  p("cikolatali-gofret", "Çikolatalı Gofret", "gofret", "wafer", "#6b3a25", "#5a2d1a", "#e8c383"),
  p("hosbes", "Hoşbeş", "gofret", "wafer", "#e8c383", "#8b5a2b", "#f3d9a8"),
  p("dido", "Dido", "gofret", "wafer", "#6b3a25", "#8b5a2b", "#e8c383"),
  p("kitkat", "Kit Kat", "gofret", "twin", "#6b3a25", "#e8c383", "#8b5a2b"),
  p("cokonat", "Çokonat", "gofret", "wafer", "#6b3a25", "#ffffff", "#e8c383"),
  p("rulokat", "Rulokat", "gofret", "wafer", "#d9a15c", "#5a2d1a", "#e8c383"),
  p("laviva", "Laviva", "gofret", "wafer", "#3b1f14", "#f3e3c3", "#e8c383"),

  p("biskrem", "Biskrem", "biskuvi", "sandwich", "#c68a4a", "#3b1f14", "#8b5a2b"),
  p("cokoprens", "Çokoprens", "biskuvi", "sandwich", "#d9a15c", "#3b1f14", "#b9813d"),
  p("negro", "Negro", "biskuvi", "sandwich", "#2a1a12", "#fffaf0", "#120a06"),
  p("oreo", "Oreo", "biskuvi", "sandwich", "#1f1f1f", "#ffffff", "#000000"),
  p("halley", "Halley", "biskuvi", "sandwich", "#5a2d1a", "#fffaf0", "#3b1f14"),
  p("burcak", "Burçak", "biskuvi", "biscuit", "#b9813d", "#8b5a2b", "#7a4a2b"),
  p("potibor", "Pötibör", "biskuvi", "biscuit", "#e8c383", "#d9a15c", "#b9813d"),
  p("tutku", "Tutku", "biskuvi", "sandwich", "#d9a15c", "#5a2d1a", "#b9813d"),
  p("probis", "Probis", "biskuvi", "sandwich", "#c68a4a", "#fffaf0", "#8b5a2b"),
  p("eti-cin", "Eti Cin", "biskuvi", "biscuit", "#e8c383", "#d9a15c", "#ff7a00"),

  p("popkek", "Popkek", "kek", "cake", "#e8c383", "#fffaf0", "#5a2d1a"),
  p("dankek", "Dankek", "kek", "cake", "#e8c383", "#f3e3c3", "#d9a15c"),
  p("topkek", "Topkek", "kek", "cake", "#e0b877", "#5a2d1a", "#3b1f14"),
  p("browni", "Browni", "kek", "cake", "#3b1f14", "#5a2d1a", "#2a1710"),
  p("kekstra", "Kekstra", "kek", "cake", "#e8c383", "#e63946", "#5a2d1a"),
  p("luppo", "Luppo", "kek", "cake", "#5a2d1a", "#fffaf0", "#3b1f14"),
  p("olala", "O'lala", "kek", "cake", "#3b1f14", "#fffaf0", "#5a2d1a"),

  p("pingui", "Pingui", "sutlu", "layer", "#3b1f14", "#fffaf0", "#5a2d1a"),
  p("sut-dilimi", "Süt Dilimi", "sutlu", "layer", "#7a4a2b", "#fffaf0", "#5c361e"),
  p("sutburger", "Sütburger", "sutlu", "layer", "#5a2d1a", "#fffaf0", "#3b1f14"),
  p("maxi-king", "Maxi King", "sutlu", "nutbar", "#6b3a25", "#fffaf0", "#c9791f"),

  p("ruffles", "Ruffles", "cips", "chip", "#f2c84b", "#d9a531", "#b9813d"),
  p("doritos", "Doritos", "cips", "triangle", "#f08a1c", "#c96a10", "#c8102e"),
  p("lays", "Lay's", "cips", "chip", "#f6dc7a", "#e6c455", "#d9b03a"),
  p("cheetos", "Cheetos", "cips", "puff", "#ff8c1a", "#d96a0a", "#ffd24d"),
  p("pringles", "Pringles", "cips", "chip", "#f3d27a", "#e0b955", "#c8102e"),
  p("cerezza", "Çerezza", "cips", "puff", "#f2c84b", "#d9a531", "#c8102e"),
  p("patos", "Patos", "cips", "triangle", "#e8b33a", "#c9921f", "#2e7d32"),
  p("cipso", "Cipso", "cips", "chip", "#f2c84b", "#d9a531", "#e63946"),

  p("cornetto", "Cornetto", "dondurma", "cone", "#fffaf0", "#d9a15c", "#5a2d1a"),
  p("roko", "Roko", "dondurma", "cone", "#f6c6d0", "#d9a15c", "#e63946"),
  p("magnum", "Magnum", "dondurma", "stick", "#3b1f14", "#fffaf0", "#5a2d1a"),
  p("max", "Max", "dondurma", "striped", "#ff7a00", "#f4c430", "#d50000"),
  p("nogger", "Nogger", "dondurma", "stick", "#6b3a25", "#fffaf0", "#e8b96a"),
  p("twister", "Twister", "dondurma", "striped", "#7cc242", "#fffaf0", "#e63946"),
  p("calippo", "Calippo", "dondurma", "striped", "#ff7a00", "#ffb347", "#f4c430"),
  p("bravo", "Golf Bravo", "dondurma", "stick", "#5a2d1a", "#fffaf0", "#e8b96a"),

  p("bonibon", "Bonibon", "sekerleme", "drops", "#e63946", "#f4c430", "#1f6fd0"),
  p("jelibon", "Jelibon", "sekerleme", "bear", "#e63946", "#8f1d28", "#7cc242"),
  p("haribo", "Haribo", "sekerleme", "bear", "#f4c430", "#b58a10", "#e63946"),
  p("tofita", "Tofita", "sekerleme", "roll", "#ff5fa2", "#ffc2dc", "#ffffff"),
  p("olips", "Olips", "sekerleme", "roll", "#1f9bd8", "#ffffff", "#1f3fa8"),
  p("mentos", "Mentos", "sekerleme", "roll", "#ffffff", "#e8f4ff", "#1d9bd8"),
  p("falim", "Falım", "sekerleme", "gum", "#f6c6d0", "#cfd4da", "#2e7d32"),
  p("first", "First", "sekerleme", "gum", "#e8f4ff", "#cfd4da", "#1d9bd8"),
  p("vivident", "Vivident", "sekerleme", "gum", "#c9f0c0", "#cfd4da", "#1f3fa8"),
];

const byId = new Map(products.map((product) => [product.id, product]));

export const findProduct = (id: string) => byId.get(id);
export const productName = (id: string) => byId.get(id)?.name ?? id;

export type Nominee = { id: string; count: number };
export type NextPair = { category: CategoryId; a: string; b: string };

/**
 * Sıradaki kapışma: aynı kategoriden en çok seçilen ikili. Birden fazla kategori
 * yarışıyorsa ilk ikisinin toplamı en yüksek olan kazanır. `nominees` çoktan aza sıralı gelir.
 */
export function pickNextPair(nominees: Nominee[]): NextPair | null {
  const top: Partial<Record<CategoryId, Nominee[]>> = {};
  for (const nominee of nominees) {
    const product = byId.get(nominee.id);
    if (product) (top[product.category] ??= []).push(nominee);
  }
  let best: (NextPair & { score: number }) | null = null;
  for (const [category, [first, second]] of Object.entries(top) as [CategoryId, Nominee[]][]) {
    if (!second) continue;
    const score = first.count + second.count;
    if (!best || score > best.score) best = { category, a: first.id, b: second.id, score };
  }
  return best && { category: best.category, a: best.a, b: best.b };
}
