import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n.request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
{ protocol: 'http', hostname: '141.94.121.93' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
    ],
  },
}

export default withNextIntl(nextConfig)
