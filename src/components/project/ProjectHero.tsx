import Image from 'next/image'
import type { HygraphImage } from '@/lib/strapi'

interface ProjectHeroProps {
  coverImage: HygraphImage | null
  featuredImage: HygraphImage | null
  title: string
  /** CSS object-position — set per-project in Strapi (e.g. "center", "top", "50% 30%") */
  focalPoint?: string | null
}

export function ProjectHero({ coverImage, featuredImage, title, focalPoint }: ProjectHeroProps) {
  const image = coverImage ?? featuredImage
  if (!image) {
    return (
      <div className="w-full h-[70vh] bg-grain flex items-center justify-center">
        <span className="font-cormorant italic text-3xl text-muted">{title}</span>
      </div>
    )
  }
  return (
    <div className="w-full h-[70vh] relative overflow-hidden">
      <Image
        src={image.url}
        alt={title}
        fill
        priority
        className="object-cover"
        style={{ objectPosition: focalPoint ?? 'center' }}
        sizes="100vw"
      />
    </div>
  )
}
