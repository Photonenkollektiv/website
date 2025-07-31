"use client";
import Modal from 'react-modal';
import Image from "next/image";
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';


type MediaType = {
  type: "image" | "video",
  src: string,
  srcAV1?: string,
}
const mediaLeft: MediaType[] = [
  { type: "image", src: "/images/2024/IMG_0822.webp" },
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
]

const mediaRight: MediaType[] = [
  // { type: "video", src: "/videos/gled_2024.mp4", srcAV1: "/videos/gled_2024.av1.mp4" },
  { type: "image", src: "/images/2024/20240822_135753.webp" },
  { type: "image", src: "/images/2024/photonen-kirnhalden-24-87.webp" },
  { type: "image", src: "/images/events/20230506_214900.webp" },
  { type: "image", src: "/images/events/20240420_203008.webp" },
  { type: "image", src: "/images/events/20230513_235443.webp" },
  // { type: "image", src: "/images/events/20230804_025221.webp" },
  { type: "image", src: "/images/events/20230826_023800.webp" },
  { type: "image", src: "/images/events/20230819_215627.webp" },
  { type: "image", src: "/images/events/IMG_0864.webp" },
  { type: "image", src: "/images/events/20240430_233848.webp" },
  { type: "image", src: "/images/2024/photonen-kirnhalden-24-67.webp" },
]

