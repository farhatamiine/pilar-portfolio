import { getAboutPage, getExhibitions } from '@/lib/hygraph'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutBio } from '@/components/about/AboutBio'
import { CVAccordion } from '@/components/about/CVAccordion'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

const MOCK = process.env.NEXT_PUBLIC_MOCK === 'true'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params

  let exhibitions: Awaited<ReturnType<typeof getExhibitions>> = []
  let aboutPage = null

  if (!MOCK) {
    try {
      ;[aboutPage, exhibitions] = await Promise.all([
        getAboutPage(locale),
        getExhibitions(locale),
      ])
    } catch { /* graceful fallback */ }
  }

  return (
    <>
      <AboutHero />
      <AboutBio aboutPage={aboutPage} />
      <CVAccordion exhibitions={exhibitions} />
    </>
  )
}
