import Image from 'next/image'
import type { HygraphImage } from '@/lib/hygraph'

interface ProjectHeroProps {
  coverImage: HygraphImage | null
  featuredImage: HygraphImage | null
  title: string
}

export function ProjectHero({ coverImage, featuredImage, title }: ProjectHeroProps) {
  const image = coverImage ?? featuredImage
  if (!image) {
    return (
      <div className="w-full h-[60vh] bg-grain flex items-center justify-center">
        <span className="font-cormorant italic text-3xl text-muted">{title}</span>
      </div>
    )
  }
  const paddingBottom = `${(image.height / image.width) * 100}%`
  return (
    <div className="w-full relative overflow-hidden" style={{ paddingBottom }}>
      <Image src={image.url} alt={title} fill priority className="object-cover" sizes="100vw" />
    </div>
  )
}
