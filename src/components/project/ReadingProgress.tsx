'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** A thin accent thread that draws across the top as the page is read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-accent z-[60] origin-left"
      style={{ scaleX }}
      aria-hidden
    />
  )
}
