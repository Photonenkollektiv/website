import NavBar from '../../components/NavBar';
import AboutSection from '../../components/AboutSection';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <>
      <NavBar />
      {/* Padding to offset the fixed navbar */}
      <div className="pt-24" />
      <AboutSection />
      <Footer />
    </>
  );
}