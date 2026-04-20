import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import { useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS } from '../data/locations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const AGES = ['children', 'teens', 'adults', 'mixed'] as const
const LEVELS = ['beginner', 'intermediate', 'advanced', 'mixed'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function AttendeesSportStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, control, watch, setValue } = useFormContext<EventRequestData>()
  const location = watch('location')
  const sports = watch('sports')

  const availableSports = useMemo(() => {
    const loc = LOCATIONS[location]
    const keys = Object.keys(loc?.sports ?? {})
    const families = new Set<string>()
    keys.forEach((k) => {
      if (k.startsWith('padel')) families.add('padel')
      else if (k.startsWith('tennis')) families.add('tennis')
      else if (k.startsWith('golf')) families.add('golf')
      else if (k === 'pball') families.add('pball')
      else if (k === 'tabletennis') families.add('tabletennis')
    })
    return Array.from(families)
  }, [location])

  const toggleSport = (sport: string) => {
    const current = sports ?? []
    const exists = current.find((s) => s.sport === sport)
    if (exists) {
      setValue('sports', current.filter((s) => s.sport !== sport))
    } else {
      setValue('sports', [...current, { sport: sport as any, courts: 1 }])
    }
  }

  const updateCourts = (sport: string, courts: number) => {
    const current = sports ?? []
    setValue('sports', current.map((s) => (s.sport === sport ? { ...s, courts } : s)))
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={(sports?.length ?? 0) === 0}>
      <h1 className="display-xl text-2xl md:text-3xl mb-6">{t('steps.attendees.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label className="label-caps">{t('steps.attendees.count')}</Label>
          <Input type="number" min={1} {...register('attendees.count', { valueAsNumber: true })} />
        </div>
        <Controller
          name="attendees.ageGroup"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="label-caps">{t('steps.attendees.ageGroup')}</Label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {AGES.map((a) => (
                  <option key={a} value={a}>{t(`steps.attendees.ageGroups.${a}`)}</option>
                ))}
              </select>
            </div>
          )}
        />
        <Controller
          name="attendees.level"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="label-caps">{t('steps.attendees.level')}</Label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{t(`steps.attendees.levels.${l}`)}</option>
                ))}
              </select>
            </div>
          )}
        />
      </div>

      <Label className="label-caps mb-3 block">{t('steps.attendees.sports')}</Label>
      <div className="grid gap-3">
        {availableSports.map((sport) => {
          const picked = sports?.find((s) => s.sport === sport)
          return (
            <div
              key={sport}
              className={cn(
                'p-4 rounded-md border flex items-center justify-between gap-3',
                picked ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]' : 'border-white/10 bg-white/[0.02]',
              )}
            >
              <button
                onClick={() => toggleSport(sport)}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider"
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center text-xs',
                    picked ? 'bg-[var(--color-brand)] text-black' : 'border border-white/30',
                  )}
                >
                  {picked ? '✓' : ''}
                </span>
                {sport}
              </button>
              {picked && (
                <div className="flex items-center gap-2">
                  <Label className="label-caps">{t('steps.attendees.courts')}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    className="w-20"
                    value={picked.courts}
                    onChange={(e) => updateCourts(sport, Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </StepShell>
  )
}
