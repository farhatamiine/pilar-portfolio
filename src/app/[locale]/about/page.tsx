import { getAboutPage, getExhibitions } from '@/lib/strapi'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutBio } from '@/components/about/AboutBio'
import { CVAccordion } from '@/components/about/CVAccordion'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('about') }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  let aboutPage: Awaited<ReturnType<typeof getAboutPage>> = null
  let exhibitions: Awaited<ReturnType<typeof getExhibitions>> = []

  try {
    ;[aboutPage, exhibitions] = await Promise.all([
      getAboutPage(locale),
      getExhibitions(locale),
    ])
  } catch (err) {
    console.error('[About] Strapi fetch failed:', err)
  }

  return (
    <>
      <AboutHero />
      <AboutBio aboutPage={aboutPage} />
      <CVAccordion exhibitions={exhibitions} />
    </>
  )
}
