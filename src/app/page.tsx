"use client";
import ModalImage from "react-modal-image";
import styles from './page.module.css'
import { Header } from './header'
import Modal from 'react-modal';
import { useEffect, useRef, useState } from "react";


type MediaType = {
  type: "image" | "video",
  src: string,
  srcAV1?: string,
}
const mediaLeft: MediaType[] = [
  { type: "image", src: "/images/2024/IMG_0822.webp" },
  { type: "video", src: "/videos/photonen-kirnhalden-24.mp4" },
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
  { type: "video", src: "/videos/gled_2024.mp4", srcAV1: "/videos/gled_2024.av1.mp4" },
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

const customModalStyles: Modal.Styles = {
  content: {
    // top: '20%',
    // left: '2%',
    // bottom: 'auto',
    // right: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
    backgroundColor: "black",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.8)"
  }

};

const VideoOrImage = ({ type, src, srcAV1, setFocusedImage }: MediaType & { setFocusedImage: (image: string) => void }) => {
  if (type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img loading="lazy"  onClick={() => setFocusedImage(src)} src={src} alt="Photonenkollektiv" style={
        {
          cursor: "pointer",
        }
      } />
    )
  } else {
    return (
      <video style={{ width: "100%", marginTop: "32px",marginBottom:"32px" }} controls>
        {srcAV1 && <source src={srcAV1} type="video/mp4; codecs=av01.0.05M.08" />}
        <source src={src} type="video/mp4" />
        Ihr Browser unterstützt das Video-Tag nicht.
      </video>
    )
  }
}


export default function Home() {
  const [focusedImage, setFocusedImage] = useState<string | undefined>(undefined);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    if (background) {
      background.style.backgroundImage = "url('/images/stars-bg.webp')";
    }
  }, [backgroundRef])

  return (
    <>
      <div ref={backgroundRef} className={styles.background}></div>
      <Header />
      <div className={styles.gallery}>
        <div className={styles.row}>
          <div className={styles.column}>
            {
              mediaLeft.map((image) => <VideoOrImage setFocusedImage={setFocusedImage} key={image.src} {...image} />)
            }
          </div>
          <div className={styles.column}>
            {
              mediaRight.map((image) => <VideoOrImage setFocusedImage={setFocusedImage} key={image.src} {...image} />)
            }
          </div>
        </div>
      </div>
      <div className={styles.services}>
        <p>Was wir anbieten:</p>
        <ul>
          <li>Beleuchtung von Veranstaltungen und Partys</li>
          <li>Beschallung durch unsere Anlage vor Ort oder mobil</li>
        </ul>
        <p>Du bist interessiert oder hast Fragen: melde dich unter <a href="mailto:info@photonenkollektiv.de" style={{ color: "pink" }}>info@photonenkollektiv.de</a></p>
      </div>
      <div className={styles.footer}>
        <div className={styles.stack}>
          <img src="/images/photonenkollektiv_logo_ohne_schrift.svg" height="40px" alt="Photonenkollektiv" />
          <p>Photonenkollektiv</p>
          <div>
            <p>Impressum:</p>
            <p>Photonenkollektiv</p>
            <p>Vaubanallee 2A</p>
            <p>79100 Freiburg im Breisgau</p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={focusedImage !== undefined}
        onRequestClose={() => setFocusedImage(undefined)}
        style={customModalStyles}
        contentLabel="Example Modal"
      >
        <div className={styles.closeBtn} onClick={() => setFocusedImage(undefined)}></div>
        <img style={{
          height: "99%",
          width: "100%",
          objectFit: "contain",
          overflowX: "hidden",
          overflowY: "hidden",
        }} src={focusedImage} alt="Photonenkollektiv" />
      </Modal>
    </>
  )
}
