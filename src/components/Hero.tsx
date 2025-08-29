import GlowSphere from './GlowSphere';

export default function Hero() {
  return (
  <section id="hero" className="relative flex min-h-[90vh] flex-col items-start justify-center overflow-hidden py-24 md:flex-row md:py-32">
      <div className="z-10 flex w-full flex-col items-start gap-6 px-6 md:w-1/2 md:px-12">
        <h1 className="max-w-2xl text-4xl font-akony leading-tight tracking-tight text-white md:text-6xl">
          Kultur sichtbar<br />und hörbar<br />machen.
        </h1>
        <p className="max-w-xl text-sm text-gray-300 md:text-base">
          Ein Verein zur Förderung der Hör‑ und Sichtbarkeit von Kulturveranstaltungen
        </p>
        <span className="mt-2 text-2xl font-akony uppercase tracking-widest text-magenta">Photonenkollektiv</span>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-dark" />
      </div>
      <div className="flex w-full justify-center px-6 md:w-1/2 md:justify-end md:px-12">
        <GlowSphere />
      </div>
    </section>
  );
}
