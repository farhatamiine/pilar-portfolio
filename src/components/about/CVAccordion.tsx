'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Exhibition, ExhibitionType } from '@/lib/hygraph'

const TYPES: ExhibitionType[] = ['SOLO', 'COLLECTIVE', 'RESIDENCY', 'PUBLICATION']
const TYPE_KEY: Record<ExhibitionType, string> = {
  SOLO: 'solo',
  COLLECTIVE: 'collective',
  RESIDENCY: 'residency',
  PUBLICATION: 'publication',
}

interface CVAccordionProps { exhibitions: Exhibition[] }

export function CVAccordion({ exhibitions }: CVAccordionProps) {
  const t = useTranslations('about')
  const [open, setOpen] = useState<Set<ExhibitionType>>(new Set(['SOLO']))

  const toggle = (type: ExhibitionType) => {
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }

  return (
    <div className="mt-16 max-w-2xl mx-auto px-4 md:px-0 pb-20">
      <h2 className="font-cormorant italic text-3xl text-ink mb-8">{t('cvTitle')}</h2>
      <div className="divide-y divide-grain">
        {TYPES.map((type) => {
          const entries = exhibitions.filter((e) => e.type === type).sort((a, b) => b.year - a.year)
          if (!entries.length) return null
          const isOpen = open.has(type)
          return (
            <div key={type}>
              <button onClick={() => toggle(type)} aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-4 group">
                <span className="font-mono text-xs tracking-widest uppercase text-muted group-hover:text-ink transition-colors">
                  {t(TYPE_KEY[type])}
                </span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
                  className="font-mono text-muted text-lg" aria-hidden>+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span key={`list-${type}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="block overflow-hidden pb-2">
                    <ul>
                      {entries.map((entry, i) => (
                        <li key={`${entry.title}-${i}`} className="py-2 font-mono text-xs">
                          <span className="text-muted tabular-nums mr-3">{entry.year}</span>
                          <span className="font-garamond text-sm text-body-text">{entry.title}</span>
                          {entry.venue && (
                            <span className="text-muted">
                              {' '}· {entry.venue}{entry.city ? `, ${entry.city}` : ''}{entry.country ? `, ${entry.country}` : ''}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
