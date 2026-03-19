'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLocale } from 'next-intl'
import type { ProjectSummary } from '@/lib/hygraph'

interface SpotlightSectionProps { projects: ProjectSummary[] }

export function SpotlightSection({ projects }: SpotlightSectionProps) {
  const locale = useLocale()
  // Pick 3 to spotlight — featured if available, else first 3
  const spotlit = projects.filter(p => (p as any).featured).slice(0, 3)
  const display = spotlit.length >= 2 ? spotlit : projects.slice(0, 3)

  return (
    <section className="bg-ink py-28 md:py-44 px-8 md:px-20 overflow-hidden">
      <motion.p
        className="font-mono text-[9px] tracking-[0.4em] uppercase text-accent/90 mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Obras seleccionadas
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end">
        {display.map((project, i) => (
          <SpotlightCard key={project.id} project={project} index={i} locale={locale} />
        ))}
      </div>
    </section>
  )
}

function SpotlightCard({
  project, index, locale,
}: { project: ProjectSummary; index: number; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 30 : -20, index % 2 === 0 ? -30 : 20])

  const heights = ['aspect-[3/4]', 'aspect-[3/5]', 'aspect-[3/4]']

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 30 + index * 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ y }}
    >
      <Link href={`/${locale}/work/${project.slug}`} className="block">
        {/* Image container */}
        <div className={`relative ${heights[index]} overflow-hidden bg-ink/50 mb-5`}>
          {project.featuredImage ? (
            <motion.div className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={project.featuredImage.url}
                alt={project.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-ink/60" />
          )}

          {/* Number overlay */}
          <span className="absolute top-5 left-5 font-mono text-[10px] text-paper/70 tracking-widest">
            {String(project.order ?? index + 1).padStart(2, '0')}
          </span>

          {/* Arrow on hover */}
          <motion.div
            className="absolute bottom-5 right-5 w-9 h-9 border border-accent/60 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-accent font-mono text-xs">→</span>
          </motion.div>
        </div>

        {/* Title */}
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-paper/60 mb-2">
            {project.year}{project.subtitle ? ` · ${project.subtitle.split(' · ')[0]}` : ''}
          </p>
          <h3 className="font-cormorant text-2xl text-paper group-hover:italic transition-all duration-200">
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="font-garamond text-sm text-paper/70 mt-2 leading-relaxed line-clamp-2">
              {project.shortDescription}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
