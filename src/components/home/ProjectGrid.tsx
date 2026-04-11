import Link from 'next/link'
import Image from 'next/image'
import type { ProjectSummary } from '@/lib/strapi'

interface ProjectGridProps { projects: ProjectSummary[]; locale: string }

export function ProjectGrid({ projects, locale }: ProjectGridProps) {
  return (
    <div className="lg:hidden">
      <div className="px-4 pt-8 pb-4">
        <h1 className="font-cormorant text-5xl tracking-wide text-ink">Pilar Olivero</h1>
        <p className="font-mono text-xs text-muted mt-2 tracking-widest uppercase">Artiste multidisciplinaire · Paris</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 py-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/${locale}/work/${project.slug}`} className="group block">
            <div className="aspect-[4/5] bg-grain relative overflow-hidden mb-3">
              {project.featuredImage ? (
                <Image src={project.featuredImage.url} alt={project.title} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-cormorant italic text-muted px-4 text-center">{project.title}</span>
                </div>
              )}
            </div>
            <h2 className="font-cormorant text-xl italic text-ink group-hover:text-accent transition-colors">{project.title}</h2>
            <p className="font-mono text-xs text-muted mt-1">{project.year}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
