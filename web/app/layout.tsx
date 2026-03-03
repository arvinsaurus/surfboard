import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Surfboard — Curated bookmarks for Morva Labs',
  description: 'A shared collection of design tools, resources, and inspiration curated by the Morva Labs team.',
  icons: { icon: '/icon.png' },
  openGraph: {
    images: ['/og-image.png'],
  },
}

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            fontSize: '13px',
            fontFamily: 'inherit',
          }
        }} />
      </body>
    </html>
  )
}
