'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { RichText } from '@/components/ui/RichText'
import type { AboutPage } from '@/lib/strapi'

const ease = [0.16, 1, 0.3, 1] as const

interface AboutBioProps { aboutPage: AboutPage | null }

export function AboutBio({ aboutPage }: AboutBioProps) {
  const t = useTranslations('about')
  const data = aboutPage
  const disciplines = [
    { label: t('disc0'), sub: t('disc0sub') },
    { label: t('disc1'), sub: t('disc1sub') },
    { label: t('disc2'), sub: t('disc2sub') },
    { label: t('disc3'), sub: t('disc3sub') },
    { label: t('disc4'), sub: t('disc4sub') },
  ]

  return (
    <div className="bg-paper">

      {/* ── Main bio: two-column ────────────────────────── */}
      <div className="px-8 md:px-20 py-24 md:py-36 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-28 items-start">

        {/* Left sticky label column */}
        <div className="lg:sticky lg:top-32">
          <motion.p
            className="font-mono text-label tracking-label uppercase text-ink/50 mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            {t('bioLabel')}
          </motion.p>
          <motion.h2
            className="font-cormorant italic text-heading text-ink leading-head"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          >
            {data?.heading ?? 'Pilar Olivero'}
          </motion.h2>
          {data?.subtitle && (
            <p className="font-mono text-label tracking-meta uppercase text-ink/50 mt-4 leading-relaxed">
              {data.subtitle}
            </p>
          )}

          {/* Availability badge */}
          {data?.availability && (
            <motion.div
              className="mt-10 border-t border-grain pt-6"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono text-label tracking-label uppercase text-ink/50">
                  {data.availability}
                </span>
              </span>
            </motion.div>
          )}
        </div>

        {/* Right: biography text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {data?.biography ? (
            <RichText
              html={typeof data.biography === 'string' ? data.biography : data.biography.html}
              className="text-body leading-body text-body-text/80"
            />
          ) : null}
        </motion.div>
      </div>

      {/* ── Philosophy pull-quote ───────────────────────── */}
      {data?.philosophy && (
        <div className="bg-ink px-8 md:px-20 py-20 md:py-28">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          >
            <span className="font-cormorant italic text-accent text-6xl leading-none select-none" aria-hidden>"</span>
            <div
              className="font-cormorant italic text-heading text-paper/80 leading-head -mt-6 [&_p]:mb-0"
              dangerouslySetInnerHTML={{
                __html: typeof data.philosophy === 'string'
                  ? data.philosophy
                  : (data.philosophy as { html: string }).html ?? '',
              }}
            />
          </motion.div>
        </div>
      )}

      {/* ── Disciplines strip ────────────────────────────── */}
      <div className="border-t border-b border-grain">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-grain">
          {disciplines.map((d, i) => (
            <motion.div
              key={d.label}
              className={`px-8 py-9 ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i >= 3 ? 'border-t lg:border-t-0' : ''}`}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <p className="font-cormorant italic text-xl text-ink mb-1">{d.label}</p>
              <p className="font-mono text-label tracking-meta uppercase text-ink/50">{d.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}
