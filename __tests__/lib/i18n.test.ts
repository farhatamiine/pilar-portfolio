import { locales, defaultLocale } from '../../i18n'

test('defaultLocale is fr', () => {
  expect(defaultLocale).toBe('fr')
})

test('locales contains fr, es, en in that order', () => {
  expect(locales).toEqual(['fr', 'es', 'en'])
})

test('locales has exactly 3 entries', () => {
  expect(locales).toHaveLength(3)
})
