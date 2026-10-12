import { findProduct, type Shape } from "./catalog";

// Kendi piksel çizimlerimiz (64x40 ızgara); resmi ambalaj görseli kullanmıyoruz.
// Ambalaj değil, ürünün kendisi (çoğunlukla kesiti) çizilir. Her çizim, ürünün şekil
// şablonuna üç rengini uygulayarak üretilir; renklerin anlamı şablonun yanında yazar.
export type Rect = [x: number, y: number, w: number, h: number, fill: string];
type Template = (c1: string, c2: string, c3: string) => Rect[];

const SHINE = "rgba(255,255,255,0.28)";
const SHADE = "rgba(0,0,0,0.22)";
const WOOD = "#e0b877";
const NUT = "#e8b96a";

// Yuvarlatılmış köşeli dolu gövde.
const blob = (x: number, y: number, w: number, h: number, fill: string): Rect[] => [
  [x + 2, y, w - 4, h, fill],
  [x, y + 2, w, h - 4, fill],
];

const TEMPLATES: Record<Shape, Template> = {
  // kaplama, dolgu, orta şerit
  bar: (coat, fill, stripe) => [
    ...blob(4, 6, 56, 28, coat), [8, 12, 48, 16, fill], [8, 18, 48, 4, stripe], [8, 8, 20, 2, SHINE], [8, 30, 48, 2, SHADE],
  ],
  // kaplama, nuga, karamel (fıstıklı)
  nutbar: (coat, nougat, caramel) => [
    ...blob(4, 6, 56, 28, coat), [8, 11, 48, 8, caramel], [8, 19, 48, 10, nougat],
    [12, 13, 5, 4, NUT], [24, 12, 5, 4, NUT], [36, 14, 5, 4, NUT], [47, 12, 5, 4, NUT], [8, 8, 20, 2, SHINE], [8, 30, 48, 2, SHADE],
  ],
  // kaplama, iç, üst katman (iki parmak)
  twin: (coat, inner, top) => [
    ...blob(4, 4, 56, 14, coat), [8, 8, 48, 3, top], [8, 11, 48, 4, inner], [8, 5, 16, 1, SHINE],
    ...blob(4, 22, 56, 14, coat), [8, 26, 48, 3, top], [8, 29, 48, 4, inner], [8, 23, 16, 1, SHINE],
  ],
  // kaplama, krema, gofret yaprağı
  wafer: (coat, cream, leaf) => [
    ...blob(4, 5, 56, 30, coat),
    [8, 9, 48, 3, leaf], [8, 12, 48, 3, cream], [8, 15, 48, 3, leaf], [8, 18, 48, 3, cream], [8, 21, 48, 3, leaf], [8, 24, 48, 3, cream], [8, 27, 48, 3, leaf],
    [14, 9, 1, 3, SHADE], [24, 9, 1, 3, SHADE], [34, 9, 1, 3, SHADE], [44, 9, 1, 3, SHADE],
    [19, 15, 1, 3, SHADE], [29, 15, 1, 3, SHADE], [39, 15, 1, 3, SHADE], [49, 15, 1, 3, SHADE],
    [14, 21, 1, 3, SHADE], [24, 21, 1, 3, SHADE], [34, 21, 1, 3, SHADE], [44, 21, 1, 3, SHADE],
    [19, 27, 1, 3, SHADE], [29, 27, 1, 3, SHADE], [39, 27, 1, 3, SHADE], [49, 27, 1, 3, SHADE],
    [8, 6, 20, 1, SHINE],
  ],
  // bisküvi, krema, bisküvi deseni
  sandwich: (biscuit, cream, mark) => [
    ...blob(6, 5, 52, 11, biscuit), [9, 16, 46, 8, cream], ...blob(6, 24, 52, 11, biscuit),
    [12, 8, 3, 2, mark], [22, 10, 3, 2, mark], [32, 8, 3, 2, mark], [42, 10, 3, 2, mark], [50, 8, 3, 2, mark],
    [14, 29, 3, 2, mark], [26, 28, 3, 2, mark], [38, 30, 3, 2, mark], [48, 28, 3, 2, mark],
    [9, 16, 46, 1, SHADE], [10, 6, 18, 1, SHINE],
  ],
  // bisküvi, kenar dişleri, delikler (tek kat bisküvi, üstten)
  biscuit: (body, edge, hole) => [
    [8, 6, 48, 28, body],
    ...[8, 16, 24, 32, 40, 48].flatMap((x): Rect[] => [[x + 1, 3, 6, 3, edge], [x + 1, 34, 6, 3, edge]]),
    ...[8, 16, 24].flatMap((y): Rect[] => [[5, y + 1, 3, 6, edge], [56, y + 1, 3, 6, edge]]),
    ...[16, 26, 36, 46].flatMap((x): Rect[] => [[x, 12, 2, 2, hole], [x, 19, 2, 2, hole], [x, 26, 2, 2, hole]]),
    [10, 8, 16, 1, SHINE],
  ],
  // kek, krema, üst kaplama (dilim kesiti)
  cake: (sponge, cream, glaze) => [
    [4, 9, 56, 25, sponge], [4, 19, 56, 5, cream], ...blob(4, 5, 56, 8, glaze),
    [10, 13, 4, 3, glaze], [26, 13, 4, 5, glaze], [44, 13, 4, 2, glaze],
    [12, 27, 2, 2, SHADE], [22, 29, 2, 2, SHADE], [34, 27, 2, 2, SHADE], [46, 30, 2, 2, SHADE], [18, 16, 2, 2, SHADE], [38, 15, 2, 2, SHADE],
    [8, 6, 18, 1, SHINE],
  ],
  // kek, krema, kırıntı (iki kek arası krema)
  layer: (sponge, cream, crumb) => [
    [4, 6, 56, 8, sponge], [4, 14, 56, 12, cream], [4, 26, 56, 8, sponge],
    [12, 9, 3, 2, crumb], [30, 8, 3, 2, crumb], [46, 10, 3, 2, crumb], [18, 29, 3, 2, crumb], [38, 30, 3, 2, crumb], [4, 14, 56, 1, SHADE],
  ],
  // cips, tırtık gölgesi, baharat (tırtıklı oval cips)
  chip: (body, ridge, spice) => [
    [18, 5, 28, 4, body], [11, 9, 42, 4, body], [6, 13, 52, 14, body], [11, 27, 42, 4, body], [18, 31, 28, 4, body],
    [14, 10, 2, 20, ridge], [22, 6, 2, 28, ridge], [30, 5, 2, 30, ridge], [38, 6, 2, 28, ridge], [46, 10, 2, 20, ridge],
    [17, 15, 2, 2, spice], [26, 22, 2, 2, spice], [34, 12, 2, 2, spice], [42, 20, 2, 2, spice], [50, 16, 2, 2, spice],
  ],
  // cips, kenar, baharat (üçgen cips)
  triangle: (body, edge, spice) => [
    [29, 3, 6, 4, body], [26, 7, 12, 4, body], [23, 11, 18, 4, body], [20, 15, 24, 4, body], [17, 19, 30, 4, body],
    [14, 23, 36, 4, body], [11, 27, 42, 4, body], [8, 31, 48, 5, body], [8, 34, 48, 2, edge],
    [30, 10, 2, 2, spice], [26, 18, 2, 2, spice], [36, 20, 2, 2, spice], [20, 27, 2, 2, spice], [32, 28, 2, 2, spice], [44, 29, 2, 2, spice],
  ],
  // çıtır, gölge, baharat (kıvrık mısır çıtırı)
  puff: (body, shade, spice) => [
    ...blob(6, 14, 14, 12, body), ...blob(16, 8, 16, 12, body), ...blob(28, 14, 16, 14, body), ...blob(40, 8, 18, 14, body),
    [8, 23, 10, 2, shade], [30, 25, 12, 2, shade], [18, 17, 12, 2, shade], [42, 19, 14, 2, shade],
    [12, 17, 2, 2, spice], [22, 11, 2, 2, spice], [34, 18, 2, 2, spice], [48, 12, 2, 2, spice],
  ],
  // dondurma, külah, üst sos
  cone: (scoop, cone, sauce) => [
    [22, 1, 20, 3, scoop], [17, 4, 30, 11, scoop], [17, 4, 30, 3, sauce], [21, 7, 4, 3, sauce], [31, 7, 4, 5, sauce], [41, 7, 3, 2, sauce],
    [19, 15, 26, 4, cone], [21, 19, 22, 4, cone], [23, 23, 18, 4, cone], [25, 27, 14, 4, cone], [27, 31, 10, 4, cone], [29, 35, 6, 4, cone],
    [19, 18, 26, 1, SHADE], [23, 26, 18, 1, SHADE], [27, 34, 10, 1, SHADE], [26, 15, 1, 12, SHADE], [37, 15, 1, 12, SHADE],
    [20, 5, 8, 1, SHINE],
  ],
  // kaplama, iç dondurma, süs (çubuklu dondurma, ısırılmış)
  stick: (coat, inside, bits) => [
    ...blob(4, 6, 42, 28, coat), [4, 6, 10, 10, inside], [12, 6, 3, 4, inside], [4, 14, 4, 5, inside],
    [20, 11, 3, 2, bits], [30, 16, 3, 2, bits], [22, 24, 3, 2, bits], [36, 26, 3, 2, bits], [38, 10, 3, 2, bits],
    [18, 8, 20, 1, SHINE], [46, 17, 16, 6, WOOD], [46, 22, 16, 1, SHADE],
  ],
  // üç renkli şeritli buzlu dondurma
  striped: (c1, c2, c3) => [
    ...blob(4, 6, 42, 28, c1), [12, 6, 6, 28, c2], [24, 6, 6, 28, c3], [36, 6, 6, 28, c2],
    [8, 8, 20, 1, SHINE], [46, 17, 16, 6, WOOD], [46, 22, 16, 1, SHADE],
  ],
  // üç renkte draje
  drops: (c1, c2, c3) => [
    ...blob(4, 6, 16, 12, c1), ...blob(24, 4, 16, 12, c2), ...blob(44, 8, 16, 12, c3),
    ...blob(12, 22, 16, 12, c3), ...blob(34, 21, 16, 12, c1),
    [7, 8, 6, 1, SHINE], [27, 6, 6, 1, SHINE], [47, 10, 6, 1, SHINE], [15, 24, 6, 1, SHINE], [37, 23, 6, 1, SHINE],
  ],
  // jelibon ayıcık: gövde, gölge, ikinci ayıcık
  bear: (body, shade, other) => [
    ...[[8, body], [36, other]].flatMap(([x, c]): Rect[] => {
      const o = x as number;
      const fill = c as string;
      return [
        [o + 2, 3, 4, 4, fill], [o + 14, 3, 4, 4, fill], [o + 4, 5, 12, 10, fill], [o + 2, 15, 16, 14, fill],
        [o - 1, 17, 4, 6, fill], [o + 17, 17, 4, 6, fill], [o + 2, 29, 6, 6, fill], [o + 12, 29, 6, 6, fill],
        [o + 7, 9, 2, 2, shade], [o + 12, 9, 2, 2, shade], [o + 7, 19, 6, 6, SHINE],
      ];
    }),
  ],
  // şeker, ikinci renk, ambalaj (rulo şeker)
  roll: (candy, alt, wrap) => [
    [4, 10, 8, 20, wrap], [2, 13, 2, 14, wrap], ...blob(12, 8, 12, 24, candy), ...blob(25, 8, 12, 24, alt), ...blob(38, 8, 12, 24, candy), ...blob(51, 8, 10, 24, alt),
    [14, 10, 6, 1, SHINE], [27, 10, 6, 1, SHINE], [40, 10, 6, 1, SHINE], [53, 10, 5, 1, SHINE],
  ],
  // sakız, folyo, çizgi (yarısı açılmış çubuk sakız)
  gum: (gum, foil, line) => [
    [4, 12, 34, 16, gum], [10, 12, 1, 16, SHADE], [18, 12, 1, 16, SHADE], [26, 12, 1, 16, SHADE], [6, 14, 28, 1, SHINE],
    [34, 10, 26, 20, foil], [34, 10, 3, 20, SHADE], [42, 14, 14, 3, line], [42, 22, 14, 3, line],
  ],
};

// Şablona uymayan, elle çizilmiş ürünler.
const CUSTOM: Record<string, Rect[]> = {
  pingui: [[4, 6, 56, 28, "#3b1f14"], [8, 12, 48, 16, "#fffaf0"], [8, 18, 48, 4, "#5a2d1a"], [8, 8, 20, 2, "#6b3a25"]],
};

export function artRects(productId: string): Rect[] {
  const product = findProduct(productId);
  if (CUSTOM[productId]) return CUSTOM[productId];
  return product ? TEMPLATES[product.shape](...product.colors) : TEMPLATES.bar("#5a2d1a", "#e8c9a0", "#c9791f");
}
