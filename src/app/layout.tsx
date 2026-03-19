import type { Metadata } from 'next'
import { cormorant, ebGaramond, dmMono } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pilar Portfolio',
  description: 'Personal portfolio site',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
