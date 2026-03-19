'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface NavProps { locale: string }

const locales = ['en', 'es'] as const
const labels = { en: 'EN', es: 'ES' }
const pages = ['work', 'about', 'contact'] as const

export function Nav({ locale }: NavProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useTranslations('nav')

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  // Detect scroll past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Solid nav: always on inner pages OR when scrolled past hero on home
  const solid = !isHome || scrolled

  const restPath = pathname.replace(new RegExp(`^/${locale}`), '') || ''

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 flex items-center justify-between transition-all duration-300 ${
          solid
            ? 'py-5 bg-paper/97 backdrop-blur-md border-b border-grain shadow-sm'
            : 'py-7'
        }`}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors hover:text-accent ${
            solid ? 'text-ink' : 'text-paper'
          }`}
        >
          Pilar Olivero
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <LayoutGroup>
            {pages.map(key => {
              const isActive = pathname.startsWith(`/${locale}/${key}`)
              return (
                <Link
                  key={key}
                  href={`/${locale}/${key}`}
                  className={`relative font-mono text-xs tracking-[0.2em] uppercase transition-colors hover:text-accent pb-1 ${
                    isActive
                      ? 'text-accent'
                      : solid ? 'text-ink/70' : 'text-paper/70'
                  }`}
                >
                  {t(key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </LayoutGroup>

          {/* Locale switcher */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-current/20">
            {locales.map((loc, i) => (
              <span key={loc} className="flex items-center gap-2">
                <Link
                  href={`/${loc}${restPath}`}
                  className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-accent ${
                    loc === locale ? 'text-accent' : solid ? 'text-ink/50' : 'text-paper/50'
                  }`}
                >
                  {labels[loc]}
                </Link>
                {i < locales.length - 1 && (
                  <span className={`text-xs select-none ${solid ? 'text-ink/20' : 'text-paper/20'}`} aria-hidden>·</span>
                )}
              </span>
            ))}
          </div>
        </nav>

        {/* Mobile: locale + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          {locales.map(loc => (
            <Link
              key={loc}
              href={`/${loc}${restPath}`}
              className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                loc === locale ? 'text-accent' : solid ? 'text-ink/60' : 'text-paper/60'
              }`}
            >
              {labels[loc]}
            </Link>
          ))}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            className={`flex flex-col gap-1.5 p-1 transition-colors ${solid ? 'text-ink' : 'text-paper'}`}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              className="block w-5 h-px bg-current origin-center"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-5 h-px bg-current"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              className="block w-5 h-px bg-current origin-center"
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink flex flex-col justify-center px-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="space-y-8">
              {pages.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    href={`/${locale}/${key}`}
                    className="font-cormorant italic text-[2.8rem] text-paper hover:text-accent transition-colors leading-none"
                  >
                    {t(key)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-16 flex gap-6">
              {locales.map(loc => (
                <Link
                  key={loc}
                  href={`/${loc}${restPath}`}
                  className={`font-mono text-xs tracking-widest uppercase ${
                    loc === locale ? 'text-accent' : 'text-paper/40'
                  }`}
                >
                  {labels[loc]}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
