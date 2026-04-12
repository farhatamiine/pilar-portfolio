import { getAboutPage, getExhibitions } from '@/lib/strapi'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutBio } from '@/components/about/AboutBio'
import { CVAccordion } from '@/components/about/CVAccordion'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

const MOCK = process.env.NEXT_PUBLIC_MOCK === 'true'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('about') }
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
    } catch (err) { console.error('[About] Strapi fetch failed:', err) }
  }

  return (
    <>
      <AboutHero />
      <AboutBio aboutPage={aboutPage} />
      <CVAccordion exhibitions={exhibitions} />
    </>
  )
}
