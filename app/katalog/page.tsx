import { Snack } from "@/components/Snack";
import { categories, products, type CategoryId } from "@/lib/catalog";

export const metadata = { title: "Katalog — Abur Cubur VS" };

// Aday olabilecek tüm ürünler ve çizimleri.
export default function Katalog() {
  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">KATALOG</h1>
        <span className="round">{products.length} ürün</span>
      </header>
      {(Object.keys(categories) as CategoryId[]).map((id) => (
        <section className="next" key={id}>
          <h2>{categories[id]}</h2>
          <div className="catalog">
            {products.filter((p) => p.category === id).map((p) => (
              <div key={p.id}>
                <Snack product={p.id} />
                {p.name}
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
