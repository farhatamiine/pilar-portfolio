'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { RichText } from '@/components/ui/RichText'
import type { AboutPage } from '@/lib/strapi'

const ease = [0.16, 1, 0.3, 1] as const

// Mock bio content when CMS has no data
const MOCK_BIO = {
  heading: 'Pilar Olivero',
  subtitle: 'Artista multidisciplinaria · Arte-terapeuta',
  shortBio: 'Argentine multidisciplinary artist and art therapist based in Paris.',
  biography: `
    <p>Pilar Olivero (Buenos Aires, 1988) is an artist and art therapist whose practice moves between textile installation, alternative photography, and durational performance. She lives and works in Paris.</p>
    <p>Trained at the Universidad Nacional de las Artes in Buenos Aires and the École Nationale Supérieure des Beaux-Arts in Paris, her work is grounded in the intersection of body, memory, and archive. She is interested in the ways in which matter — thread, silver, light — can hold what language cannot.</p>
    <p>Her works have been exhibited across Argentina, France, and the United States. She is a founding member of the collective <em>Cuerpos en tránsito</em>, and has received support from the Institut français, the Fondation des Artistes, and the Fondo Nacional de las Artes.</p>
  `,
  philosophy: `<p>The body is the primary archive. Everything I make begins there — in the sensation of thread against skin, in the chemical reaction of light on emulsion, in the duration of a held gesture. I am not interested in representation. I am interested in presence.</p>`,
  availability: 'Available for commissions, residencies, and collaborative projects',
}

const disciplines = [
  { label: 'Arte Textil', sub: 'Bordado · Instalación' },
  { label: 'Fotografía', sub: 'Cianotipo · Wet plate' },
  { label: 'Performance', sub: 'Cuerpo · Duración' },
  { label: 'Instalación', sub: 'In situ · Espacio' },
  { label: 'Arte-terapia', sub: 'Clínica · Mediación' },
]

interface AboutBioProps { aboutPage: AboutPage | null }

export function AboutBio({ aboutPage }: AboutBioProps) {
  const t = useTranslations('about')
  const data = aboutPage ?? MOCK_BIO

  return (
    <div className="bg-paper">

      {/* ── Main bio: two-column ────────────────────────── */}
      <div className="px-8 md:px-20 py-24 md:py-36 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-28 items-start">

        {/* Left sticky label column */}
        <div className="lg:sticky lg:top-32">
          <motion.p
            className="font-mono text-xs tracking-[0.4em] uppercase text-ink/50 mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            {t('bioLabel')}
          </motion.p>
          <motion.h2
            className="font-cormorant italic text-[clamp(2rem,3.5vw,3.2rem)] text-ink leading-[1.05]"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          >
            {data.heading ?? 'Pilar Olivero'}
          </motion.h2>
          {data.subtitle && (
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mt-4 leading-relaxed">
              {data.subtitle}
            </p>
          )}

          {/* Availability badge */}
          {data.availability && (
            <motion.div
              className="mt-10 border-t border-grain pt-6"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-ink/50">
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
          {data.biography ? (
            <RichText
              html={typeof data.biography === 'string' ? data.biography : data.biography.html}
              className="font-garamond text-[1.1rem] leading-[1.85] text-body-text/80 [&_p]:mb-6 [&_em]:italic [&_strong]:font-semibold"
            />
          ) : null}
        </motion.div>
      </div>

      {/* ── Philosophy pull-quote ───────────────────────── */}
      {data.philosophy && (
        <div className="bg-ink px-8 md:px-20 py-20 md:py-28">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          >
            <span className="font-cormorant italic text-accent text-6xl leading-none select-none">"</span>
            <p className="font-cormorant italic text-[clamp(1.4rem,2.5vw,2rem)] text-paper/80 leading-[1.5] -mt-6">
              {data.philosophy}
            </p>
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
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-ink/50">{d.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}
