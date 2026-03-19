'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export function AboutHero() {
  return (
    <section className="relative bg-ink min-h-screen flex items-end overflow-hidden">

      {/* Portrait image — full bleed */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/seed/portrait-pilar/1200/1600"
          alt="Pilar Olivero"
          fill
          className="object-cover object-top grayscale"
          sizes="100vw"
          priority
        />
        {/* Dark gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      </div>

      {/* Text over image */}
      <div className="relative z-10 w-full px-8 md:px-20 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <motion.p
            className="font-mono text-xs tracking-[0.4em] uppercase text-accent mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Perfil
          </motion.p>

          <motion.h1
            className="font-cormorant italic text-[clamp(3.5rem,8vw,7rem)] text-paper leading-[0.92] mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease }}
          >
            Pilar<br />Olivero
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            {['Artista multidisciplinaria', 'Arte-terapeuta', 'Buenos Aires · Paris'].map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-[0.25em] uppercase text-paper/40">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint line */}
      <motion.div
        className="absolute right-10 bottom-10 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-12 bg-paper/30"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
