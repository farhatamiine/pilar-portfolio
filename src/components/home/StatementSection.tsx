'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const words = [
  'El', 'cuerpo', 'es', 'el', 'primer', 'archivo.',
  'El', 'hilo,', 'la', 'primera', 'escritura.',
  'La', 'imagen,', 'la', 'memoria', 'que', 'el', 'tiempo', 'no', 'pudo', 'borrar.',
]

export function StatementSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="relative bg-ink overflow-hidden py-32 md:py-48 px-8 md:px-20">

      {/* Background amber thread line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-accent/20"
        style={{ top: '50%', y }}
      />

      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <motion.p
          className="font-mono text-xs tracking-[0.4em] uppercase text-accent mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Manifiesto
        </motion.p>

        {/* Word-by-word reveal */}
        <p className="font-cormorant italic text-[clamp(2rem,5vw,4.5rem)] leading-[1.15] text-paper/90 flex flex-wrap gap-x-[0.35em]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Attribution */}
        <motion.div
          className="mt-14 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="h-px w-12 bg-accent/50" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
            Pilar Olivero — Buenos Aires · Paris
          </span>
        </motion.div>
      </div>
    </section>
  )
}
