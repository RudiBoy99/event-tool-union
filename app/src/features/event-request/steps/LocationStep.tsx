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
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.location.title')}</h1>
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
                  'text-left p-5 rounded-md transition border',
                  field.value === loc.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
                )}
              >
                <div className="font-extrabold text-lg">{loc.name}</div>
                <div className="text-xs text-white/60 mt-1">
                  {Object.keys(loc.sports).join(' · ')}
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </StepShell>
  )
}
