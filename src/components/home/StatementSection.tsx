'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function StatementSection() {
  const ref = useRef<HTMLElement>(null)
  const t = useTranslations('statement')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const threadY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const words = t('text').split(' ')

  return (
    <section ref={ref} className="relative bg-ink overflow-hidden py-48 lg:py-[18vw]">

      {/* Full-width parallax thread */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-accent/15 pointer-events-none"
        style={{ top: '50%', y: threadY }}
      />

      {/*
        Asymmetric grid: empty left zone (art gallery void) + content right zone.
        Mobile: single column. Desktop: 1fr 2fr split.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">

        {/* Left: pure void with vertical label — intentional empty space */}
        <div className="hidden lg:flex flex-col justify-between px-16 xl:px-20">
          <motion.p
            className="font-mono text-label tracking-label uppercase text-accent/50 writing-mode-vertical"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('label')}
          </motion.p>
        </div>

        {/* Right: manifesto text in the right two-thirds */}
        <div className="px-8 md:px-16 lg:pr-24 xl:pr-32">

          {/* Mobile label */}
          <motion.p
            className="lg:hidden font-mono text-label tracking-label uppercase text-accent mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('label')}
          </motion.p>

          {/* Word-by-word reveal — each word develops like a darkroom print */}
          <p className="font-cormorant italic text-title leading-head text-paper/90 flex flex-wrap gap-x-[0.35em]">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* Attribution — thread draws in */}
          <motion.div
            className="mt-16 flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.div
              className="h-px bg-accent/50"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-mono text-label tracking-label uppercase text-muted">
              {t('attribution')}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