const mediaTotal = [...mediaLeft, ...mediaRight];

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
      <img src={src} alt="Stage photo" onClick={() => setFocusedImage(src)} style={{ cursor: "pointer" }} />
      // <Image loading="lazy" onClick={() => setFocusedImage(src)} src={src} alt="Photonenkollektiv" style={
      //   {
      //     cursor: "pointer",
      //   }
      // } />
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

  })

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>Photonenkollektiv</div>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">Über uns</Link></li>
        </ul>
      </nav>

      <header className="hero">
        <div style={{
          display: "block",
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          /** sticky top **/
          position: "static",
          top: "0",
          /** dont stretch the image **/
          height: "auto",
          maxWidth: "50vh",
        }}>
          <svg viewBox="-50 40 260 380" xmlns="http://www.w3.org/2000/svg">
            <g fill="#fff">
              <path d="M76 0v108a32 28 0 0 0-28 23h63a32 28 0 0 0-26-23V0Z" />
              <path id="logo-glow-path" d="M80 294a18 18 0 0 0-18 19 18 18 0 0 0 18 18 18 18 0 0 0 18-18 18 18 0 0 0-18-19Z" />
              <path id="logo-glow-path" d="M80 222a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 6-7 7 7 0 0 0-6-7z" />
              <path id="logo-glow-path" d="M41 198s0 18-4 24c-5 9-16 19-16 19h1a76 76 0 0 0-22 58c4 45 36 79 81 79s75-38 78-73c0-34-9-53-26-68-3-4-9-10-11-16-4-6-3-23-3-23H41zm39 11a20 20 0 0 1 20 20 20 20 0 0 1-20 20 20 20 0 0 1-20-20 20 20 0 0 1 20-20zm0 50a53 53 0 0 1 53 54 53 53 0 0 1-53 53 53 53 0 0 1-54-53 53 53 0 0 1 54-54z" />
              <path d="M40 178h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
              <path d="M40 159h79s5 0 5 5-5 6-5 6H40s-4-1-4-6c0-4 4-5 4-5z" />
              <path d="M40 139h79s5 1 5 6-5 5-5 5H40s-4-1-4-6c0-4 4-5 4-5z" />
            </g>
          </svg>
          {/* Für alle aus dem Kollektiv, hier der Downloadlink: https://photonenkollektiv.de/images/logo.svg */}
        </div>
        <h1>Photonenkollektiv</h1>
        <p>Ein Verein zur Förderung der Hör- und Sichtbarkeit von Kulturveranstaltungen</p>
      </header >

      <section id="gallery">
        <div className="gallery-grid">
          <img src="/images/demo/stage1.png" alt="Stage photo 1" onClick={() => handleGalleryImageClick("/images/demo/stage1.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage2.png" alt="Stage photo 2" onClick={() => handleGalleryImageClick("/images/demo/stage2.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage3.png" alt="Stage photo 3" onClick={() => handleGalleryImageClick("/images/demo/stage3.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage4.png" alt="Stage photo 4" onClick={() => handleGalleryImageClick("/images/demo/stage4.png")} style={{ cursor: "pointer" }} />
          {/* <img src="/images/demo/stage5.png" alt="Stage photo 5" onClick={() => handleGalleryImageClick("/images/demo/stage5.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage6.png" alt="Stage photo 6" onClick={() => handleGalleryImageClick("/images/demo/stage6.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage7.png" alt="Stage photo 7" onClick={() => handleGalleryImageClick("/images/demo/stage7.png")} style={{ cursor: "pointer" }} />
          <img src="/images/demo/stage8.png" alt="Stage photo 8" onClick={() => handleGalleryImageClick("/images/demo/stage8.png")} style={{ cursor: "pointer" }} /> */}
        </div>
      </section>

      <section id="about">
        <h2>Über uns</h2>
        <div className="about-grid">
          <div className="text">
            <p>
              Das Photonenkollektiv ist ein gemeinnütziger Verein aus Offenburg. Unser Herz schlägt
              für Licht‑ und Eventtechnik – wir unterstützen lokale Festivals, Partys und kulturelle
              Veranstaltungen mit professioneller Bühnentechnik, kreativen Lichtinstallationen und
              individuellen Sonderbauten. Unsere Leidenschaft gilt der Verbindung von Technik und
              Kunst, und wir möchten Erlebnisse schaffen, die lange in Erinnerung bleiben.
            </p>
          </div>
          <div className="highlights">
            <div className="highlight-item">
              <span className="icon">🤝</span>
              <div className="desc">Gemeinnützig und ehrenamtlich engagiert für unsere Region</div>
            </div>
            <div className="highlight-item">
              <span className="icon">🎉</span>
              <div className="desc">Kreative Konzepte für Festivals, Clubs und Straßenfeste</div>
            </div>
            <div className="highlight-item">
              <span className="icon">⚙️</span>
              <div className="desc">Individuelle Sonderbauten und nachhaltige Lösungen</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <h2>Unsere Leistungen</h2>
        <div className="service-cards">
          <div className="service-card">
            <span className="icon">🎛️</span>
            <h3>Eventtechnik</h3>
            <p>Von Ton über Licht bis Video – wir statten eure Veranstaltungen mit modernster Technik aus.</p>
          </div>
          <div className="service-card">
            <span className="icon">💡</span>
            <h3>Light‑Design</h3>
            <p>Individuelle Lichtkonzepte, die Atmosphäre schaffen und eure Bühne zum Strahlen bringen.</p>
          </div>
          <div className="service-card">
            <span className="icon">📦</span>
            <h3>Vermietung</h3>
            <p>Vermietung von professioneller Veranstaltungstechnik, passend zu euren Bedürfnissen.</p>
          </div>
          <div className="service-card">
            <span className="icon">🔧</span>
            <h3>Sonderbauten</h3>
            <p>Wir entwickeln und bauen maßgeschneiderte Komponenten und Installationen für besondere Anforderungen.</p>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="gallery-grid">

          {mediaTotal.map((image) => (
            <VideoOrImage setFocusedImage={handleGalleryImageClick} key={image.src} {...image} />
          ))}
        </div>
      </section>


      <section id="events">
        <h2>Nächste Events</h2>
        <ul className="events-list">
          <li>
            <span className="event-date">05.08.2025</span>
            <span className="event-title">Sommerfest Offenburg</span>
            <span className="event-desc">Open‑Air Festival mit Livemusik und spektakulären Lichteffekten.</span>
          </li>
          <li>
            <span className="event-date">19.09.2025</span>
            <span className="event-title">Elektronacht im Club 42</span>
            <span className="event-desc">Deep House trifft Neonlicht – tanzt die Nacht durch!</span>
          </li>
          <li>
            <span className="event-date">07.10.2025</span>
            <span className="event-title">Streetfood & Beats</span>
            <span className="event-desc">Kulinarik, DJs und unsere maßgeschneiderte Bühnenbeleuchtung.</span>
          </li>
        </ul>
      </section>

      <section id="contact">
        <h2>Kontakt</h2>
        <form onSubmit={handleContactFormSubmit} className="contact-form">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Dein Name" required />

          <label htmlFor="email">E‑Mail</label>
          <input type="email" id="email" name="email" placeholder="deine@email.de" required />

          <label htmlFor="message">Nachricht</label>
          <textarea id="message" name="message" rows={5} placeholder="Wie können wir helfen?" required></textarea>

          <button type="submit">Absenden</button>
        </form>
      </section>

      <Modal
        isOpen={focusedImage !== undefined}
        onRequestClose={() => setFocusedImage(undefined)}
        style={customModalStyles}
        contentLabel="Example Modal"
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
