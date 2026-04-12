export const locales = ['fr', 'es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'
