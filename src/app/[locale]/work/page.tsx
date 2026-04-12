import { getAllProjects } from '@/lib/strapi'
import { MOCK_PROJECTS } from '@/lib/mock-data'
import { WorkArchive } from '@/components/work/WorkArchive'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

const MOCK = process.env.NEXT_PUBLIC_MOCK === 'true'

interface WorkPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('work') }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params
  const projects = MOCK ? MOCK_PROJECTS : await getAllProjects(locale)

  return <WorkArchive projects={projects} />
}
