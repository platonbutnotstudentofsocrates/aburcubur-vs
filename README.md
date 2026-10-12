# Abur Cubur VS

İki atıştırmalığı kapıştıran tek sayfalık anket: tek tıkla oy, il il sonuç haritası, paylaşım kartı ve "sonraki VS" önerileri.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

`DATABASE_URL` tanımlı değilse oylar `.data/` altındaki gömülü Postgres'e (PGlite) yazılır; hesap açmadan denenebilir.

## Yayına alma (Vercel)

1. Projeyi Vercel'e aktar.
2. Storage sekmesinden bir Postgres veritabanı (Neon) ekle; `DATABASE_URL` kendiliğinden tanımlanır. Tablolar ilk istekte oluşturulur.
3. `IP_SALT` ortam değişkenine rastgele bir metin yaz (IP adresleri bununla karıştırılarak saklanır).

İl tahmini Vercel'in `x-vercel-ip-country-region` başlığından gelir; yerelde boş kalır.

## Raunt akışı

İlk kapışma `lib/matchups.ts` içindeki `FIRST` ile açılır ve site ilk açıldığı andan itibaren `FIRST_ROUND_DAYS` gün sürer. Herkes sonraki raunt için katalogdan tek bir ürün seçer; süre dolunca aynı kategoriden en çok seçilen ikili (ilk ikisinin toplamı en yüksek olan kategori) kendiliğinden yeni kapışma olur ve `ROUND_DAYS` gün sürer. Kapışmış ürünler yeniden aday olamaz. Biten rauntlar "Kazananlar" listesinde kalır.

## Katalog

Ürünler ve kategoriler `lib/catalog.ts` içinde. Yeni ürün tek satırdır: kimlik, ad, kategori, şekil ve üç renk. Çizim bu şekil ve renklerden üretilir (`lib/art.ts`). Tüm ürünler `/katalog` sayfasında görülebilir.

## Harita

`data/provinces.json` ve `data/pixel-grid.json`, `node scripts/build-map.mjs` ile `data/src/tr-provinces.geojson` dosyasından üretilir. Kaynak: geoBoundaries TUR ADM1, © OpenStreetMap katkıcıları (ODbL).
