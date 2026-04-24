import { cn } from '@/lib/utils'

type Grade = 1 | 2 | 3 | 4

const GRADE_SIZE: Record<Grade, number> = { 1: 6, 2: 8, 3: 10, 4: 12 }

interface HalftoneImageProps {
  src: string
  alt?: string
  grade?: Grade
  className?: string
  style?: React.CSSProperties
}

export function HalftoneImage({ src, alt = '', grade = 2, className, style }: HalftoneImageProps) {
  const maskSize = GRADE_SIZE[grade]
  return (
    <div className={cn('relative overflow-hidden', className)} style={style}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'grayscale(1) contrast(1.3) brightness(1.05)',
          maskImage: `radial-gradient(circle at center, #000 38%, transparent 40%)`,
          WebkitMaskImage: `radial-gradient(circle at center, #000 38%, transparent 40%)`,
          maskSize: `${maskSize}px ${maskSize}px`,
          WebkitMaskSize: `${maskSize}px ${maskSize}px`,
          maskRepeat: 'repeat',
          WebkitMaskRepeat: 'repeat',
        }}
      />
    </div>
  )
}
