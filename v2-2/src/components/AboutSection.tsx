import Card from './Card';
import dynamic from 'next/dynamic';

const WorkTeamLottie = dynamic(() => import('./WorkTeamLottie'), { ssr: false });

export default function AboutSection() {
  return (
    <section id="about" className="will-animate slide-left align-right with-picto">
      <span className="section-rail" aria-hidden="true" />
      <div className="section-picto picto-about" aria-hidden="true">
        <WorkTeamLottie />
      </div>
      <h2 className="font-akony">Über uns</h2>
      <div className="about-grid will-animate fade-up">
        <Card className="text">
          <p>
            Das Photonenkollektiv ist ein gemeinnütziger Verein aus Offenburg. Unser Herz schlägt für Licht‑ und Eventtechnik – wir unterstützen lokale Festivals, Partys und kulturelle Veranstaltungen mit professioneller Bühnentechnik, kreativen Lichtinstallationen und individuellen Sonderbauten. Unsere Leidenschaft gilt der Verbindung von Technik und Kunst, und wir möchten Erlebnisse schaffen, die lange in Erinnerung bleiben.
          </p>
        </Card>
        <div className="highlights stagger space-y-4">
          <Card className="highlight-item">🤝 <span className="desc">Gemeinnützig & engagiert für unsere Region</span></Card>
          <Card className="highlight-item">🎉 <span className="desc">Kreative Konzepte für Festivals & Clubs</span></Card>
          <Card className="highlight-item">⚙️ <span className="desc">Individuelle Sonderbauten, nachhaltig gedacht</span></Card>
        </div>
      </div>
    </section>
  );
}
