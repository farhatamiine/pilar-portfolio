import { RichText } from '@/components/ui/RichText'
import type { RichTextContent } from '@/lib/hygraph'

interface StageDividerProps { stageTwoContent: RichTextContent | null }

export function StageDivider({ stageTwoContent }: StageDividerProps) {
  return (
    <div className="max-w-[680px] mx-auto px-4 md:px-0">
      <div className="flex items-center gap-4 my-16">
        <hr className="flex-1 border-accent" />
        <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">II</span>
        <hr className="flex-1 border-accent" />
      </div>
      {stageTwoContent?.html && (
        <RichText html={stageTwoContent.html}
          className="text-lg leading-relaxed text-body-text [&_em]:italic [&_p]:mb-4" />
      )}
    </div>
  )
}
