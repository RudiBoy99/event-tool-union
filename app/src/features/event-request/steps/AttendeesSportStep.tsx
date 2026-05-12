import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { getAvailableLocations } from '../data/locations'
import { Label } from '@/components/ui/label'
import { useBrandTheme } from '../theme/BrandThemeContext'

const AGES = ['kids', 'adults', 'mixed'] as const

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

const SPORT_BALL_ICONS: Record<string, string> = {
  padel:       '/logos/UnionPadel_Ball_RGB.png',
  tennis:      '/logos/UnionTennis_Ball_RGB.png',
  golf:        '/logos/UnionGolf_Ball_RGB.png',
  pball:       '/logos/UnionPickleball_Ball_RGB.png',
  tabletennis: '/logos/UnionTableTennis_Ball_RGB.png',
}

interface Props { step: number; onBack: () => void; onNext: () => void }

export function AttendeesSportStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch, setValue } = useFormContext<EventRequestData>()
  const { setSports } = useBrandTheme()
  const sports = watch('sports')
  const eventType = watch('eventType')
  const isNeonPadel = eventType === 'neon_padel'

  // Neon Padel läuft nur in Hafen mit Padel — alle anderen Sportarten ausblenden.
  const availableSports = useMemo(
    () => (isNeonPadel ? ['padel'] : ['padel', 'tennis', 'golf', 'pball']),
    [isNeonPadel],
  )

  // Falls Neon Padel aktiv ist und Padel noch nicht gesetzt, automatisch setzen.
  useEffect(() => {
    if (isNeonPadel && !(sports ?? []).some((s) => s.sport === 'padel')) {
      setValue('sports', [{ sport: 'padel', courts: 1 }])
    }
  }, [isNeonPadel, sports, setValue])

  // Update brand theme when sports selection changes
  useEffect(() => {
    const selected = (sports ?? []).map((s) => s.sport)
    setSports(selected)
  }, [sports, setSports])

  // Detect sport-combination conflict (no single location offers all selected sports)
  const selectedFamilies = useMemo(() => (sports ?? []).map((s) => s.sport), [sports])
  const hasConflict = useMemo(
    () => selectedFamilies.length > 0 && getAvailableLocations(selectedFamilies).length === 0,
    [selectedFamilies],
  )

  const toggleSport = (sport: string) => {
    // Padel ist bei Neon Padel gesperrt aktiv — Deselect ist nicht erlaubt.
    if (isNeonPadel && sport === 'padel') return
    const current = sports ?? []
    const exists = current.find((s) => s.sport === sport)
    if (exists) {
      setValue('sports', current.filter((s) => s.sport !== sport))
    } else {
      const entry =
        sport === 'golf'
          ? { sport: 'golf' as const, courts: 1, golf: { drivingRange: 1, trackman: 0, puttingGreen: false } }
          : { sport: sport as any, courts: 1 }
      setValue('sports', [...current, entry])
    }
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={(sports?.length ?? 0) === 0 || hasConflict}>
      <h1 className="display-xl text-3xl md:text-4xl mb-6">{t('steps.attendees.title')}</h1>

      {/* Attendee details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Controller
          name="attendees.count"
          control={control}
          render={({ field }) => {
            const current = typeof field.value === 'number' && Number.isFinite(field.value) ? field.value : 1
            const set = (n: number) => field.onChange(Math.min(200, Math.max(1, n)))
            return (
              <div>
                <Label className="label-caps">{t('steps.attendees.count')}</Label>
                <div className="flex items-stretch mt-1 h-12 w-full max-w-[260px]">
                  <button
                    type="button"
                    aria-label="−"
                    onClick={() => set(current - 1)}
                    className="w-12 flex items-center justify-center border border-white/15 border-r-0 text-white text-2xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 transition-all"
                    style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={200}
                    value={current}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (Number.isFinite(v)) set(v)
                    }}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 min-w-0 bg-white/5 border-y border-white/15 text-center text-xl text-white focus:outline-none focus:bg-white/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', fontWeight: 900 }}
                  />
                  <button
                    type="button"
                    aria-label="+"
                    onClick={() => set(current + 1)}
                    className="w-12 flex items-center justify-center border border-white/15 border-l-0 text-white text-2xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 transition-all"
                    style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          }}
        />
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
      </div>

      {/* Sport selection — large color cards */}
      <Label className="label-caps mb-4 block">{t('steps.attendees.sports')}</Label>
      {isNeonPadel && (
        <div
          className="mb-4 p-3 border-l-4 text-xs"
          style={{
            background: 'rgba(255,30,180,0.08)',
            borderColor: 'rgba(255,30,180,0.7)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <span
            className="font-black uppercase tracking-wider mr-2"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', color: 'rgba(255,80,200,1)' }}
          >
            Neon Padel
          </span>
          läuft ausschliesslich in <strong className="font-bold">Basel Hafen</strong> mit Padel.
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {availableSports.map((sport) => {
          const picked = sports?.find((s) => s.sport === sport)
          const sportColor = SPORT_COLORS[sport] ?? 'var(--color-brand)'
          const isActive = Boolean(picked)

          return (
            <button
              key={sport}
              onClick={() => toggleSport(sport)}
              className="relative aspect-square flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300"
              style={{
                background: '#000000',
                border: isActive ? `3px solid ${sportColor}` : '2px solid rgba(255,255,255,0.1)',
                opacity: !isActive && (sports?.length ?? 0) > 0 ? 0.4 : 1,
                transition: 'all 300ms ease',
              }}
            >
              {/* Checkmark indicator — top-right when selected */}
              {isActive && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[10px] font-black"
                  style={{ background: sportColor, color: '#000' }}
                >
                  ✓
                </div>
              )}

              {/* Ball icon */}
              <img
                src={SPORT_BALL_ICONS[sport] ?? '/logos/UnionSport_Ball_RGB.png'}
                alt=""
                className="w-[45%] h-auto object-contain"
              />

              {/* Sport name */}
              <div
                className="text-xs font-black uppercase tracking-wider leading-tight text-center"
                style={{
                  fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                  color: isActive ? sportColor : 'rgba(255,255,255,0.7)',
                }}
              >
                {SPORT_LABELS[sport] ?? sport}
              </div>
            </button>
          )
        })}
      </div>

      {/* Conflict warning when selected sports have no common location */}
      {hasConflict && (
        <div
          role="alert"
          className="mb-6 p-4 border-l-4"
          style={{
            background: 'rgba(245, 81, 39, 0.08)',
            borderColor: '#F55127',
          }}
        >
          <div
            className="text-xs font-black uppercase tracking-wider mb-1"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', color: '#F55127' }}
          >
            {t('steps.attendees.conflictTitle')}
          </div>
          <div className="text-sm text-white/85">
            {t('steps.attendees.conflictText')}
          </div>
        </div>
      )}

    </StepShell>
  )
}
