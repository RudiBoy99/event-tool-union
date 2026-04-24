import { cn } from '@/lib/utils'

type Rotation = 0 | 90 | 180 | 270

interface QuarterCircleProps {
  size?: number | string
  color?: string
  rotation?: Rotation
  image?: string
  imageGrade?: 1 | 2 | 3 | 4
  className?: string
  style?: React.CSSProperties
}

const GRADE_SIZE: Record<number, number> = { 1: 6, 2: 8, 3: 10, 4: 12 }

// Border-radius for quarter circle anchored at top-left, then rotated
const QC_RADIUS = '100% 0 0 0'

export function QuarterCircle({
  size = 120,
  color = 'var(--color-brand)',
  rotation = 0,
  image,
  imageGrade = 2,
  className,
  style,
}: QuarterCircleProps) {
  const sz = typeof size === 'number' ? `${size}px` : size
  const gradeSize = GRADE_SIZE[imageGrade]

  return (
    <div
      className={cn('relative overflow-hidden flex-shrink-0', className)}
      style={{
        width: sz,
        height: sz,
        borderRadius: QC_RADIUS,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        background: image ? 'var(--color-sand)' : color,
        ...style,
      }}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'grayscale(1) contrast(1.25) brightness(1.02)',
            maskImage: `radial-gradient(circle at center, #000 38%, transparent 40%)`,
            WebkitMaskImage: `radial-gradient(circle at center, #000 38%, transparent 40%)`,
            maskSize: `${gradeSize}px ${gradeSize}px`,
            WebkitMaskSize: `${gradeSize}px ${gradeSize}px`,
            maskRepeat: 'repeat',
            WebkitMaskRepeat: 'repeat',
          }}
        />
      )}
    </div>
  )
}
