import Image from 'next/image';
import Card from './Card';
import { MediaItem } from './FeaturedGallerySection';

interface Props { items: MediaItem[]; onSelect: (src: string) => void; }

export default function GallerySection({ items, onSelect }: Props) {
  return (
    <section id="gallery" className="gallery-all band" style={{ padding: 16 }}>
      <div className="band-inner">
        <div className="masonry-gallery stagger">
          {items.map(img => (
            <div className="masonry-item" key={img.src}>
              <Card className="p-0 overflow-hidden cursor-pointer" padded={false}>
                {img.type === 'image' ? (
                  <Image onClick={() => onSelect(img.src)} width={600} height={400} loading="lazy" src={img.src} alt="Photonenkollektiv" className="w-full h-auto object-cover" />
                ) : null}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
