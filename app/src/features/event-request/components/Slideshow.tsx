import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MediaItem } from '../data/images'

interface Props {
  items: MediaItem[]
  /** Default per-slide duration for images (ms). Videos use their own durationMs if set. */
  intervalMs?: number
  className?: string
  style?: React.CSSProperties
  /** Optional dark overlay opacity (0–1) for legibility when text sits on top. */
  overlayOpacity?: number
  /** Apply slow zoom (Ken Burns) on all slides — images AND videos — for seamless feel. */
  kenBurns?: boolean
  /** Crossfade duration in ms. Longer = softer image↔video transition. */
  fadeMs?: number
}

/**
 * Smooth crossfading slideshow. Both image and video slides are wrapped in a
 * single motion.div so the transition timing (opacity + scale) is identical
 * across media types — that's what makes image→video and video→image swaps
 * feel like one fluid sequence instead of two unrelated layers.
 */
export function Slideshow({
  items,
  intervalMs = 3000,
  className,
  style,
  overlayOpacity = 0,
  kenBurns = true,
  fadeMs = 1000,
}: Props) {
  const [index, setIndex] = useState(0)
  const key = items.map((i) => i.src).join('|')

  useEffect(() => {
    setIndex(0)
  }, [key])

  useEffect(() => {
    if (items.length < 2) return
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    const current = items[index]
    if (!current) return
    const duration =
      current.type === 'video'
        ? current.durationMs ?? intervalMs
        : intervalMs
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % items.length)
    }, duration)
    return () => window.clearTimeout(t)
  }, [index, key, items, intervalMs])

  if (items.length === 0) return null
  const current = items[index] ?? items[0]
  const isImage = current.type === 'image'
  const slideSeconds = (current.type === 'video' ? current.durationMs ?? intervalMs : intervalMs) / 1000

  // Images get aggressive Ken Burns (zoom + Y-drift) so they don't feel static
  // next to motion-rich video clips. Videos get a much milder zoom — they
  // already carry their own motion, so heavy KB would compete with it.
  const targetScale = kenBurns ? (isImage ? 1.16 : 1.04) : 1
  const exitScale   = kenBurns ? (isImage ? 1.20 : 1.06) : 1
  const initialY    = kenBurns && isImage ? '-1.5%' : '0%'
  const targetY     = kenBurns && isImage ? '2%'    : '0%'
  const exitY       = kenBurns && isImage ? '3%'    : '0%'
  // Origin alternates between left & right of center on images for variety
  const originX = isImage ? (index % 2 === 0 ? '38%' : '62%') : '50%'

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={current.src}
          initial={{ opacity: 0, scale: 1.0, y: initialY }}
          animate={{ opacity: 1, scale: targetScale, y: targetY }}
          exit={{ opacity: 0, scale: exitScale, y: exitY }}
          transition={{
            opacity: { duration: fadeMs / 1000, ease: [0.4, 0, 0.2, 1] },
            scale:   { duration: slideSeconds + fadeMs / 1000, ease: 'linear' },
            y:       { duration: slideSeconds + fadeMs / 1000, ease: 'linear' },
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transformOrigin: `${originX} center`,
            willChange: 'opacity, transform',
          }}
        >
          {current.type === 'image' ? (
            <img
              src={current.src}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <video
              src={current.src}
              poster={current.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {overlayOpacity > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0,0,0,${overlayOpacity})`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
