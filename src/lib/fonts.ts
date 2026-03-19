import { Cormorant_Garamond, EB_Garamond, DM_Mono } from 'next/font/google'

// CSS variable names — must match @theme font definitions in globals.css exactly:
//   --font-cormorant   → fontFamily.cormorant
//   --font-eb-garamond → fontFamily.garamond
//   --font-dm-mono     → fontFamily.mono

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
})
