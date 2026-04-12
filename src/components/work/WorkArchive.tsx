'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import type { ProjectSummary } from '@/lib/strapi'

const ease = [0.16, 1, 0.3, 1] as const

const FILTERS = ['All', 'Textile', 'Photography', 'Performance', 'Installation'] as const
type Filter = (typeof FILTERS)[number]

const FILTER_KEYS: Record<Filter, string> = {
  All: 'filters.all',
  Textile: 'filters.textile',
  Photography: 'filters.photography',
  Performance: 'filters.performance',
  Installation: 'filters.installation',
}

// Derive category from subtitle (mock data only — real data uses Category relation)
function getCategory(project: ProjectSummary): string {
  const s = (project.subtitle ?? '').toLowerCase()
  if (s.includes('textile') || s.includes('bordado') || s.includes('tisseuse')) return 'Textile'
  if (s.includes('foto') || s.includes('photo') || s.includes('35mm') || s.includes('cianotipo')) return 'Photography'
  if (s.includes('performance')) return 'Performance'
  if (s.includes('install') || s.includes('instalación') || s.includes('résidence') || s.includes('murs')) return 'Installation'
  return 'Other'
}

interface WorkArchiveProps { projects: ProjectSummary[] }

export function WorkArchive({ projects }: WorkArchiveProps) {
  const locale = useLocale()
  const t = useTranslations('home')
  const [filter, setFilter] = useState<Filter>('All')

  const visible = filter === 'All'
    ? projects
    : projects.filter(p => getCategory(p) === filter)

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-8 md:px-20 pt-36 pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <motion.p
            className="font-mono text-label tracking-label uppercase text-ink/50 mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            {t('archiveLabel')}
          </motion.p>
          <motion.h1
            className="font-cormorant italic text-headline text-ink leading-display"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {t('obraLabel')}
          </motion.h1>
        </div>

        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-label tracking-label uppercase px-4 py-2 border transition-colors ${
                filter === f
                  ? 'border-ink bg-ink text-paper'
                  : 'border-grain text-ink/50 hover:border-accent hover:text-accent'
              }`}
            >
              {t(FILTER_KEYS[f] as Parameters<typeof t>[0])}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Grid ───────────────────────────────────────── */}
      <div className="px-8 md:px-20 pb-32">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16"
          layout
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                locale={locale}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, locale }: { project: ProjectSummary; index: number; locale: string }) {
  const t = useTranslations('home')
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/${locale}/work/${project.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-grain mb-5">
          {project.featuredImage ? (
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={project.featuredImage.url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="font-cormorant italic text-ink/50 text-center text-subhead">{project.title}</span>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="font-mono text-label tracking-label uppercase text-paper border border-paper/60 px-5 py-2.5">
              {t('viewWork')}
            </span>
          </motion.div>
        </div>

        {/* Meta */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-cormorant text-subhead text-ink group-hover:italic transition-all duration-200 leading-snug">
              {project.title}
            </h2>
            <p className="font-mono text-label text-ink/50 tracking-meta mt-1">
              {project.year}
              {project.subtitle ? ` · ${project.subtitle.split(' · ')[0]}` : ''}
            </p>
          </div>
          <span className="font-mono text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0">
            →
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
