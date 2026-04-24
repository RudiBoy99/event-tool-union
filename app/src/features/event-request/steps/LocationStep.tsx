import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS } from '../data/locations'
import { cn } from '@/lib/utils'

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function LocationStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<EventRequestData>()
  const selected = watch('location')

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">{t('steps.location.title')}</h1>
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3">
            {Object.values(LOCATIONS).map((loc) => (
              <button
                key={loc.id}
                onClick={() => field.onChange(loc.id)}
                className={cn(
                  'text-left p-5 transition-all duration-200',
                  field.value === loc.id
                    ? 'bg-[var(--color-brand)] text-black'
                    : 'border border-white/15 bg-white/[0.02] hover:bg-white/[0.04] text-white',
                )}
              >
                <div
                  className="font-black text-lg uppercase tracking-wide"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {loc.name}
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </StepShell>
  )
}
