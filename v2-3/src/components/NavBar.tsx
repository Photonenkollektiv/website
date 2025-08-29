import Link from 'next/link';

/**
 * A minimal navigation bar.  It sticks to the top of the viewport and fades
 * into the background so as not to distract from the content.  On mobile the
 * links collapse into a vertical list.
 */
export default function NavBar() {
  return (
    <nav className="fixed left-0 top-0 z-20 w-full backdrop-blur-sm bg-dark/70 border-b border-dark/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* <Link href="/" className="text-2xl font-akony tracking-widest text-magenta">
          Photonenkollektiv
        </Link> */}
        <div className="hidden gap-6 text-sm md:flex">
          <Link href="#about" className="hover:text-magenta transition-colors">Über&nbsp;uns</Link>
          <Link href="#services" className="hover:text-magenta transition-colors">Leistungen</Link>
          <Link href="#gallery" className="hover:text-magenta transition-colors">Galerie</Link>
          <Link href="#events" className="hover:text-magenta transition-colors">Events</Link>
          <Link href="#contact" className="hover:text-magenta transition-colors">Kontakt</Link>
        </div>
        {/* Future: Add a mobile menu button if needed */}
      </div>
    </nav>
  );
}