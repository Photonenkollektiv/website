export type MediaType = {
  type: 'image' | 'video';
  src: string;
  srcAV1?: string;
};

// The gallery uses a mix of images from previous years.  The public/images
// folder should contain matching assets.  You can add or remove entries
// here to customise the gallery without modifying the component logic.
export const mediaTotal: MediaType[] = [
  { type: 'image', src: '/images/2025/01.webp' },
  { type: 'image', src: '/images/2025/10.webp' },
  { type: 'image', src: '/images/2025/08.webp' },
  { type: 'image', src: '/images/2025/02.webp' },
  { type: 'image', src: '/images/2025/09.webp' },
  { type: 'image', src: '/images/2025/06.webp' },
  { type: 'image', src: '/images/2025/03.webp' },
  { type: 'image', src: '/images/2025/04.webp' },
  { type: 'image', src: '/images/2025/05.webp' },
  { type: 'image', src: '/images/2025/07.webp' },
  { type: 'image', src: '/images/2024/IMG_0822.webp' },
  { type: 'image', src: '/images/2024/20240822_135753.webp' },
  { type: 'image', src: '/images/2024/photonen-kirnhalden-24-87.webp' },
  { type: 'image', src: '/images/2024/20240119_232427.webp' },
  { type: 'image', src: '/images/2024/20240726_220354.webp' },
  { type: 'image', src: '/images/events/IMG_0221.webp' },
  { type: 'image', src: '/images/events/20230804_021519.webp' },
  { type: 'image', src: '/images/events/20240503_210821.webp' },
  { type: 'image', src: '/images/events/20240420_001734.webp' },
  { type: 'image', src: '/images/events/20230518_004455.webp' },
  { type: 'image', src: '/images/events/IMG_0031.webp' },
  { type: 'image', src: '/images/events/signal-2023-02-28-193950.webp' },
  { type: 'image', src: '/images/events/20230506_214900.webp' },
  { type: 'image', src: '/images/events/20240420_203008.webp' },
  { type: 'image', src: '/images/events/20230513_235443.webp' },
  { type: 'image', src: '/images/events/20230826_023800.webp' },
  { type: 'image', src: '/images/events/20230819_215627.webp' },
  { type: 'image', src: '/images/events/IMG_0864.webp' },
  { type: 'image', src: '/images/events/20240430_233848.webp' },
  { type: 'image', src: '/images/2024/photonen-kirnhalden-24-67.webp' }
];

export const featuredMedia: MediaType[] = [
  { type: 'image', src: '/images/2025/01.webp' },
  { type: 'image', src: '/images/2024/IMG_0822.webp' },
  { type: 'image', src: '/images/2025/02.webp' },
  { type: 'image', src: '/images/2025/04.webp' }
];