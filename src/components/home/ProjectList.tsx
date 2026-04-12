'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import type { ProjectSummary } from '@/lib/strapi'

interface ProjectListProps { projects: ProjectSummary[] }

const ease = [0.16, 1, 0.3, 1] as const

export function ProjectList({ projects }: ProjectListProps) {
  const locale = useLocale()
  const t = useTranslations('home')
  const [activeIndex, setActiveIndex] = useState(0)
  const active = projects[activeIndex]

  return (
    <section className="hidden lg:flex min-h-screen bg-paper">

      {/* ── Left: numbered project list ──────────────────────── */}
      <div className="w-[42vw] flex flex-col justify-center px-14 py-20">

        <motion.p
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('obraLabel')}
        </motion.p>

        <ol>
          {projects.map((project, i) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            >
              <Link
                href={`/${locale}/work/${project.slug}`}
                className="group flex items-baseline gap-5 py-4 border-b border-grain hover:border-accent/40 transition-colors"
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="font-mono text-[11px] text-muted/60 w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <motion.span
                    className="block font-cormorant text-[1.6rem] leading-snug text-ink"
                    animate={{ fontStyle: activeIndex === i ? 'italic' : 'normal' }}
                    transition={{ duration: 0.2 }}
                  >
                    {project.title}
                  </motion.span>
                  <span className="font-mono text-[10px] text-muted tracking-wide">
                    {project.year}{project.subtitle ? ` · ${project.subtitle}` : ''}
                  </span>
                </span>
                <motion.span
                  className="font-mono text-xs text-accent"
                  animate={{ opacity: activeIndex === i ? 1 : 0, x: activeIndex === i ? 0 : -4 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden
                >
                  →
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* ── Right: sticky image panel ─────────────────────────── */}
      <div
        className="w-[58vw] sticky top-0 h-screen overflow-hidden bg-grain"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          {active?.featuredImage ? (
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease }}
            >
              <Image
                src={active.featuredImage.url}
                alt={active.title}
                fill
                className="object-cover"
                sizes="58vw"
                priority={activeIndex === 0}
              />
              {/* Subtle bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/30 to-transparent" />
              {/* Active project label overlay */}
              <div className="absolute bottom-8 left-8">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-paper/60">
                  {String(activeIndex + 1).padStart(2, '0')} — {active.year}
                </p>
                <p className="font-cormorant italic text-2xl text-paper/90 mt-1">
                  {active.title}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`placeholder-${active?.id}`}
              className="absolute inset-0 flex items-end p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted">
                  {String(activeIndex + 1).padStart(2, '0')} — {active?.year}
                </p>
                <p className="font-cormorant italic text-2xl text-ink/40 mt-1">
                  {active?.title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
