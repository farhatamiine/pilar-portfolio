import { RichText } from '@/components/ui/RichText'
import type { RichTextContent } from '@/lib/strapi'

interface ProjectStatementProps { description: RichTextContent | null }

export function ProjectStatement({ description }: ProjectStatementProps) {
  if (!description?.html) return null
  return (
    <div className="px-6 md:px-0 max-w-[680px] mx-auto my-12">
      <RichText html={description.html}
        className="font-garamond text-body leading-body text-body-text [&_em]:italic [&_strong]:font-medium [&_p]:mb-4" />
    </div>
  )
}
