import { getAllProjects } from '@/lib/hygraph'
import { ProjectList } from '@/components/home/ProjectList'
import { ProjectGrid } from '@/components/home/ProjectGrid'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const projects = await getAllProjects(locale)
  return (
    <>
      <ProjectList projects={projects} />
      <ProjectGrid projects={projects} locale={locale} />
    </>
  )
}
