'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { ProjectSummary } from '@/lib/hygraph'

interface ProjectNavProps { prev: ProjectSummary | null; next: ProjectSummary | null; locale: string }

export function ProjectNav({ prev, next, locale }: ProjectNavProps) {
  const t = useTranslations('project')
  return (
    <nav aria-label="Project navigation" className="border-t border-grain mt-16 px-4 md:px-8 py-8 flex justify-between gap-4">
      {prev ? (
        <Link href={`/${locale}/work/${prev.slug}`} className="group flex items-center gap-3 max-w-[45%]">
          {prev.featuredImage && (
            <div className="w-12 h-12 relative overflow-hidden shrink-0 bg-grain">
              <Image src={prev.featuredImage.url} alt={prev.title} fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all" sizes="48px" />
            </div>
          )}
          <div>
            <span className="block font-mono text-xs text-muted tracking-widest">← {t('previous')}</span>
            <span className="font-cormorant italic text-ink group-hover:text-accent transition-colors">{prev.title}</span>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/${locale}/work/${next.slug}`} className="group flex items-center gap-3 text-right max-w-[45%] ml-auto">
          <div>
            <span className="block font-mono text-xs text-muted tracking-widest">{t('next')} →</span>
            <span className="font-cormorant italic text-ink group-hover:text-accent transition-colors">{next.title}</span>
          </div>
          {next.featuredImage && (
            <div className="w-12 h-12 relative overflow-hidden shrink-0 bg-grain">
              <Image src={next.featuredImage.url} alt={next.title} fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all" sizes="48px" />
            </div>
          )}
        </Link>
      ) : <div />}
    </nav>
  )
}
