import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { cn } from '@/lib/utils'

const TYPES = ['birthday', 'corporate', 'teambuilding', 'tournament', 'camp', 'school', 'court_only'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function EventTypeStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<EventRequestData>()
  const selected = watch('eventType')

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">{t('steps.eventType.title')}</h1>
      <Controller
        name="eventType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => field.onChange(type)}
                className={cn(
                  'relative p-5 text-left transition-all duration-200 overflow-hidden',
                  field.value === type
                    ? 'bg-[var(--color-brand)] text-black'
                    : 'border border-white/15 bg-white/[0.02] hover:bg-white/[0.04] text-white',
                )}
              >
                {/* Brand mark — top-right corner */}
                <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center">
                  {field.value === type ? (
                    <div className="w-5 h-5 bg-[var(--color-sand)]" />
                  ) : (
                    <img src="/logos/UnionSport_Ball_RGB.png" alt="" className="w-5 h-5 object-contain" />
                  )}
                </div>
                <div
                  className="font-black text-sm uppercase tracking-wider"
                  style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                >
                  {t(`steps.eventType.${type}`)}
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </StepShell>
  )
}
