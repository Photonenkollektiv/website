import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Use next/font to self-host Inter; Akony loaded via CDN link tag
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Photonenkollektiv',
  description: 'Ein Verein zur Förderung der Hör‑ und Sichtbarkeit von Kulturveranstaltungen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`dark ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/akony" />
      </head>
      <body className="bg-dark text-white font-inter">
        {children}
      </body>
    </html>
  );
}
