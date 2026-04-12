'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import type { ProjectSummary } from '@/lib/strapi'
import { Magnetic } from '@/components/ui/Magnetic'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero({ featuredProject }: { featuredProject: ProjectSummary | null }) {
  const locale = useLocale()
  const t = useTranslations('hero')
  const heroRef = useRef<HTMLElement>(null)

  // Scroll-driven parallax: image drifts up as user scrolls away from hero
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section ref={heroRef} className="relative flex min-h-dvh bg-ink overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-between w-full lg:w-[45vw] px-10 lg:px-16 pt-36 pb-14">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <p className="font-mono text-label tracking-label uppercase text-accent">
            {t('label')}
          </p>
        </motion.div>

        {/* Artist name */}
        <motion.div
          className="my-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
        >
          <h1 className="font-cormorant italic text-display leading-display text-paper tracking-tight">
            Pilar<br />Olivero
          </h1>
          <p className="font-garamond text-body text-paper/75 mt-6 tracking-wide">
            {t('disciplines')}
          </p>
        </motion.div>

        {/* CTAs — each wrapped in Magnetic pull */}
        <motion.div
          className="flex items-center gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
        >
          <Magnetic strength={0.4}>
            <Link
              href={`/${locale}/work`}
              className="font-mono text-xs tracking-widest uppercase text-paper/90 hover:text-accent transition-colors group inline-flex items-center gap-1"
            >
              {t('exploreWork')}&nbsp;<span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.4}>
            <Link
              href={`/${locale}/about`}
              className="font-mono text-xs tracking-widest uppercase text-paper/60 hover:text-paper/90 transition-colors group inline-flex items-center gap-1"
            >
              {t('aboutMe')}&nbsp;<span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── Right panel: featured image with scroll parallax ── */}
      <motion.div
        className="hidden lg:block absolute right-0 top-0 w-[58vw] h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease, delay: 0.05 }}
      >
        {featuredProject?.featuredImage ? (
          <motion.div
            className="absolute inset-0 scale-110"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1.06 }}
            style={{ y: imageY }}
            transition={{ duration: 8, ease: 'easeOut' }}
          >
            <Image
              src={featuredProject.featuredImage.url}
              alt={featuredProject.title}
              fill
              className="object-cover object-center"
              sizes="58vw"
              priority
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#2a231e] to-[#3d2e24]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent pointer-events-none" />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="font-mono text-label tracking-label uppercase text-paper/60">{t('scroll')}</span>
        <motion.div
          className="w-px h-8 bg-paper/30"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
