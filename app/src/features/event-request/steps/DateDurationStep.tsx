import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { AvailabilityBadge } from '../components/AvailabilityBadge'
import { AlternativeSlotCard } from '../components/AlternativeSlotCard'
import { checkAvailability } from '../logic/availability'
import { LOCATIONS } from '../data/locations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const DURATIONS = [
  { key: '2h', minutes: 120 },
  { key: '4h', minutes: 240 },
  { key: '6h', minutes: 360 },
  { key: 'day', minutes: 600 },
]

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function DateDurationStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, setValue, watch } = useFormContext<EventRequestData>()
  const location = watch('location')
  const date = watch('dateTime.date')
  const startTime = watch('dateTime.startTime')
  const duration = watch('dateTime.durationMinutes')

  const sportFamily = useMemo(() => {
    const loc = LOCATIONS[location]
    const keys = Object.keys(loc?.sports ?? {})
    if (keys.some((k) => k.startsWith('padel'))) return 'padel' as const
    if (keys.some((k) => k.startsWith('tennis'))) return 'tennis' as const
    if (keys.includes('pball')) return 'pball' as const
    return 'padel' as const
  }, [location])

  const result = useMemo(() => {
    if (!date || !startTime) return null
    return checkAvailability({
      location,
      date,
      from: startTime,
      durationMinutes: duration,
      sport: sportFamily,
      courtsNeeded: 1,
    })
  }, [location, date, startTime, duration, sportFamily])

  const pickAlternative = (d: string, f: string, mins: number) => {
    setValue('dateTime.date', d)
    setValue('dateTime.startTime', f)
    setValue('dateTime.durationMinutes', mins)
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={result?.status === 'full'}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">
        {t('steps.date.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span className="text-[var(--color-brand)]">
          {t('steps.date.title').split(' ').slice(-1)}
        </span>
      </h1>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="label-caps">{t('steps.date.date')}</Label>
          <Input type="date" {...register('dateTime.date')} />
        </div>
        <div>
          <Label className="label-caps">{t('steps.date.startTime')}</Label>
          <Input type="time" {...register('dateTime.startTime')} />
        </div>
      </div>
      <div className="mb-6">
        <Label className="label-caps">{t('steps.date.duration')}</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {DURATIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setValue('dateTime.durationMinutes', d.minutes)}
              className={cn(
                'px-3.5 py-2 text-xs font-semibold rounded-full border transition',
                duration === d.minutes
                  ? 'bg-[var(--color-brand)] text-black border-transparent'
                  : 'border-white/20 text-white/80 hover:text-white',
              )}
            >
              {t(`steps.date.durations.${d.key}`)}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <AvailabilityBadge result={result} sportLabel={sportFamily} />
          {result.status !== 'ok' && result.alternatives.length > 0 && (
            <div className="space-y-2">
              {result.alternatives.map((a, i) => (
                <AlternativeSlotCard
                  key={`${a.date}-${a.from}-${i}`}
                  slot={a}
                  onPick={() => pickAlternative(a.date, a.from, duration)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </StepShell>
  )
}
