import Image from 'next/image'
import type { HygraphImage } from '@/lib/strapi'

interface ProjectHeroProps {
  coverImage: HygraphImage | null
  featuredImage: HygraphImage | null
  title: string
}

export function ProjectHero({ coverImage, featuredImage, title }: ProjectHeroProps) {
  const image = coverImage ?? featuredImage
  if (!image) {
    return (
      <div className="w-full h-[55vh] bg-grain flex items-center justify-center">
        <span className="font-cormorant italic text-3xl text-muted">{title}</span>
      </div>
    )
  }
  return (
    <div className="w-full h-[55vh] relative overflow-hidden">
      <Image src={image.url} alt={title} fill priority className="object-cover object-center" sizes="100vw" />
    </div>
  )
}
