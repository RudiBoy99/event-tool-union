import { cn } from '@/lib/utils'

const TOTAL = 7

export function StepIndicator({ current }: { current: number; total?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Step ${current} of ${TOTAL}`}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const step = i + 1
        const isCompleted = step < current
        const isActive = step === current

        return (
          <div
            key={step}
            className={cn(
              'w-2.5 h-2.5 relative overflow-hidden flex-shrink-0 transition-all duration-300',
              isCompleted
                ? 'bg-[var(--color-brand)]'
                : isActive
                  ? 'border border-[var(--color-brand)]'
                  : 'border border-white/20',
            )}
          >
            {/* Active step: quarter-circle fill */}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 w-full h-full bg-[var(--color-brand)]"
                style={{ borderRadius: '0 100% 0 0', width: '55%', height: '55%' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
