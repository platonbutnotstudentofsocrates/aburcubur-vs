// Veri ücretsizdir; bağış gönüllüdür ve doğrudan kurumların kendi sitesinden yapılır.
const CHARITIES = [
  { name: "LÖSEV", url: "https://www.losev.org.tr" },
  { name: "TEMA", url: "https://www.tema.org.tr" },
];

export function Donate() {
  return (
    <aside className="donate">
      <b>İndirirken bir iyilik yap</b>
      <p>
        Veri ücretsiz ve herkese açık. İstersen, tutarı fark etmeksizin şu kurumlara kendi sitelerinden bağış yapabilirsin.
        Para bize gelmez; bu kurumlarla bir bağlantımız yok.
      </p>
      <div className="downloads">
        {CHARITIES.map((c) => (
          <a key={c.name} href={c.url} target="_blank" rel="noopener">{c.name}</a>
        ))}
      </div>
    </aside>
  );
}
