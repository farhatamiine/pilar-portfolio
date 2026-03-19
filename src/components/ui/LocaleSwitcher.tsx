'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales, type Locale } from '../../../i18n'

const LABELS: Record<Locale, string> = { fr: 'FR', es: 'ES', en: 'EN' }

export function LocaleSwitcher() {
  // usePathname from next/navigation includes locale prefix — strip it
  const fullPathname = usePathname()
  const currentLocale = useLocale() as Locale
  const pathname = fullPathname.replace(new RegExp(`^/${currentLocale}`), '') || '/'

  return (
    <nav aria-label="Language selector" className="flex items-center gap-3">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-3">
          <Link
            href={`/${locale}${pathname === '/' ? '' : pathname}`}
            className={`font-mono text-xs tracking-widest uppercase transition-colors hover:text-accent ${
              locale === currentLocale ? 'text-accent' : 'text-muted'
            }`}
            aria-current={locale === currentLocale ? 'true' : undefined}
          >
            {LABELS[locale]}
          </Link>
          {i < locales.length - 1 && (
            <span className="text-muted font-mono text-xs select-none" aria-hidden>·</span>
          )}
        </span>
      ))}
    </nav>
  )
}
