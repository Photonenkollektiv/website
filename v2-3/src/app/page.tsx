"use client";
import { useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import GallerySection from '../components/GallerySection';
import EventsSection from '../components/EventsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ImageModal from '../components/ImageModal';
import useScrollReveal from '../components/useScrollReveal';

// Determine the backend URL based on whether we are running locally or in
// production.  This mirrors the previous implementation but can be
// configured as needed.
let RENATE_BACKEND_URL = 'https://renate.photonenkollektiv.de';
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  RENATE_BACKEND_URL = 'http://localhost:3000';
}

export default function Home() {
  const [focusedImage, setFocusedImage] = useState<string | undefined>(undefined);
  useScrollReveal();

  return (
    <>
      {/* <NavBar /> */}
      <Hero />
      {/* Wrap sections in containers with the .reveal class so they animate on scroll */}
      <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <AboutSection />
      </div>
      <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <ServicesSection />
      </div>
      <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <GallerySection onSelect={setFocusedImage} />
      </div>
      <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <EventsSection backendBase={RENATE_BACKEND_URL} />
      </div>
      <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <ContactSection />
      </div>
      <Footer />
      <ImageModal src={focusedImage} onClose={() => setFocusedImage(undefined)} />
    </>
  );
}