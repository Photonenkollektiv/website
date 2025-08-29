/**
 * The about section introduces the organisation and highlights its core
 * values.  It alternates alignment with surrounding sections and uses
 * emojis to subtly reinforce each highlight without relying on external
 * icon libraries.
 */
export default function AboutSection() {
  return (
    <section id="about" className="relative flex flex-col gap-12 px-6 py-24 md:flex-row md:px-12">
      <div className="md:w-1/2">
        <h2 className="mb-6 text-3xl font-akony text-magenta">Über uns</h2>
        <p className="max-w-prose text-gray-300">
          Das Photonenkollektiv ist ein gemeinnütziger Verein aus Offenburg.
          Unser Herz schlägt für Licht‑ und Eventtechnik – wir unterstützen
          lokale Festivals, Partys und kulturelle Veranstaltungen mit
          professioneller Bühnentechnik, kreativen Lichtinstallationen und
          individuellen Sonderbauten. Unsere Leidenschaft gilt der Verbindung
          von Technik und Kunst, und wir möchten Erlebnisse schaffen, die
          lange in Erinnerung bleiben.
        </p>
      </div>
      <div className="grid gap-6 md:w-1/2">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤝</span>
          <p className="text-gray-300">
            <strong className="text-white">Gemeinnützig & engagiert</strong> – wir möchten
            unsere Region aktiv unterstützen und beleben.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎉</span>
          <p className="text-gray-300">
            <strong className="text-white">Kreative Konzepte</strong> – jedes Event
            verdient ein individuelles Licht‑Design und eine passende
            Atmosphäre.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚙️</span>
          <p className="text-gray-300">
            <strong className="text-white">Nachhaltige Sonderbauten</strong> – wir denken
            modular und bauen für die Zukunft.
          </p>
        </div>
      </div>
    </section>
  );
}