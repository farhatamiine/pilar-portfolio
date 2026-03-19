import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'

interface NavProps { locale: string }

export async function Nav({ locale }: NavProps) {
  const t = await getTranslations('nav')
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between bg-paper/90 backdrop-blur-sm border-b border-grain">
      <Link
        href={`/${locale}`}
        className="font-cormorant text-xl tracking-[0.15em] uppercase text-ink hover:text-accent transition-colors"
      >
        Pilar Olivero
      </Link>
      <nav className="flex items-center gap-8">
        <div className="hidden md:flex gap-8">
          {(['work', 'about', 'contact'] as const).map((key) => (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className="font-mono text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </div>
        <LocaleSwitcher />
      </nav>
    </header>
  )
}
