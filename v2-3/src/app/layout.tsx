import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Load Inter from Google.  The Akony font is pulled via a CDN link in the <head>
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Photonenkollektiv',
  description: 'Ein Verein zur Förderung der Hör‑ und Sichtbarkeit von Kulturveranstaltungen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`dark ${inter.variable}`}>
      <head>
        {/* Preconnects improve the Google Fonts loading time */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        {/* Import the Akony font; this CDN hosts the Akony typeface used for the logo */}
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/akony" />
      </head>
      <body className="bg-dark text-white font-inter">
        {children}
      </body>
    </html>
  );
}