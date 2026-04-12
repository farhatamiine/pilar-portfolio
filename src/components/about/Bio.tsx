import Image from 'next/image'
import { RichText } from '@/components/ui/RichText'
import type { AboutPage } from '@/lib/strapi'

interface BioProps { aboutPage: AboutPage }

export function Bio({ aboutPage }: BioProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {aboutPage.profileImage && (
          <div className="shrink-0 w-full md:w-[40%]">
            <div className="relative overflow-hidden bg-grain"
              style={{ paddingBottom: `${(aboutPage.profileImage.height / aboutPage.profileImage.width) * 100}%` }}>
              <Image src={aboutPage.profileImage.url} alt="Pilar Olivero" fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" priority />
            </div>
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-cormorant text-4xl italic text-ink mb-6">
            {aboutPage.heading ?? 'Pilar Olivero'}
          </h1>
          {aboutPage.subtitle && (
            <p className="font-mono text-sm text-muted mb-6">{aboutPage.subtitle}</p>
          )}
          <RichText html={aboutPage.biography?.html ?? null}
            className="text-lg leading-loose text-body-text" />
          {aboutPage.availability && (
            <p className="mt-8 font-mono text-xs text-muted border-t border-dividers pt-4">
              {aboutPage.availability}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
