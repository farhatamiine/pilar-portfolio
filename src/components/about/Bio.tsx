import Image from 'next/image'
import { RichText } from '@/components/ui/RichText'
import type { SiteMeta } from '@/lib/hygraph'

interface BioProps { siteMeta: SiteMeta }

export function Bio({ siteMeta }: BioProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
      {/* Desktop: photo left + bio right. Mobile: photo stacked above bio. */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {siteMeta.profilePhoto && (
          <div className="shrink-0 w-full md:w-[40%]">
            <div className="relative overflow-hidden bg-grain"
              style={{ paddingBottom: `${(siteMeta.profilePhoto.height / siteMeta.profilePhoto.width) * 100}%` }}>
              <Image src={siteMeta.profilePhoto.url} alt="Pilar Olivero" fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" priority />
            </div>
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-cormorant text-4xl italic text-ink mb-6">Pilar Olivero</h1>
          <RichText html={siteMeta.bio?.html ?? null}
            className="text-lg leading-loose text-body-text [&_p]:mb-4 [&_em]:italic" />
        </div>
      </div>
    </div>
  )
}
