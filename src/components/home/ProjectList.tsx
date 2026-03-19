'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { ProjectSummary } from '@/lib/hygraph'

interface ProjectListProps { projects: ProjectSummary[] }

export function ProjectList({ projects }: ProjectListProps) {
  const locale = useLocale()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = projects[activeIndex]

  return (
    <div className="hidden lg:flex min-h-[calc(100vh-5rem)]">
      {/* Left: numbered project list */}
      <div className="w-[40vw] flex flex-col justify-center px-12 py-16">
        <div className="mb-12">
          <h1 className="font-cormorant text-6xl tracking-wide text-ink">Pilar Olivero</h1>
          <p className="font-mono text-xs text-muted mt-2 tracking-widest uppercase">
            Artiste multidisciplinaire · Paris
          </p>
        </div>
        <ol>
          {projects.map((project, i) => (
            <li key={project.id}>
              <Link
                href={`/${locale}/work/${project.slug}`}
                className="group flex items-baseline gap-4 py-3 border-b border-grain/50 hover:border-accent/50 transition-colors"
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="font-mono text-xs text-muted w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <motion.span className="block font-cormorant text-2xl text-ink leading-snug group-hover:italic transition-all" layout>
                    {project.title}
                  </motion.span>
                  <span className="font-mono text-xs text-muted">
                    {project.year}{project.subtitle ? ` · ${project.subtitle}` : ''}
                  </span>
                </span>
                <span className="font-mono text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Right: sticky image panel */}
      <div className="w-[60vw] sticky top-20 h-[calc(100vh-5rem)] overflow-hidden bg-grain" aria-hidden="true">
        <AnimatePresence mode="wait">
          {active?.featuredImage ? (
            <motion.div key={active.id} className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}>
              <Image src={active.featuredImage.url} alt={active.title} fill
                className="object-cover" sizes="60vw" priority={activeIndex === 0} />
            </motion.div>
          ) : (
            <motion.div key={`p-${active?.id}`} className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <span className="font-cormorant italic text-muted text-3xl select-none" role="presentation" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
