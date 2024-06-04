"use client";
import ModalImage from "react-modal-image";
import styles from './page.module.css'
import { Header } from './header'
import Modal from 'react-modal';
import { useState } from "react";

const images = [
  "/images/events/20230819_215627.webp",
  "/images/events/signal-2023-02-28-193950.webp",
  "/images/events/20230506_214900.webp",
  "/images/events/IMG_0221.webp",
  "/images/events/20230513_235443.webp",
  "/images/events/20230804_021519.webp",
  "/images/events/20230804_025221.webp",
  "/images/events/20230518_004455.webp",
  "/images/events/20230826_023800.webp",
  "/images/events/signal-2023-03-26-223441_013.webp",
  "/images/events/IMG_0864.webp",
  "/images/events/IMG_0031.webp",
  "/images/events/20240430_233848.webp",
  "/images/events/20240503_210821.webp",
  "/images/events/20240420_203008.webp",
  "/images/events/20240420_001734.webp",
]

const evenImages = images.filter((_, index) => index % 2 === 0);
const oddImages = images.filter((_, index) => index % 2 !== 0);

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


export default function Home() {
  const [focusedImage, setFocusedImage] = useState<string | undefined>(undefined);

  // const handleClick = (index: number) => setIndex(index);

  return (
    <>
      <div className={styles.background}></div>
      <Header />
      <div className={styles.gallery}>
        <div className={styles.row}>
          <div className={styles.column}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              oddImages.map((image, index) => <img key={image} src={image} alt="Photonenkollektiv" style={
                {
                  cursor: "pointer",
                }
              } onClick={() => setFocusedImage(image)} />)
            }
          </div>
          <div className={styles.column}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              evenImages.map((image, index) => <img key={image} src={image} alt="Photonenkollektiv" style={
                {
                  cursor: "pointer",
                }
              } onClick={() => setFocusedImage(image)} />)
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
        <p>Du bist interessiert oder hast Fragen: melde dich unter <a href="mailto:info@photonenkollektiv.de">info@photonenkollektiv.de</a></p>
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
