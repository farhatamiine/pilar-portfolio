interface RichTextProps {
  html: string | null | undefined
  className?: string
}

// Note: html comes exclusively from Hygraph (admin-only CMS).
// No user-generated content — sanitization is not required.
export function RichText({ html, className = '' }: RichTextProps) {
  if (!html) return null
  return (
    <div
      className={`font-garamond ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
