'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useRef, useEffect } from 'react'

const processImages = [
  { src: 'https://picsum.photos/seed/process-a/500/700', alt: 'Studio detail', span: 'row-span-2' },
  { src: 'https://picsum.photos/seed/process-b/500/400', alt: 'Thread work', span: '' },
  { src: 'https://picsum.photos/seed/process-c/500/400', alt: 'Darkroom', span: '' },
  { src: 'https://picsum.photos/seed/process-d/500/600', alt: 'Performance sketch', span: '' },
]

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
    }
  }, [isInView, count, target])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}

export function ProcessSection() {
  const locale = useLocale()
  const t = useTranslations('about')

  return (
    <section className="bg-paper py-28 md:py-44 px-8 md:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left: text */}
        <div>
          <motion.p
            className="font-mono text-label tracking-label uppercase text-ink/50 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('practiceLabel')}
          </motion.p>

          <motion.h2
            className="font-cormorant text-title text-ink leading-head mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('layersTitle')}
          </motion.h2>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <p className="font-garamond text-body text-body-text/80 leading-body">
              {t('para1')}
            </p>
            <p className="font-garamond text-body text-body-text/80 leading-body">
              {t('para2')}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-grain"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {[
              { target: 11, suffix: '', label: t('stat1Label') },
              { target: 7, suffix: '', label: t('stat2Label') },
              { target: 10, suffix: '+', label: t('stat3Label') },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-cormorant italic text-[2.5rem] text-ink leading-none">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="font-mono text-label tracking-label uppercase text-ink/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-3 font-mono text-label tracking-label uppercase text-ink border border-grain px-6 py-3 hover:border-accent hover:text-accent transition-colors group"
            >
              {t('readBio')}
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right: image mosaic */}
        <motion.div
          className="grid grid-cols-2 grid-rows-3 gap-3 h-[560px]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Tall image left */}
          <div className="row-span-2 relative overflow-hidden bg-grain">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={processImages[0].src} alt={processImages[0].alt} fill className="object-cover" sizes="25vw" />
            </motion.div>
          </div>
          {/* Top right */}
          <div className="relative overflow-hidden bg-grain">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={processImages[1].src} alt={processImages[1].alt} fill className="object-cover" sizes="25vw" />
            </motion.div>
          </div>
          {/* Middle right */}
          <div className="relative overflow-hidden bg-grain">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={processImages[2].src} alt={processImages[2].alt} fill className="object-cover" sizes="25vw" />
            </motion.div>
          </div>
          {/* Bottom full-width */}
          <div className="col-span-2 relative overflow-hidden bg-grain">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={processImages[3].src} alt={processImages[3].alt} fill className="object-cover" sizes="50vw" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
