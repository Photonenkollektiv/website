"use client";
import Image from 'next/image';
import { MediaType } from './media';

interface VideoOrImageProps extends MediaType {
  onSelect?: (src: string) => void;
  priority?: boolean;
}

/**
 * Renders either an image or a video.  Images are optimised using Next.js
 * and open the lightbox when clicked.  Videos use native HTML5 playback.
 */
export default function VideoOrImage({ type, src, srcAV1, onSelect, priority }: VideoOrImageProps) {
  if (type === 'image') {
    return (
      <Image
        width={800}
        height={600}
        loading={priority ? 'eager' : 'lazy'}
        onClick={() => onSelect?.(src)}
        src={src}
        alt="Gallery item"
        className="cursor-pointer rounded-md border border-white/10 shadow-md transition hover:shadow-lg"
      />
    );
  }
  return (
    <video className="my-8 w-full rounded-md border border-white/10 shadow-md" controls>
      {srcAV1 && <source src={srcAV1} type="video/mp4; codecs=av01.0.05M.08" />}
      <source src={src} type="video/mp4" />
      Ihr Browser unterstützt das Video‑Tag nicht.
    </video>
  );
}