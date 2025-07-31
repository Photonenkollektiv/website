import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photonenkollektiv',
  description: 'Ein Verein zur Förderung der Hör- und Sichtbarkeit von Kulturveranstaltungen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
