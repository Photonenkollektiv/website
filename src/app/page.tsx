"use client";
import Modal from 'react-modal';
import Image from "next/image";
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';

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

  // // Scroll spine path that 'grows' and reveals sections as its drawn length reaches them
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   const spine = document.querySelector('#scroll-spine path') as SVGPathElement | null;
  //   const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];
  //   if (!spine) return;
  //   const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  //   let pathLength = 0;
  //   const layout = () => {
  //     // Build a gentle polyline path that connects midpoints between alternating aligned sections
  //     const pts: { x: number; y: number }[] = [];
  //     const leftX = 90; // px from left for left aligned
  //     const rightX = 140; // slight shift when section aligns right
  //     sections.forEach((sec) => {
  //       const rect = sec.getBoundingClientRect();
  //       const scrollY = window.scrollY;
  //       const midY = rect.top + scrollY + rect.height * 0.1; // near top inside section
  //       const alignRight = sec.classList.contains('align-right');
  //       pts.push({ x: alignRight ? rightX : leftX, y: midY });
  //     });
  //     // Construct smooth path using quadratic curves
  //     if (!pts.length) return;
  //     let d = `M ${pts[0].x} ${pts[0].y}`;
  //     for (let i = 1; i < pts.length; i++) {
  //       const prev = pts[i - 1];
  //       const curr = pts[i];
  //       const cx = (prev.x + curr.x) / 2; // control point x for smoother horizontal easing
  //       d += ` Q ${cx} ${prev.y} ${curr.x} ${curr.y}`;
  //     }
  //     spine.setAttribute('d', d);
  //     pathLength = spine.getTotalLength();
  //     spine.style.strokeDasharray = pathLength.toString();
  //     // initial update of dashoffset
  //     update();
  //   };
  //   const update = () => {
  //     const scrollBottom = window.scrollY + window.innerHeight * 0.75; // progress point
  //     // Determine how much of path to reveal: proportion of page scrolled relative to last section
  //     const lastSec = sections[sections.length - 1];
  //     const endY = lastSec ? lastSec.offsetTop + lastSec.offsetHeight : document.body.scrollHeight;
  //     const progress = Math.min(1, scrollBottom / endY);
  //     const drawLength = progress * pathLength;
  //     spine.style.strokeDashoffset = (pathLength - drawLength).toString();
  //     if (!prefersReduced) {
  //       // Reveal sections whose path segment has been reached
  //       sections.forEach(sec => {
  //         const triggerY = sec.offsetTop + sec.offsetHeight * 0.1;
  //           if (!sec.classList.contains('in-view') && drawLength >= triggerY) {
  //             sec.classList.add('in-view');
  //             sec.querySelectorAll('.will-animate, .stagger').forEach(el => el.classList.add('in-view'));
  //           }
  //       })
  //     }
  //   };
  //   layout();
  //   window.addEventListener('scroll', update, { passive: true });
  //   window.addEventListener('resize', layout);
  //   return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', layout); };
  // }, []);

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
      <nav className="navbar navbar--minimal">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">Über uns</Link></li>
        </ul>
      </nav>

      <header className="hero hero--neo" aria-labelledby="site-title" aria-describedby="site-tagline">
        <div className="hero-inner">
          <div className="hero-brand-block">
            <div className="hero-logo-min">
              <svg viewBox="-50 40 260 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <g fill="#fff">
                  <path d="M76 0v108a32 28 0 0 0-28 23h63a32 28 0 0 0-26-23V0Z" />
                  <path d="M80 294a18 18 0 0 0-18 19 18 18 0 0 0 18 18 18 18 0 0 0 18-18 18 18 0 0 0-18-19Z" />
                  <path d="M80 222a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 6-7 7 7 0 0 0-6-7z" />
                  <path d="M41 198s0 18-4 24c-5 9-16 19-16 19h1a76 76 0 0 0-22 58c4 45 36 79 81 79s75-38 78-73c0-34-9-53-26-68-3-4-9-10-11-16-4-6-3-23-3-23H41zm39 11a20 20 0 0 1 20 20 20 20 0 0 1-20 20 20 20 0 0 1-20-20 20 20 0 0 1 20-20zm0 50a53 53 0 0 1 53 54 53 53 0 0 1-53 53 53 53 0 0 1-54-53 53 53 0 0 1 54-54z" />
                  <path d="M40 178h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
                  <path d="M40 159h79s5 0 5 5-5 6-5 6H40s-4-1-4-6c0-4 4-5 4-5z" />
                  <path d="M40 139h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
                </g>
              </svg>
            </div>
            <div className="hero-text">
              <h1 id="site-title" className="hero-title">PHOTONENKOLLEKTIV</h1>
              <p id="site-tagline" className="hero-tag">Förderung von Licht, Klang & Kultur – roh, direkt, technisch.</p>
            </div>
          </div>
        </div>
        <div className="hero-stripes" aria-hidden="true">
          <div className="stripe white"></div>
          <div className="stripe pink"></div>
          <div className="stripe cyan"></div>
        </div>
      </header>

  <section id="featured-gallery" className="will-animate fade-up align-left with-picto">
        <span className="section-rail" aria-hidden="true" />
        <div className="section-picto picto-gallery" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            {/* abstract lens/aperture + frame */}
            <circle className="trace base closed" cx="60" cy="60" r="38" pathLength={300}></circle>
            <g className="rotate-slow">
              <path className="trace accent" d="M60 18 74 46 105 50 82 72 88 102 60 88 32 102 38 72 15 50 46 46Z" pathLength={320}></path>
            </g>
            <circle className="pulse glow" cx="60" cy="60" r="6" />
          </svg>
        </div>
        <div className="gallery-grid stagger">
          {featuredMedia.map((image) => (
            <VideoOrImage setFocusedImage={handleGalleryImageClick} key={image.src} {...image} />
          ))}
        </div>
      </section>

  <section id="about" className="will-animate slide-left align-right with-picto">
        <span className="section-rail" aria-hidden="true" />
        <div className="section-picto picto-about" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            {/* network / community nodes */}
            <circle className="trace base closed" cx="60" cy="60" r="44" pathLength={300}></circle>
            <circle className="trace accent closed" cx="60" cy="60" r="18" pathLength={200}></circle>
            <g className="pulse">
              <circle className="glow" cx="60" cy="16" r="5" />
              <circle className="glow" cx="104" cy="60" r="5" />
              <circle className="glow" cx="16" cy="60" r="5" />
              <circle className="glow" cx="60" cy="104" r="5" />
            </g>
            <path className="trace base" d="M60 16 60 42M60 78 60 104M16 60H42M78 60H104" pathLength={220}></path>
          </svg>
        </div>
        <div className="accent-bars" aria-hidden="true">
          <div className="bar"><span className="scan" /></div>
          <div className="bar"><span className="scan" /></div>
          <div className="bar"><span className="scan" /></div>
        </div>
        <h2>Über uns</h2>
        <div className="about-grid will-animate fade-up">
          <div className="text">
            <p>
              Das Photonenkollektiv ist ein gemeinnütziger Verein aus Offenburg. Unser Herz schlägt für Licht‑ und Eventtechnik – wir unterstützen lokale Festivals, Partys und kulturelle Veranstaltungen mit professioneller Bühnentechnik, kreativen Lichtinstallationen und individuellen Sonderbauten. Unsere Leidenschaft gilt der Verbindung von Technik und Kunst, und wir möchten Erlebnisse schaffen, die lange in Erinnerung bleiben.
            </p>
          </div>
          <div className="highlights stagger">
            <div className="highlight-item">🤝 <span className="desc">Gemeinnützig & engagiert für unsere Region</span></div>
            <div className="highlight-item">🎉 <span className="desc">Kreative Konzepte für Festivals & Clubs</span></div>
            <div className="highlight-item">⚙️ <span className="desc">Individuelle Sonderbauten, nachhaltig gedacht</span></div>
          </div>
        </div>
      </section>

  <section id="services" className="will-animate slide-right align-left with-picto">
        <span className="section-rail" aria-hidden="true" />
        <div className="section-picto picto-services" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            {/* modular waveform / gear hybrid */}
            <circle className="trace base closed" cx="60" cy="60" r="40" pathLength={300}></circle>
            <g className="rotate-slow">
              <path className="trace accent" d="M60 20 68 34 84 36 74 48 76 64 60 58 44 64 46 48 36 36 52 34Z" pathLength={260}></path>
            </g>
            <path className="trace glow" d="M20 82c10-8 18-8 28 0s18 8 28 0 18-8 28 0" pathLength={280}></path>
          </svg>
        </div>
        <h2>Unsere Leistungen</h2>
        <div className="services-grid mosaic stagger">
          <div className="service-card big">
            <span className="icon">🎛️</span>
            <h3>Eventtechnik</h3>
            <p>Ton, Licht, Video & Signalfluss – modular skalierbar für kleine Clubs bis Open Air.</p>
          </div>
          <div className="service-card">
            <span className="icon">💡</span>
            <h3>Light‑Design</h3>
            <p>Story‑driven Lichtkonzepte, pixel‑mapping & atmosphärische Looks.</p>
          </div>
          <div className="service-card">
            <span className="icon">📦</span>
            <h3>Vermietung</h3>
            <p>Professionelles Equipment – fair, gepflegt, einsatzbereit dokumentiert.</p>
          </div>
          <div className="service-card">
            <span className="icon">🔧</span>
            <h3>Sonderbauten</h3>
            <p>Custom Rigs, Traversen‑Sonderlösungen & interaktive Installationen.</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-all band" style={{ padding: 16 }}>
        <div className="band-inner">
          <div className="masonry-gallery stagger">
            {mediaTotal.map((image) => (
              <div className="masonry-item" key={image.src}>
                <VideoOrImage setFocusedImage={handleGalleryImageClick} {...image} />
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="events" className="will-animate fade-up">
        <span className="section-rail" aria-hidden="true" />
        <h2>Nächste Events</h2>
        <ul className="events-timeline">
          {events.length === 0 && (
            <li>
              <span className="event-title">Aktuell keine öffentlichen Events</span>
            </li>
          )}
          {events.map((e) => {
            const start = new Date(e.startDate);
            const end = new Date(e.endDate);
            const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            return (
              <li key={e.title + e.startDate} className="will-animate">
                <span className="event-date">{fmt(start)}{fmt(end) !== fmt(start) ? ` – ${fmt(end)}` : ''}</span>
                <span className="event-title">{e.title || 'Event'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="contact" className="will-animate slide-left">
        <span className="section-rail" aria-hidden="true" />
        <h2>Kontakt</h2>
        <div className="contact-form-wrapper will-animate fade-up">
          <form onSubmit={handleContactFormSubmit} className="contact-form">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Dein Name" required />

            <label htmlFor="email">E‑Mail</label>
            <input type="email" id="email" name="email" placeholder="deine@email.de" required />

            <label htmlFor="message">Nachricht</label>
            <textarea id="message" name="message" rows={5} placeholder="Wie können wir helfen?" required></textarea>

            <button type="submit">Absenden</button>
          </form>
        </div>
      </section>

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
