'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Exhibition } from '@/lib/hygraph'

type ExhibitionType = 'SOLO' | 'COLLECTIVE' | 'RESIDENCY' | 'PUBLICATION'

const SECTIONS: { type: ExhibitionType; label: string }[] = [
  { type: 'SOLO',       label: 'Exposiciones individuales' },
  { type: 'COLLECTIVE', label: 'Exposiciones colectivas' },
  { type: 'RESIDENCY',  label: 'Residencias' },
  { type: 'PUBLICATION',label: 'Publicaciones y ponencias' },
]

const MOCK_EXHIBITIONS: Exhibition[] = [
  { title: "Changement d'état",                   venue: 'Galerie Huit',                            city: 'Paris',         country: 'France',    year: 2025, type: 'SOLO' },
  { title: 'La Tisseuse',                         venue: 'Cité des Arts',                           city: 'Paris',         country: 'France',    year: 2025, type: 'SOLO' },
  { title: 'Volver al Gesto',                     venue: 'Centro Cultural Recoleta',                city: 'Buenos Aires',  country: 'Argentina', year: 2022, type: 'SOLO' },
  { title: 'El torso no miente',                  venue: 'Espacio Alado',                           city: 'Buenos Aires',  country: 'Argentina', year: 2017, type: 'SOLO' },
  { title: 'Dilucidar',                           venue: 'Galería del Infinito',                    city: 'Buenos Aires',  country: 'Argentina', year: 2016, type: 'SOLO' },
  { title: 'Biennale des arts textiles',          venue: 'Musée des Tissus',                        city: 'Lyon',          country: 'France',    year: 2023, type: 'COLLECTIVE' },
  { title: 'Festival Internacional de Performance',venue: 'Teatro San Martín',                     city: 'Córdoba',       country: 'Argentina', year: 2019, type: 'COLLECTIVE' },
  { title: 'Corps en transit',                    venue: 'Palais de Tokyo (Programme HLM)',         city: 'Paris',         country: 'France',    year: 2021, type: 'COLLECTIVE' },
  { title: 'Híbrido',                             venue: 'Centro de Arte y Fotografía',             city: 'Madrid',        country: 'Spain',     year: 2022, type: 'COLLECTIVE' },
  { title: 'Habitar los espacios',                venue: 'Fundación OSDE',                          city: 'Buenos Aires',  country: 'Argentina', year: 2018, type: 'COLLECTIVE' },
  { title: 'Résidence NY20+',                     venue: 'International Studio & Curatorial Program',city: 'New York',    country: 'USA',       year: 2025, type: 'RESIDENCY' },
  { title: 'Résidence artistique',                venue: 'Cité Internationale des Arts',            city: 'Paris',        country: 'France',    year: 2024, type: 'RESIDENCY' },
  { title: 'Residencia de investigación',         venue: 'Fundación Telefónica',                    city: 'Madrid',       country: 'Spain',     year: 2022, type: 'RESIDENCY' },
  { title: '"Le corps comme archive" — Catalogue',venue: 'Éditions Jeu de Paume',                  city: 'Paris',        country: 'France',    year: 2024, type: 'PUBLICATION' },
  { title: '"Textile Art and Political Memory"',  venue: 'Textile: The Journal of Cloth and Culture',city: 'London',     country: 'UK',        year: 2023, type: 'PUBLICATION' },
]

interface CVAccordionProps { exhibitions: Exhibition[] }

export function CVAccordion({ exhibitions }: CVAccordionProps) {
  const data = exhibitions.length > 0 ? exhibitions : MOCK_EXHIBITIONS
  const [open, setOpen] = useState<Set<ExhibitionType>>(new Set(['SOLO']))

  const toggle = (type: ExhibitionType) =>
    setOpen(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })

  return (
    <div className="bg-paper px-8 md:px-20 pb-32 pt-16">

      {/* Section label */}
      <motion.p
        className="font-mono text-xs tracking-[0.35em] uppercase text-ink/40 mb-3"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      >
        Currículum
      </motion.p>
      <motion.h2
        className="font-cormorant italic text-[clamp(2.2rem,4vw,3.5rem)] text-ink mb-16 leading-none"
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        Trayectoria
      </motion.h2>

      <div className="space-y-0">
        {SECTIONS.map(({ type, label }) => {
          const entries = data.filter(e => e.type === type).sort((a, b) => b.year - a.year)
          if (!entries.length) return null
          const isOpen = open.has(type)

          return (
            <div key={type} className="border-t border-grain">
              {/* Section header */}
              <button
                onClick={() => toggle(type)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between pt-8 pb-6 group text-left"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-ink/50 group-hover:text-ink transition-colors">
                    {label}
                  </span>
                  {/* Dash line */}
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

              {/* Entries */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-10">
                      {entries.map((entry, i) => (
                        <motion.li
                          key={`${entry.title}-${i}`}
                          className="flex items-start justify-between gap-8 py-5 border-b border-grain/40 last:border-0"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.35 }}
                        >
                          {/* Title + venue */}
                          <div>
                            <h3 className="font-cormorant text-[1.7rem] leading-tight tracking-wide uppercase text-ink">
                              {entry.title}
                            </h3>
                            {entry.venue && (
                              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/40 mt-1">
                                {entry.venue}{entry.city ? `, ${entry.city}` : ''}{entry.country ? `, ${entry.country}` : ''}
                              </p>
                            )}
                          </div>
                          {/* Year */}
                          <span className="font-mono text-sm text-ink/40 tabular-nums shrink-0 pt-1">
                            {entry.year}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
