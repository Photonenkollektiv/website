import Card from './Card';
import dynamic from 'next/dynamic';

// Dynamically import the Lottie component client-side only to avoid SSR issues
const DiscoBallLottie = dynamic(() => import('./DiscoBallLottie'), { ssr: false });

export default function ServicesSection() {
  return (
    <section id="services" className="will-animate slide-right align-left with-picto">
      <span className="section-rail" aria-hidden="true" />
      <div className="section-picto picto-services" aria-hidden="true">
        <DiscoBallLottie />
      </div>
      <h2 className="font-akony">Was wir machen</h2>
      <div className="services-grid mosaic stagger">
        <Card className="service-card big">
          <span className="icon">🎛️</span>
          <h3>Eventtechnik</h3>
          <p>Ton, Licht, Video & Signalfluss – modular skalierbar für kleine Clubs bis Open Air.</p>
        </Card>
        <Card className="service-card">
          <span className="icon">💡</span>
          <h3>Light‑Design</h3>
          <p>Story‑driven Lichtkonzepte, pixel‑mapping & atmosphärische Looks.</p>
        </Card>
        <Card className="service-card">
          <span className="icon">📦</span>
          <h3>Vermietung</h3>
          <p>Professionelles Equipment – fair, gepflegt, einsatzbereit dokumentiert.</p>
        </Card>
        <Card className="service-card">
          <span className="icon">🔧</span>
          <h3>Sonderbauten</h3>
          <p>Custom Rigs, Traversen‑Sonderlösungen & interaktive Installationen.</p>
        </Card>
      </div>
    </section>
  );
}
