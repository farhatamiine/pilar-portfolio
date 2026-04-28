import type { HygraphImage } from '@/lib/strapi'
import { ImageGallery, type GalleryImage } from '@/components/ui/image-gallery'

interface ProjectImageGalleryProps {
  images: HygraphImage[] | null
  title: string
}

export function ProjectImageGallery({ images, title }: ProjectImageGalleryProps) {
  if (!images?.length) return null

  const galleryImages: GalleryImage[] = images.map((img) => ({
    src: img.url,
    alt: img.alternativeText ?? title,
    width: img.width ?? 1200,
    height: img.height ?? 800,
  }))

  return (
    <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto mt-16 mb-24">
      <ImageGallery images={galleryImages} />
    </section>
  )
}
