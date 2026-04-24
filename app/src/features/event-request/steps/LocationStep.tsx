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
                  'relative text-left p-5 transition-all duration-200 overflow-hidden',
                  field.value === loc.id
                    ? 'bg-[var(--color-brand)] text-black'
                    : 'border border-white/15 bg-white/[0.02] hover:bg-white/[0.04] text-white',
                )}
              >
                {/* Viertelkreis decoration — top-right */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '0 0 0 100%',
                    background: field.value === loc.id ? 'rgba(0,0,0,0.15)' : 'var(--color-brand)',
                    opacity: field.value === loc.id ? 1 : 0.35,
                  }}
                />
                <div
                  className="font-black text-lg uppercase tracking-wide"
                  style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
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
