import { cn } from '@/lib/utils'

type Grade = 1 | 2 | 3 | 4

const GRADE_DOT_SIZE: Record<Grade, number> = { 1: 3, 2: 4, 3: 5, 4: 6 }

interface HalftoneImageProps {
  src: string
  alt?: string
  grade?: Grade
  tint?: boolean
  className?: string
  style?: React.CSSProperties
}

export function HalftoneImage({
  src,
  alt = '',
  grade = 2,
  tint = true,
  className,
  style,
}: HalftoneImageProps) {
  const dot = GRADE_DOT_SIZE[grade]
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: 'var(--color-sand)', ...style }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'grayscale(1) contrast(1.15) brightness(1.02)',
        }}
      />
      {/* Brand-tinted halftone dot overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--color-brand) 45%, transparent 48%)`,
          backgroundSize: `${dot}px ${dot}px`,
          mixBlendMode: tint ? 'multiply' : 'darken',
          opacity: 0.85,
        }}
      />
    </div>
  )
}
