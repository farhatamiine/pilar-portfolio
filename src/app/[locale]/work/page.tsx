import { getAllProjects } from '@/lib/strapi'
import { MOCK_PROJECTS } from '@/lib/mock-data'
import { WorkArchive } from '@/components/work/WorkArchive'
import type { Metadata } from 'next'

const MOCK = process.env.NEXT_PUBLIC_MOCK === 'true'

export const metadata: Metadata = {
  title: 'Work',
}

interface WorkPageProps {
  params: Promise<{ locale: string }>
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params
  const projects = MOCK ? MOCK_PROJECTS : await getAllProjects(locale)

  return <WorkArchive projects={projects} />
}
