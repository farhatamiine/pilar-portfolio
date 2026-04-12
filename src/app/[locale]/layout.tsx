import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { NoiseOverlay } from '@/components/ui/NoiseOverlay'
import { CursorFollower } from '@/components/ui/CursorFollower'
import { cormorant, ebGaramond, dmMono } from '@/lib/fonts'
import { locales, type Locale } from '../../../i18n'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const descriptions: Record<string, string> = {
    fr: 'Artiste multidisciplinaire et art-thérapeute, spécialisée en photographie alternative, broderie et installations. Basée à Paris.',
    es: 'Artista multidisciplinaria y arteterapeuta, especializada en fotografía alternativa, bordado e instalaciones. Basada en París.',
    en: 'Multidisciplinary artist and art therapist specializing in alternative photography, embroidery, and installations. Based in Paris.',
  }
  return {
    title: { default: 'Pilar Olivero', template: '%s — Pilar Olivero' },
    description: descriptions[locale] ?? descriptions.en,
    metadataBase: new URL('https://pilarolivero.com'),
    openGraph: { type: 'website', siteName: 'Pilar Olivero' },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${cormorant.variable} ${ebGaramond.variable} ${dmMono.variable} antialiased`}>
        <NoiseOverlay />
        <CursorFollower />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Nav locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
