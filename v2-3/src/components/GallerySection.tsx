import { mediaTotal } from './media';
import VideoOrImage from './VideoOrImage';

interface GallerySectionProps {
  onSelect: (src: string) => void;
}

/**
 * Displays a responsive gallery.  Images open in a lightbox when clicked.
 */
export default function GallerySection({ onSelect }: GallerySectionProps) {
  return (
    <section id="gallery" className="px-6 py-24 md:px-12">
      <h2 className="mb-8 text-3xl font-akony text-magenta">Galerie</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {mediaTotal.map(media => (
          <div key={media.src} className="overflow-hidden rounded-lg">
            <VideoOrImage {...media} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </section>
  );
}