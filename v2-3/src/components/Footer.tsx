/**
 * A simple footer displayed at the bottom of the page.  It uses
 * subdued colours to avoid drawing attention away from the main
 * content.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Photonenkollektiv e.V.
    </footer>
  );
}