import { RichText } from '@/components/ui/RichText'
import type { RichTextContent } from '@/lib/hygraph'

interface ProjectStatementProps { description: RichTextContent | null }

export function ProjectStatement({ description }: ProjectStatementProps) {
  if (!description?.html) return null
  return (
    <div className="px-4 md:px-0 max-w-[680px] mx-auto my-12">
      <RichText html={description.html}
        className="text-lg leading-relaxed text-body-text [&_em]:italic [&_strong]:font-medium [&_p]:mb-4" />
    </div>
  )
}
