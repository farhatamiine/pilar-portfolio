'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'

const items = [
  'Résidence NY20+ — New York 2025',
  'Cité Internationale des Arts — Paris 2024',
  'Centro Cultural Recoleta — Buenos Aires 2023',
  'Biennale des arts textiles — Lyon 2023',
  'Galerie du Jeu de Paume — Paris 2022',
  'Espacio Fundación Telefónica — Madrid 2022',
  'Museum of Arts and Design — New York 2021',
  'Palais de Tokyo (Programme Hors les murs) — 2021',
  'Festival Internacional de Performance — Córdoba 2019',
]

const tickerItems = [...items, ...items]

const tickerTransition = { duration: 45, ease: 'linear' as const, repeat: Infinity }

export function ExhibitionsTicker() {
  const controls = useAnimation()
  const started = useRef(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!shouldReduceMotion) {
      controls.start({ x: ['0%', '-50%'], transition: tickerTransition })
      started.current = true
    }
  }, [controls, shouldReduceMotion])

  return (
    <section className="bg-ink border-y border-accent/20 py-4 overflow-hidden">
      <div
        className="flex items-center overflow-hidden cursor-default"
        onMouseEnter={() => { if (!shouldReduceMotion) controls.stop() }}
        onMouseLeave={() => { if (!shouldReduceMotion) controls.start({ x: ['0%', '-50%'], transition: tickerTransition }) }}
      >
        <motion.div
          className="flex gap-10 shrink-0 whitespace-nowrap"
          animate={controls}
        >
          {tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-10 shrink-0">
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-paper/70">
                {item}
              </span>
              <span className="text-accent/50 font-mono text-xs select-none" aria-hidden>◆</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
