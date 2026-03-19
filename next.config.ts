import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.graphassets.com' },
      { protocol: 'https', hostname: 'eu-west-2.graphassets.com' },
      { protocol: 'https', hostname: 'eu-west-2.cdn.hygraph.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
