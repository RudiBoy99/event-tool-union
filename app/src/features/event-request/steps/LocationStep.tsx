import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS, getAvailableLocations } from '../data/locations'
import { cn } from '@/lib/utils'

interface Props { step: number; onBack: () => void; onNext: () => void }

export function LocationStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch, setValue } = useFormContext<EventRequestData>()
  const selected = watch('location')
  const sports = watch('sports')

  const families = useMemo(() => (sports ?? []).map((s) => s.sport), [sports])
  const availableIds = useMemo(() => getAvailableLocations(families), [families])
  const visibleLocations = useMemo(
    () => availableIds.map((id) => LOCATIONS[id]).filter(Boolean),
    [availableIds],
  )

  // Auto-pre-select if exactly one location matches and current selection is invalid
  useEffect(() => {
    if (availableIds.length === 1 && selected !== availableIds[0]) {
      setValue('location', availableIds[0] as EventRequestData['location'])
      return
    }
    if (availableIds.length > 1 && selected && !availableIds.includes(selected)) {
      setValue('location', availableIds[0] as EventRequestData['location'])
    }
  }, [availableIds, selected, setValue])

  const onlyOne = visibleLocations.length === 1

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-3xl md:text-4xl mb-3">{t('steps.location.title')}</h1>

      {onlyOne && (
        <p className="text-sm text-white/70 mb-6 max-w-xl">
          {t('steps.location.autoSelected', { location: visibleLocations[0].name })}
        </p>
      )}

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3">
            {visibleLocations.map((loc) => (
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
