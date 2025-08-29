"use client";
import Modal from 'react-modal';
import Image from 'next/image';
import { useEffect } from 'react';

// Set the app element to body to improve accessibility and prevent screen readers
// from reading content outside of the modal when it is open.
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

interface ImageModalProps {
  src?: string;
  onClose: () => void;
}

export default function ImageModal({ src, onClose }: ImageModalProps) {
  // Prevent scrolling of the background when the modal is open
  useEffect(() => {
    if (src) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [src]);

  return (
    <Modal
      isOpen={!!src}
      onRequestClose={onClose}
      style={{
        content: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: 'none',
          backgroundColor: 'rgba(0,0,0,0.9)',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 999,
        },
      }}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-5xl text-white/80 hover:text-white focus:outline-none"
        aria-label="Close image"
      >
        ×
      </button>
      {src && (
        <Image
          src={src}
          alt="Gallery image"
          width={1200}
          height={800}
          className="max-h-[95vh] w-auto select-none"
          style={{ objectFit: 'contain' }}
        />
      )}
    </Modal>
  );
}