import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { AvailabilityBadge } from '../components/AvailabilityBadge'
import { AlternativeSlotCard } from '../components/AlternativeSlotCard'
import { checkAvailability } from '../logic/availability'
import { LOCATIONS } from '../data/locations'
import { DateTimeInput } from '@/components/ui/date-time-input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const DURATIONS = [
  { key: '2h', minutes: 120 },
  { key: '4h', minutes: 240 },
  { key: '6h', minutes: 360 },
  { key: 'day', minutes: 600 },
]

interface Props { step: number; onBack?: () => void; onNext: () => void }

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseDate(s: string): Date | undefined {
  if (!s) return undefined
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

export function DateDurationStep({ step, onBack, onNext }: Props) {
  const { t, i18n } = useTranslation()
  const { setValue, watch } = useFormContext<EventRequestData>()
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
      <h1 className="display-xl text-2xl md:text-3xl mb-6">
        {t('steps.date.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span className="text-[var(--color-brand)]">
          {t('steps.date.title').split(' ').slice(-1)}
        </span>
      </h1>

      <div className="mb-6">
        <DateTimeInput
          date={parseDate(date)}
          onDateChange={(d) => setValue('dateTime.date', d ? formatDate(d) : '')}
          time={startTime}
          onTimeChange={(t) => setValue('dateTime.startTime', t)}
          locale={i18n.language.startsWith('en') ? 'en' : 'de'}
          dateLabel={t('steps.date.date')}
          timeLabel={t('steps.date.startTime')}
          pickDateLabel={t('steps.date.pickDate') || 'Datum wählen…'}
        />
      </div>

      <div className="mb-6">
        <Label className="label-caps">{t('steps.date.duration')}</Label>
        <div className="flex gap-2 mt-2 flex-wrap items-center">
          {DURATIONS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setValue('dateTime.durationMinutes', d.minutes)}
              className={cn(
                'px-3.5 py-2 text-xs font-semibold rounded-full border transition',
                duration === d.minutes
                  ? 'bg-[var(--color-brand)] text-black border-transparent'
                  : 'border-white/20 text-white/80 hover:text-white hover:border-white/40',
              )}
            >
              {t(`steps.date.durations.${d.key}`)}
            </button>
          ))}
          <span className="text-xs text-white/40 mx-1">{t('steps.date.or')}</span>
          <div
            className={cn(
              'flex items-center gap-1 rounded-full border transition',
              !DURATIONS.some((d) => d.minutes === duration) && duration > 0
                ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]'
                : 'border-white/20',
            )}
          >
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              inputMode="decimal"
              value={
                !DURATIONS.some((d) => d.minutes === duration) && duration > 0
                  ? String(duration / 60)
                  : ''
              }
              placeholder={t('steps.date.customPlaceholder')}
              onChange={(e) => {
                const h = Number(e.target.value)
                if (h > 0 && h <= 24) setValue('dateTime.durationMinutes', Math.round(h * 60))
              }}
              className="w-[68px] bg-transparent pl-3 pr-1 py-2 text-xs font-semibold text-white placeholder:text-white/40 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="pr-3 text-xs text-white/60">h</span>
          </div>
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
