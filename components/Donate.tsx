// Veri ücretsizdir; bağış gönüllüdür ve doğrudan kurumların kendi sitesinden yapılır.
const GROUPS = [
  {
    title: "Çocuklar",
    charities: [
      { name: "LÖSEV", url: "https://www.losev.org.tr" },
      { name: "KAÇUV", url: "https://www.kacuv.org" },
      { name: "Darüşşafaka", url: "https://www.darussafaka.org" },
      { name: "TEGV", url: "https://tegv.org" },
      { name: "Koruncuk", url: "https://koruncuk.org" },
      { name: "TOÇEV", url: "https://www.tocev.org.tr" },
    ],
  },
  {
    title: "Mehmetçik",
    charities: [
      { name: "TSKGV", url: "https://tskgv.org.tr" },
      { name: "Mehmetçik Vakfı", url: "https://www.mehmetcik.org.tr" },
    ],
  },
  {
    title: "Doğa",
    charities: [{ name: "TEMA", url: "https://www.tema.org.tr" }],
  },
];

export function Donate() {
  return (
    <aside className="donate">
      <b>İndirirken bir iyilik yap</b>
      <p>
        Veri ücretsiz ve herkese açık. İstersen, tutarı fark etmeksizin şu kurumlara kendi sitelerinden bağış yapabilirsin.
        Para bize gelmez; bu kurumlarla bir bağlantımız yok.
      </p>
      {GROUPS.map((group) => (
        <div className="downloads" key={group.title}>
          <span>{group.title}</span>
          {group.charities.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener">{c.name}</a>
          ))}
        </div>
      ))}
    </aside>
  );
}
