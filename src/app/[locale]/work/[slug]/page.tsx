import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug } from '@/lib/strapi'
import { locales, type Locale } from '../../../../../i18n'
import { setRequestLocale } from 'next-intl/server'

// Deduplicate: generateMetadata and the page component both need the project.
// React.cache memoises the result within a single request so Strapi is only hit once.
const getCachedProject = cache(getProjectBySlug)
import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectStatement } from '@/components/project/ProjectStatement'
import { ProjectImageGallery } from '@/components/project/ProjectImageGallery'
import { ProjectNav } from '@/components/project/ProjectNav'
import { ReadingProgress } from '@/components/project/ReadingProgress'

interface ProjectPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    try {
      const projects = await getAllProjects(locale)
      for (const project of projects) {
        params.push({ locale, slug: project.slug })
      }
    } catch {
      // CMS may not be reachable at build time in CI — return empty array
    }
  }
  return params
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const project = await getCachedProject(slug, locale)
    if (!project) return { title: 'Pilar Olivero' }
    return {
      title: project.title,
      description: project.shortDescription ?? undefined,
      openGraph: {
        title: project.title,
        images: project.coverImage?.url ? [{ url: project.coverImage.url }] : [],
      },
    }
  } catch {
    return { title: 'Pilar Olivero' }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  // Parallelise — project detail and sibling list are independent requests
  let project
  let allProjects
  try {
    ;[project, allProjects] = await Promise.all([
      getCachedProject(slug, locale),
      getAllProjects(locale),
    ])
  } catch {
    notFound()
  }
  if (!project) notFound()

  const idx = allProjects.findIndex((p) => p.slug === slug)
  const prev = idx > 0 ? allProjects[idx - 1] : null
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null

  return (
    <article>
      <ReadingProgress />
      <ProjectHero coverImage={project.coverImage} featuredImage={project.featuredImage} title={project.title} />
      <div className="px-6 md:px-0 max-w-[720px] mx-auto mt-16 md:mt-20">
        <h1 className="font-cormorant italic text-title text-ink leading-head">{project.title}</h1>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted mt-4">
          {project.year}{project.subtitle ? ` · ${project.subtitle}` : ''}
        </p>
      </div>
      <ProjectStatement description={project.description} />
      <ProjectImageGallery images={project.gallery} title={project.title} />
      <ProjectNav prev={prev} next={next} locale={locale} />
    </article>
  )
}
