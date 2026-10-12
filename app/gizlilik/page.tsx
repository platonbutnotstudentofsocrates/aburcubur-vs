import Link from "next/link";

export const metadata = { title: "Gizlilik — Abur Cubur VS" };

export default function Gizlilik() {
  return (
    <main className="card">
      <header className="top">
        <h1 className="logo">GİZLİLİK</h1>
      </header>
      <div className="prose">
        <p>Bu site eğlence amaçlı bir ankettir. Üyelik yoktur; ad, e-posta ya da telefon istenmez.</p>

        <h2>Ne tutuyoruz</h2>
        <ul>
          <li><b>Oyun ve adayın.</b> Hangi ürüne oy verdiğin ve sonraki raunt için hangi ürünü seçtiğin.</li>
          <li><b>Rastgele bir tarayıcı kimliği.</b> Aynı tarayıcıdan ikinci kez oy verilmesin diye bir çerezde saklanır. Seni tanımlayan bir bilgi içermez.</li>
          <li><b>İl.</b> IP adresinden yalnızca il düzeyinde tahmin edilir, istersen kendin düzeltebilirsin. Haritada toplu sonuç göstermek için oyunla birlikte saklanır. İlçe, adres ya da konum tutulmaz.</li>
          <li><b>IP adresinin özeti.</b> IP adresinin kendisi kaydedilmez. Tek bir ağdan toplu oy atılmasını önlemek için geri döndürülemeyen bir özeti tutulur ve raunt bitince silinir.</li>
        </ul>

        <h2>Ne yapmıyoruz</h2>
        <ul>
          <li>Reklam ya da izleme çerezi kullanmıyoruz.</li>
          <li>Verileri kimseyle paylaşmıyor, satmıyoruz.</li>
          <li>Sonuçları yalnızca toplu sayılar olarak yayımlıyoruz. Biten rauntların il bazındaki sayıları <Link href="/veri">Veri</Link> sayfasında herkese açıktır; tek tek oylar ve tarayıcı kimlikleri yayımlanmaz.</li>
        </ul>

        <h2>Silme</h2>
        <p>Tarayıcının çerezlerini silersen oyunla aranda bağ kalmaz.</p>

        <h2>İletişim</h2>
        <p>Soruların ve taleplerin için: <a href="mailto:aburcuburvs@gmail.com">aburcuburvs@gmail.com</a></p>
      </div>
      <Link className="back" href="/">‹ Kapışmaya dön</Link>
    </main>
  );
}
