// Veri ücretsizdir; bağış gönüllüdür ve doğrudan kurumların kendi sitesinden yapılır.
// Listede yalnızca köklü, yaygın olarak bilinen kurumlar ve resmi site adresleri yer alır.
const GROUPS: { title: string; charities: [name: string, url: string][] }[] = [
  {
    title: "Çocuklar",
    charities: [
      ["LÖSEV", "https://www.losev.org.tr"],
      ["KAÇUV", "https://www.kacuv.org"],
      ["Darüşşafaka", "https://www.darussafaka.org"],
      ["TEGV", "https://tegv.org"],
      ["Koruncuk", "https://koruncuk.org"],
      ["TOÇEV", "https://www.tocev.org.tr"],
      ["Spastik Çocuklar Vakfı", "https://www.tscv.org.tr"],
    ],
  },
  {
    title: "Mehmetçik",
    charities: [
      ["TSKGV", "https://tskgv.org.tr"],
      ["Mehmetçik Vakfı", "https://www.mehmetcik.org.tr"],
    ],
  },
  {
    title: "Afet ve acil yardım",
    charities: [
      ["Türk Kızılay", "https://www.kizilay.org.tr"],
      ["AKUT", "https://www.akut.org.tr"],
    ],
  },
  { title: "Eğitim", charities: [["Türk Eğitim Vakfı", "https://www.tev.org.tr"]] },
  {
    title: "Sağlık",
    charities: [
      ["Türk Kalp Vakfı", "https://tkv.org.tr"],
      ["Türk Böbrek Vakfı", "https://www.tbv.com.tr"],
      ["TOFD", "https://tofd.org.tr"],
    ],
  },
  { title: "Hayvanlar", charities: [["HAYTAP", "https://www.haytap.org"]] },
  {
    title: "Doğa",
    charities: [
      ["TEMA", "https://www.tema.org.tr"],
      ["WWF-Türkiye", "https://www.wwf.org.tr"],
    ],
  },
];

export function Donate({ open = false }: { open?: boolean }) {
  return (
    <aside className="donate">
      <b>İndirirken bir iyilik yap</b>
      <p>
        Veri ücretsiz ve herkese açık. İstersen, tutarı fark etmeksizin şu kurumlara kendi sitelerinden bağış yapabilirsin.
        Para bize gelmez; bu kurumlarla bir bağlantımız yok.
      </p>
      <details open={open}>
        <summary>Kurumları göster</summary>
        {GROUPS.map((group) => (
          <div className="group" key={group.title}>
            <span>{group.title}</span>
            <div className="downloads">
              {group.charities.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener">{name}</a>
              ))}
            </div>
          </div>
        ))}
      </details>
    </aside>
  );
}
