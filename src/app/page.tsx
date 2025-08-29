"use client";
import Modal from 'react-modal';
import Image from "next/image";
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import FeaturedGallerySection from '../components/FeaturedGallerySection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import GallerySection from '../components/GallerySection';
import EventsSection from '../components/EventsSection';
import ContactSection from '../components/ContactSection';

// Determine backend URL client-side to avoid SSR window reference
let RENATE_BACKEND_URL = 'https://renate.photonenkollektiv.de';
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  RENATE_BACKEND_URL = 'http://localhost:3000';
}


type MediaType = {
  type: "image" | "video",
  src: string,
  srcAV1?: string,
}

const mediaTotal: MediaType[] = [
  { type: "image", src: "/images/2025/01.webp" },
  { type: "image", src: "/images/2025/10.webp" },
  { type: "image", src: "/images/2025/08.webp" },
  { type: "image", src: "/images/2025/02.webp" },
  { type: "image", src: "/images/2025/09.webp" },
  { type: "image", src: "/images/2025/06.webp" },
  { type: "image", src: "/images/2025/03.webp" },
  { type: "image", src: "/images/2025/04.webp" },
  { type: "image", src: "/images/2025/05.webp" },
  { type: "image", src: "/images/2025/07.webp" },
  { type: "image", src: "/images/2024/IMG_0822.webp" },
  { type: "image", src: "/images/2024/20240822_135753.webp" },
  { type: "image", src: "/images/2024/photonen-kirnhalden-24-87.webp" },
  // { type: "video", src: "/videos/photonen-kirnhalden-24.mp4" },
  { type: "image", src: "/images/2024/20240119_232427.webp" },
  { type: "image", src: "/images/2024/20240726_220354.webp" },
  { type: "image", src: "/images/events/IMG_0221.webp" },
  { type: "image", src: "/images/events/20230804_021519.webp" },
  { type: "image", src: "/images/events/20240503_210821.webp" },
  { type: "image", src: "/images/events/20240420_001734.webp" },
  { type: "image", src: "/images/events/20230518_004455.webp" },
  // { type: "image", src: "/images/events/signal-2023-03-26-223441_013.webp" },
  { type: "image", src: "/images/events/IMG_0031.webp" },
  { type: "image", src: "/images/events/signal-2023-02-28-193950.webp" },
  // { type: "video", src: "/videos/gled_2024.mp4", srcAV1: "/videos/gled_2024.av1.mp4" },
  { type: "image", src: "/images/events/20230506_214900.webp" },
  { type: "image", src: "/images/events/20240420_203008.webp" },
  { type: "image", src: "/images/events/20230513_235443.webp" },
  // { type: "image", src: "/images/events/20230804_025221.webp" },
  { type: "image", src: "/images/events/20230826_023800.webp" },
  { type: "image", src: "/images/events/20230819_215627.webp" },
  { type: "image", src: "/images/events/IMG_0864.webp" },
  { type: "image", src: "/images/events/20240430_233848.webp" },
  { type: "image", src: "/images/2024/photonen-kirnhalden-24-67.webp" },
];

const featuredMedia: MediaType[] = [
  { type: "image", src: "/images/2025/01.webp" },
  { type: "image", src: "/images/2024/IMG_0822.webp" },
  { type: "image", src: "/images/2025/02.webp" },
  { type: "image", src: "/images/2025/04.webp" },
];

const customModalStyles: Modal.Styles = {
  content: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: "black",
    border: 'none',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 999
  }
};

const VideoOrImage = ({ type, src, srcAV1, setFocusedImage }: MediaType & { setFocusedImage: (image: string) => void }) => {
  if (type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      // <img src={src} alt="Stage photo" onClick={() => setFocusedImage(src)} style={{ cursor: "pointer" }} />
      <Image width={750} height={500} loading="lazy" onClick={() => setFocusedImage(src)} src={src} alt="Photonenkollektiv" style={{
        cursor: "pointer",
        width: "100%"
      }} />
    )
  } else {
    return (
      <video style={{ width: "100%", marginTop: "32px", marginBottom: "32px" }} controls>
        {srcAV1 && <source src={srcAV1} type="video/mp4; codecs=av01.0.05M.08" />}
        <source src={src} type="video/mp4" />
        Ihr Browser unterstützt das Video-Tag nicht.
      </video>
    )
  }
}


export default function Home() {
  const [focusedImage, setFocusedImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<{ title: string; startDate: string; endDate: string }[]>([]);

  const handleContactFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const name = formData.get('name') as string;
    alert(`Vielen Dank, ${name || 'Freund/in'}! Wir werden uns bald bei dir melden.`);
    evt.currentTarget.reset();
  };

  const handleGalleryImageClick = (src: string) => {
    setFocusedImage(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFocusedImage(undefined);
  };

  useEffect(() => {
    // Fetch next public events from Renate backend
    const fetchEvents = async () => {
      try {
        const base = RENATE_BACKEND_URL;
        const res = await fetch(`${base}/customerapi/public-events`);
        if (!res.ok) return;
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        // ignore on homepage
      }
    };
    fetchEvents();
  }, [])

  // Scroll reveal animations
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const animated = Array.from(document.querySelectorAll('.will-animate, .stagger')) as HTMLElement[];
    if (!animated.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    animated.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <svg id="scroll-spine" aria-hidden="true">
        <defs>
          <linearGradient id="spine-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f4008f" />
            <stop offset="85%" stopColor="#00f1ff" />
          </linearGradient>
        </defs>
        {/* <path d="" strokeDasharray="0" strokeDashoffset="0" /> */}
      </svg>
      <Hero />

      <FeaturedGallerySection items={featuredMedia} onSelect={handleGalleryImageClick} />
      <AboutSection />
      <ServicesSection />

      <GallerySection items={mediaTotal} onSelect={handleGalleryImageClick} />


      <EventsSection events={events} />

      <ContactSection onSubmit={handleContactFormSubmit} />

      <Modal
        isOpen={focusedImage !== undefined}
        onRequestClose={() => setFocusedImage(undefined)}
        style={customModalStyles}
      // contentLabel="Example Modal"
      >
        <button
          className="closeBtn"
          onClick={() => setFocusedImage(undefined)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '3rem',
            cursor: 'pointer',
            zIndex: 1001,
            fontFamily: 'Arial, sans-serif',
            lineHeight: 1,
            padding: '0',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close modal"
        >
          ×
        </button>
        <Image
          width={1200}
          height={800}
          style={{
            height: "95vh",
            width: "auto",
            objectFit: "contain",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
          src={focusedImage ?? ""}
          alt="Photonenkollektiv"
        />
      </Modal>
      <footer>
        © 2025 Photonenkollektiv e.V.
      </footer>
    </>
  )
}
