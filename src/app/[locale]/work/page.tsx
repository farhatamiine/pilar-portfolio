import { getAllProjects } from '@/lib/strapi'
import { WorkArchive } from '@/components/work/WorkArchive'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

interface WorkPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('work') }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  let projects: Awaited<ReturnType<typeof getAllProjects>> = []
  try {
    projects = await getAllProjects(locale)
  } catch (err) {
    console.error('[Work] Strapi fetch failed:', err)
  }
  return <WorkArchive projects={projects} />
}
