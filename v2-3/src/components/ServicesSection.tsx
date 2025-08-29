import Card from './Card';

/**
 * Lists the core services of the Photonenkollektiv.  Cards use a
 * translucent gradient background and respond to hover with a slight
 * scale and shadow.  The mosaic layout rearranges itself on larger
 * screens.
 */
export default function ServicesSection() {
  return (
    <section id="services" className="relative px-6 py-24 md:px-12">
      <h2 className="mb-8 text-3xl font-akony text-magenta">Unsere Leistungen</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        <Card icon={<span>🎛️</span>} title="Eventtechnik" big>
          Ton, Licht, Video & Signalfluss – modular skalierbar für kleine
          Clubs bis Open Air.
        </Card>
        <Card icon={<span>💡</span>} title="Light‑Design">
          Story‑driven Lichtkonzepte, pixel‑mapping & atmosphärische Looks.
        </Card>
        <Card icon={<span>📦</span>} title="Vermietung">
          Professionelles Equipment – fair, gepflegt, einsatzbereit dokumentiert.
        </Card>
        <Card icon={<span>🔧</span>} title="Sonderbauten">
          Custom Rigs, Traversen‑Sonderlösungen & interaktive Installationen.
        </Card>
      </div>
    </section>
  );
}