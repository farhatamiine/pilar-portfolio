'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import 'yet-another-react-lightbox/styles.css'
import type { HygraphImage } from '@/lib/strapi'

// Lightbox JS is only needed on first click — defer the chunk until then
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })

interface GalleryProps { images: HygraphImage[]; title: string }

export function Gallery({ images, title }: GalleryProps) {
  const t = useTranslations('project')
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  if (!images?.length) return null

  const slides = images.map((img) => ({ src: img.url, width: img.width, height: img.height }))

  return (
    <div className="px-6 md:px-8 mt-16">
      {/* CSS masonry: 1col <768px, 2col 768-1279px, 3col ≥1280px */}
      <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
        {images.map((image, i) => (
          <button
            key={`${image.url}-${i}`}
            onClick={() => setLightboxIndex(i)}
            className="block w-full mb-4 overflow-hidden group cursor-zoom-in break-inside-avoid"
            aria-label={t('galleryImage', { title, index: i + 1, total: images.length })}
          >
            <Image
              src={image.url}
              alt={`${title} ${i + 1}`}
              width={image.width}
              height={image.height}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              // First two images may be near the fold — load them eagerly
              loading={i < 2 ? 'eager' : 'lazy'}
            />
          </button>
        ))}
      </div>

      {/* Only mount Lightbox after first click — avoids loading its JS bundle on page entry */}
      {lightboxIndex >= 0 && (
        <Lightbox
          open
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={slides}
          styles={{ container: { backgroundColor: 'rgba(26,23,20,0.95)' } }}
        />
      )}
    </div>
  )
}
