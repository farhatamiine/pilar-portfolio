'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Ambient cursor follower — 6px accent dot with spring physics.
 * Isolated client component; never triggers re-renders in parent.
 * Hidden on touch devices (pointer: coarse) via CSS.
 */
export function CursorFollower() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 180, damping: 22, restDelta: 0.001 })
  const springY = useSpring(y, { stiffness: 180, damping: 22, restDelta: 0.001 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[200] w-[5px] h-[5px] rounded-full bg-accent mix-blend-multiply hidden [@media(pointer:fine)]:block"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      aria-hidden
    />
  )
}
