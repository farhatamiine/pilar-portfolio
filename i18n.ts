export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/** Map Next.js locale slug → Hygraph Locale enum value */
export const hygraphLocale: Record<Locale, string> = {
  en: 'en',
  es: 'es_AR',
}
