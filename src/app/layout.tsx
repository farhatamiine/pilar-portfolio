import type { Metadata } from 'next'
import { cormorant, ebGaramond, dmMono } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pilar Olivero',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cormorant.variable} ${ebGaramond.variable} ${dmMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
