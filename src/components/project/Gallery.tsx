'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { HygraphImage } from '@/lib/strapi'

interface GalleryProps { images: HygraphImage[]; title: string }

export function Gallery({ images, title }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  if (!images?.length) return null

  const slides = images.map((img) => ({ src: img.url, width: img.width, height: img.height }))

  return (
    <div className="px-4 md:px-8 mt-16">
      {/* CSS masonry: 1col <768px, 2col 768-1279px, 3col ≥1280px */}
      <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
        {images.map((image, i) => (
          <button key={`${image.url}-${i}`} onClick={() => setLightboxIndex(i)}
            className="block w-full mb-4 overflow-hidden group cursor-zoom-in break-inside-avoid"
            aria-label={`${title} — image ${i + 1} of ${images.length}`}>
            <Image src={image.url} alt={`${title} ${i + 1}`} width={image.width} height={image.height}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
          </button>
        ))}
      </div>
      <Lightbox open={lightboxIndex >= 0} index={lightboxIndex} close={() => setLightboxIndex(-1)}
        slides={slides} styles={{ container: { backgroundColor: 'rgba(26,23,20,0.95)' } }} />
    </div>
  )
}
