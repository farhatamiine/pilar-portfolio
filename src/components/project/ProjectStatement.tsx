'use client'

import { motion } from 'framer-motion'
import { RichText } from '@/components/ui/RichText'
import type { RichTextContent } from '@/lib/strapi'

interface ProjectStatementProps { description: RichTextContent | null }

export function ProjectStatement({ description }: ProjectStatementProps) {
  if (!description?.html) return null
  return (
    <motion.div
      className="px-6 md:px-0 max-w-[680px] mx-auto my-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <RichText html={description.html} className="text-body text-body-text" />
    </motion.div>
  )
}
