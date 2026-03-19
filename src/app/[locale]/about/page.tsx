import { getSiteMeta, getExhibitions } from '@/lib/hygraph'
import { Bio } from '@/components/about/Bio'
import { CVAccordion } from '@/components/about/CVAccordion'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params

  // Both may fail if Hygraph not configured — handle gracefully
  let siteMeta = null
  let exhibitions: Awaited<ReturnType<typeof getExhibitions>> = []

  try {
    [siteMeta, exhibitions] = await Promise.all([
      getSiteMeta(locale),
      getExhibitions(locale),
    ])
  } catch {
    // Graceful fallback when CMS unavailable
  }

  return (
    <div>
      {siteMeta && <Bio siteMeta={siteMeta} />}
      <CVAccordion exhibitions={exhibitions} />
    </div>
  )
}
