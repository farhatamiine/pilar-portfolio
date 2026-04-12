'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Exhibition } from '@/lib/strapi'

type SectionKey = 'solo' | 'collective'

const MOCK_EXHIBITIONS: Exhibition[] = [
  { id: '1', title: "Changement d'état",              location: 'Galerie Huit, Paris',                    year: 2025, isCollective: false },
  { id: '2', title: 'La Tisseuse',                    location: 'Cité des Arts, Paris',                   year: 2025, isCollective: false },
  { id: '3', title: 'Volver al Gesto',                location: 'Centro Cultural Recoleta, Buenos Aires', year: 2022, isCollective: false },
  { id: '4', title: 'El torso no miente',             location: 'Espacio Alado, Buenos Aires',            year: 2017, isCollective: false },
  { id: '5', title: 'Biennale des arts textiles',     location: 'Musée des Tissus, Lyon',                 year: 2023, isCollective: true  },
  { id: '6', title: 'Corps en transit',               location: 'Palais de Tokyo, Paris',                 year: 2021, isCollective: true  },
  { id: '7', title: 'Híbrido',                        location: 'Centro de Arte y Fotografía, Madrid',    year: 2022, isCollective: true  },
  { id: '8', title: 'Habitar los espacios',           location: 'Fundación OSDE, Buenos Aires',           year: 2018, isCollective: true  },
]

interface CVAccordionProps { exhibitions: Exhibition[] }

export function CVAccordion({ exhibitions }: CVAccordionProps) {
  const t = useTranslations('about')
  const data = exhibitions.length > 0 ? exhibitions : MOCK_EXHIBITIONS
  const [open, setOpen] = useState<Set<SectionKey>>(new Set(['solo']))

  const SECTIONS: { key: SectionKey; label: string; isCollective: boolean }[] = [
    { key: 'solo',       label: t('solo'),       isCollective: false },
    { key: 'collective', label: t('collective'), isCollective: true  },
  ]

  const toggle = (key: SectionKey) =>
    setOpen(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="bg-paper px-8 md:px-20 pb-32 pt-16">

      {/* Section label */}
      <motion.p
        className="font-mono text-label tracking-label uppercase text-ink/40 mb-3"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      >
        {t('cvLabel')}
      </motion.p>
      <motion.h2
        className="font-cormorant italic text-title text-ink mb-16 leading-head"
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        {t('trajectory')}
      </motion.h2>

      <div className="space-y-0">
        {SECTIONS.map(({ key, label, isCollective }) => {
          const entries = data
            .filter(e => e.isCollective === isCollective)
            .sort((a, b) => b.year - a.year)
          if (!entries.length) return null
          const isOpen = open.has(key)

          return (
            <div key={key} className="border-t border-grain">
              {/* Section header */}
              <button
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between pt-8 pb-6 group text-left"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-label tracking-label uppercase text-ink/50 group-hover:text-ink transition-colors">
                    {label}
                  </span>
                  <motion.div
                    className="h-px bg-ink/20 group-hover:bg-accent/60 transition-colors"
                    animate={{ width: isOpen ? 40 : 20 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="font-mono text-xs text-ink/25">{entries.length}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-2xl text-ink/30 group-hover:text-accent transition-colors leading-none shrink-0"
                  aria-hidden
                >
                  +
                </motion.span>
              </button>

              {/* Entries — grid-template-rows avoids height:auto jank */}
              <motion.div
                initial={false}
                animate={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'grid' }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <ul className="pb-10">
                    {entries.map((entry, i) => (
                      <motion.li
                        key={entry.id}
                        className="flex items-start justify-between gap-8 py-5 border-b border-grain/40 last:border-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 8 }}
                        transition={{ delay: isOpen ? i * 0.05 : 0, duration: 0.35 }}
                      >
                          <div>
                            <h3 className="font-cormorant text-subhead leading-snug text-ink">
                              {entry.title}
                            </h3>
                            {entry.location && (
                              <p className="font-mono text-label tracking-meta uppercase text-ink/40 mt-1">
                                {entry.location}
                              </p>
                            )}
                          </div>
                          <span className="font-mono text-sm text-ink/40 tabular-nums shrink-0 pt-1">
                            {entry.year}
                          </span>
                        </motion.li>
                      ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
