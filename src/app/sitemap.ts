import type { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/strapi'
import { locales } from '../../i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pilarolivero.com'
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push(
      { url: `${baseUrl}/${locale}`, lastModified: now },
      { url: `${baseUrl}/${locale}/about`, lastModified: now },
      { url: `${baseUrl}/${locale}/contact`, lastModified: now },
    )
    try {
      const projects = await getAllProjects(locale)
      for (const p of projects) {
        entries.push({ url: `${baseUrl}/${locale}/work/${p.slug}`, lastModified: now })
      }
    } catch {
      // Hygraph may not be reachable in some build environments
    }
  }

  return entries
}
