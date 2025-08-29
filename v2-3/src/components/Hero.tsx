import GlowSphere from './GlowSphere';

/**
 * The hero section introduces the organisation with a striking headline
 * and a glowing orb.  The content is left aligned while the visual
 * element occupies the right side on larger screens.  The headline uses
 * the Akony font for a distinctive look.
 */
export default function Hero() {
  return (
    <section id="hero" className="relative flex flex-col items-start justify-center overflow-hidden pt-36 pb-24 md:min-h-screen md:flex-row md:pt-32">
      <div className="z-10 flex w-full flex-col items-start gap-6 px-6 md:w-1/2 md:px-12">
        <h1 className="max-w-2xl text-4xl font-akony leading-tight tracking-tight text-white md:text-6xl">
          Kultur sichtbar
          <br />
          und hörbar
          <br />
          machen.
        </h1>
        <p className="max-w-xl text-sm text-gray-300 md:text-base">
          Ein Verein zur Förderung der Hör‑ und Sichtbarkeit von Kulturveranstaltungen
        </p>
        <span className="mt-2 text-lg font-akony uppercase tracking-widest text-magenta">Photonenkollektiv</span>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Dark vignette background to soften edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-dark" />
      </div>
      <div className="flex w-full justify-center px-6 pt-12 md:w-1/2 md:justify-end md:px-12 md:pt-0">
        <GlowSphere />
      </div>
    </section>
  );
}