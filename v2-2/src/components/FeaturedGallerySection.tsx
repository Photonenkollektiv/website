import Image from 'next/image';
import Card from './Card';

export interface MediaItem { type: 'image' | 'video'; src: string; srcAV1?: string; }

interface Props { items: MediaItem[]; onSelect: (src: string) => void; }

export default function FeaturedGallerySection({ items, onSelect }: Props) {
  return (
    <section id="featured-gallery" className="will-animate fade-up align-left with-picto">
      <span className="section-rail" aria-hidden="true" />
      <div className="section-picto picto-gallery" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle className="trace base closed" cx="60" cy="60" r="38" pathLength={300}></circle>
          <g className="rotate-slow">
            <path className="trace accent" d="M60 18 74 46 105 50 82 72 88 102 60 88 32 102 38 72 15 50 46 46Z" pathLength={320}></path>
          </g>
          <circle className="pulse glow" cx="60" cy="60" r="6" />
        </svg>
      </div>
      <div className="gallery-grid stagger">
        {items.map(img => (
          <Card key={img.src} variant="outline" className="p-0 overflow-hidden cursor-pointer" padded={false}>
            {img.type === 'image' ? (
              <Image onClick={() => onSelect(img.src)} width={750} height={500} loading="lazy" src={img.src} alt="Photonenkollektiv" className="w-full h-full object-cover" />
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
