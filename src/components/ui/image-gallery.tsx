'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

export interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

// ─── Hairline SVG icons ───────────────────────────────────────────────────────

const IconClose = () => (
  <svg
    width="17" height="17" viewBox="0 0 17 17"
    fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
  >
    <line x1="2" y1="2" x2="15" y2="15" />
    <line x1="15" y1="2" x2="2" y2="15" />
  </svg>
)

const IconLeft = () => (
  <svg
    width="20" height="20" viewBox="0 0 20 20"
    fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="13 16 7 10 13 4" />
  </svg>
)

const IconRight = () => (
  <svg
    width="20" height="20" viewBox="0 0 20 20"
    fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="7 16 13 10 7 4" />
  </svg>
)

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: GalleryImage[]
  activeIndex: number
  direction: number // −1 = prev, 0 = open, +1 = next
  onClose: () => void
  onNavigate: (index: number, dir: number) => void
}

function Lightbox({ images, activeIndex, direction, onClose, onNavigate }: LightboxProps) {
  const count = images.length
  const active = images[activeIndex]
  const trayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  onNavigate((activeIndex - 1 + count) % count, -1)
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % count, +1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, count, onClose, onNavigate])

  // Keep active thumbnail visible in the filmstrip
  useEffect(() => {
    const tray = trayRef.current
    if (!tray) return
    const thumb = tray.querySelectorAll('button')[activeIndex] as HTMLElement | undefined
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeIndex])

  // Hero sizing — preserve aspect ratio within safe viewport bounds
  const ratio = active.width && active.height ? active.width / active.height : 4 / 3
  const heroStyle: React.CSSProperties =
    ratio >= 1
      ? { width: 'min(82vw, calc(76vh * var(--r)))', aspectRatio: `${ratio}` }
      : { height: 'min(76vh, calc(72vw / var(--r)))', aspectRatio: `${ratio}` }

  // Directional cross-fade: initial open → soft scale emerge; navigation → intent slide
  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d === 0 ? 0 : d * 56,
      scale: d === 0 ? 0.96 : 1,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({
      opacity: 0,
      x: d === 0 ? 0 : d * -28,
      scale: d === 0 ? 0.98 : 1,
    }),
  }

  return (
    <>
      {/* ─── Deep charcoal backdrop ─── */}
      <motion.div
        className="fixed inset-0 z-[60] bg-[#1c1a18]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        onClick={onClose}
      />

      {/* ─── Shell ─── */}
      <motion.div
        className="fixed inset-0 z-[61] flex flex-col select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        {/* ── Top bar: counter + close ── */}
        <div className="flex items-center justify-between px-7 pt-6 pb-0 shrink-0">
          <span className="font-mono text-[9px] tracking-[0.38em] text-white/25 uppercase tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(count).padStart(2, '0')}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="text-white/30 hover:text-white/80 transition-colors duration-300 p-2 -mr-2"
            aria-label="Close gallery"
          >
            <IconClose />
          </button>
        </div>

        {/* ── Hero + side arrows ── */}
        <div className="flex-1 flex items-center justify-center min-h-0 relative px-14 md:px-20 py-4">

          {/* Prev arrow */}
          {count > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate((activeIndex - 1 + count) % count, -1)
              }}
              className="absolute left-3 md:left-5 z-10 text-white/25 hover:text-white/70 transition-colors duration-300 p-3"
              aria-label="Previous image"
            >
              <IconLeft />
            </button>
          )}

          {/* Cross-fade image stage */}
          <div className="flex items-center justify-center w-full h-full overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative overflow-hidden"
                style={{ '--r': ratio, ...heroStyle } as React.CSSProperties}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 768px) 92vw, 82vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next arrow */}
          {count > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNavigate((activeIndex + 1) % count, +1)
              }}
              className="absolute right-3 md:right-5 z-10 text-white/25 hover:text-white/70 transition-colors duration-300 p-3"
              aria-label="Next image"
            >
              <IconRight />
            </button>
          )}
        </div>

        {/* ── Filmstrip tray ── */}
        {count > 1 && (
          <div
            className="shrink-0 pb-6 pt-1 px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={trayRef}
              className="flex gap-[5px] overflow-x-auto justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((img, i) => {
                const thumbRatio = img.width && img.height ? img.width / img.height : 1
                const thumbW = Math.round(54 * thumbRatio)
                const isActive = i === activeIndex
                return (
                  <button
                    key={i}
                    onClick={() => onNavigate(i, i > activeIndex ? 1 : -1)}
                    className="relative flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out focus-visible:outline-none"
                    style={{
                      width: `${thumbW}px`,
                      height: '54px',
                      opacity: isActive ? 1 : 0.28,
                      outline: isActive
                        ? '1px solid rgba(255,255,255,0.55)'
                        : '1px solid transparent',
                      outlineOffset: '2px',
                    }}
                    aria-label={`View image ${i + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}

// ─── Grid item ────────────────────────────────────────────────────────────────

function GalleryItem({
  image,
  index,
  onClick,
}: {
  image: GalleryImage
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

  const ratio = image.width && image.height ? image.width / image.height : 1
  const aspectRatio = ratio >= 1.2 ? 16 / 9 : ratio <= 0.85 ? 9 / 16 : 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
      className="w-full"
    >
      <button
        className="w-full block cursor-zoom-in group relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        onClick={onClick}
        aria-label={`Open image ${index + 1}`}
      >
        <AspectRatio ratio={aspectRatio}>
          {/* Subtle warm vignette on hover */}
          <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/8 transition-colors duration-500 ease-out" />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </AspectRatio>
      </button>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)

  const close    = useCallback(() => setOpenIndex(null), [])
  const navigate = useCallback((i: number, dir: number) => {
    setDirection(dir)
    setOpenIndex(i)
  }, [])

  if (!images.length) return null

  // Split into 3 masonry columns
  const columns: GalleryImage[][] = [[], [], []]
  images.forEach((img, i) => columns[i % 3].push(img))

  return (
    <>
      <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4', className)}>
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3 md:gap-4">
            {col.map((image, rowIdx) => {
              const globalIdx = colIdx + rowIdx * 3
              return (
                <GalleryItem
                  key={`${colIdx}-${rowIdx}`}
                  image={image}
                  index={globalIdx}
                  onClick={() => { setDirection(0); setOpenIndex(globalIdx) }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={images}
            activeIndex={openIndex}
            direction={direction}
            onClose={close}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </>
  )
}
