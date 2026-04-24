import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS } from '../data/locations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useBrandTheme } from '../theme/BrandThemeContext'

const AGES = ['children', 'teens', 'adults', 'mixed'] as const
const LEVELS = ['beginner', 'intermediate', 'advanced', 'mixed'] as const

const SPORT_COLORS: Record<string, string> = {
  padel:       '#3778F9',
  tennis:      '#F55127',
  golf:        '#00A358',
  pball:       '#9C4FED',
  tabletennis: '#3EC4C4',
}

const SPORT_LABELS: Record<string, string> = {
  padel:       'Padel',
  tennis:      'Tennis',
  golf:        'Golf',
  pball:       'Pickleball',
  tabletennis: 'Tischtennis',
}

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function AttendeesSportStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, control, watch, setValue } = useFormContext<EventRequestData>()
  const { setSports } = useBrandTheme()
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

  // Update brand theme when sports selection changes
  useEffect(() => {
    const selected = (sports ?? []).map((s) => s.sport)
    setSports(selected)
  }, [sports, setSports])

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
      <h1 className="display-xl text-3xl md:text-4xl mb-6">{t('steps.attendees.title')}</h1>

      {/* Attendee details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label className="label-caps">{t('steps.attendees.count')}</Label>
          <Input
            type="number"
            min={1}
            {...register('attendees.count', { valueAsNumber: true })}
            className="bg-white/5 border-white/15 text-white"
          />
        </div>
        <Controller
          name="attendees.ageGroup"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="label-caps">{t('steps.attendees.ageGroup')}</Label>
              <select
                className="w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white mt-1"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {AGES.map((a) => (
                  <option key={a} value={a} className="bg-black">{t(`steps.attendees.ageGroups.${a}`)}</option>
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
                className="w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white mt-1"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-black">{t(`steps.attendees.levels.${l}`)}</option>
                ))}
              </select>
            </div>
          )}
        />
      </div>

      {/* Sport selection — large color cards */}
      <Label className="label-caps mb-4 block">{t('steps.attendees.sports')}</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {availableSports.map((sport) => {
          const picked = sports?.find((s) => s.sport === sport)
          const sportColor = SPORT_COLORS[sport] ?? 'var(--color-brand)'
          const isActive = Boolean(picked)

          return (
            <button
              key={sport}
              onClick={() => toggleSport(sport)}
              className="relative aspect-square flex flex-col items-start justify-between p-4 transition-all duration-300"
              style={{
                background: isActive ? sportColor : 'rgba(255,255,255,0.04)',
                border: isActive ? `2px solid ${sportColor}` : '2px solid rgba(255,255,255,0.1)',
                opacity: !isActive && (sports?.length ?? 0) > 0 ? 0.35 : 1,
                transition: 'all 300ms ease',
              }}
            >
              {/* Quarter-circle decoration in corner */}
              <div
                className="absolute top-0 right-0 overflow-hidden"
                style={{
                  width: '40%',
                  height: '40%',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '0 0 0 100%',
                    background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.06)',
                  }}
                />
              </div>

              {/* Checkmark */}
              <div
                className="w-5 h-5 flex items-center justify-center text-xs font-black"
                style={{
                  background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
                }}
              >
                {isActive ? '✓' : ''}
              </div>

              {/* Sport name */}
              <div>
                <div
                  className="text-sm font-black uppercase tracking-wider leading-tight"
                  style={{
                    fontFamily: 'Archivo Black, sans-serif',
                    color: isActive ? '#000' : '#fff',
                  }}
                >
                  {SPORT_LABELS[sport] ?? sport}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Courts input for selected sports */}
      {(sports?.length ?? 0) > 0 && (
        <div className="space-y-3">
          {sports?.map((s) => (
            <div key={s.sport} className="flex items-center gap-4">
              <span
                className="text-xs font-black uppercase tracking-wider flex-1"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                {SPORT_LABELS[s.sport] ?? s.sport}
              </span>
              <Label className="label-caps">{t('steps.attendees.courts')}</Label>
              <Input
                type="number"
                min={1}
                max={10}
                className={cn('w-20 bg-white/5 border-white/15 text-white')}
                value={s.courts}
                onChange={(e) => updateCourts(s.sport, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      )}
    </StepShell>
  )
}
