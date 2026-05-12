import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS, type SportFamily } from '../data/locations'
import { DateTimeInput } from '@/components/ui/date-time-input'
import { Label } from '@/components/ui/label'

interface Props { step: number; onBack: () => void; onNext: () => void }

const SPORT_LABELS: Record<SportFamily, string> = {
  padel: 'Padel',
  tennis: 'Tennis',
  golf: 'Golf',
  pball: 'Pickleball',
  tabletennis: 'Tischtennis',
}

const SPORT_COLORS: Record<SportFamily, string> = {
  padel: '#3778F9',
  tennis: '#F55127',
  golf: '#00A358',
  pball: '#9C4FED',
  tabletennis: '#3EC4C4',
}

function maxCourtsAtLocation(sport: SportFamily, locationId: string): number {
  const loc = LOCATIONS[locationId]
  if (!loc) return 1
  const s = loc.sports as Record<string, number>
  switch (sport) {
    case 'padel':
      return (s.padel_panorama ?? 0) + (s.padel_single ?? 0) + (s.padel_indoor ?? 0) || 1
    case 'tennis':
      return (s.tennis_indoor ?? 0) + (s.tennis_outdoor ?? 0) || 1
    case 'golf':
      return (s.golf_sim ?? 0) + (s.golf_range ?? 0) || 1
    case 'pball':
      return s.pball ?? 1
    case 'tabletennis':
      return s.tabletennis ?? 1
    default:
      return 1
  }
}

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
  const sports = watch('sports') ?? []
  const [durationInput, setDurationInput] = useState<string>(() =>
    duration > 0 ? String(duration / 60) : '',
  )

  const updateCourts = (sport: SportFamily, courts: number) => {
    setValue(
      'sports',
      sports.map((s) => (s.sport === sport ? { ...s, courts } : s)),
    )
  }

  const updateGolf = (next: { drivingRange?: number; trackman?: number; puttingGreen?: boolean }) => {
    setValue(
      'sports',
      sports.map((s) => {
        if (s.sport !== 'golf') return s
        const cur = s.golf ?? { drivingRange: 1, trackman: 0, puttingGreen: false }
        const merged = { ...cur, ...next }
        const total = merged.drivingRange + merged.trackman + (merged.puttingGreen ? 1 : 0)
        return { ...s, golf: merged, courts: Math.max(1, total) }
      }),
    )
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">
        {t('steps.date.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span style={{ color: 'var(--color-brand)' }}>
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
        <div className="mt-2 flex items-center gap-1 border border-white/15 focus-within:border-[var(--color-brand)] transition w-fit">
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="24"
            inputMode="decimal"
            value={durationInput}
            placeholder={t('steps.date.customPlaceholder')}
            onChange={(e) => {
              const v = e.target.value
              setDurationInput(v)
              if (v === '') {
                setValue('dateTime.durationMinutes', 0)
                return
              }
              const h = Number(v)
              if (!isNaN(h) && h >= 0.5 && h <= 24) {
                setValue('dateTime.durationMinutes', Math.round(h * 60))
              }
            }}
            className="w-[96px] h-11 bg-white/5 pl-4 pr-1 text-base font-semibold text-white placeholder:text-white/40 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="pr-4 text-xs text-white/60">h</span>
        </div>
      </div>

      {sports.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Label className="label-caps">{t('steps.attendees.courts')}</Label>
            <CourtsInfo sports={sports.map((s) => s.sport)} />
          </div>
          <div className="space-y-2">
            {sports.map((s) => {
              const color = SPORT_COLORS[s.sport] ?? 'var(--color-brand)'

              if (s.sport === 'golf') {
                const golf = s.golf ?? { drivingRange: 1, trackman: 0, puttingGreen: false }
                return (
                  <div
                    key={s.sport}
                    className="border border-white/10 bg-white/[0.02] p-3 space-y-2"
                  >
                    <div
                      className="text-xs font-black uppercase tracking-wider"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', color }}
                    >
                      Golf
                    </div>
                    <SubStepper
                      label="Abschläge"
                      value={golf.drivingRange}
                      min={0}
                      max={5}
                      onChange={(n) => updateGolf({ drivingRange: n })}
                    />
                    <SubStepper
                      label="Trackman"
                      value={golf.trackman}
                      min={0}
                      max={3}
                      onChange={(n) => updateGolf({ trackman: n })}
                    />
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold uppercase tracking-wider text-white/85 flex-1"
                        style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                      >
                        Putting Green
                      </span>
                      {/* Toggle aligned within the same 144px-wide stepper slot
                          (10+14+10 width buttons + input) — keeps row-end consistent with the steppers above. */}
                      <div className="flex items-center justify-center h-10 w-[136px]">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={golf.puttingGreen}
                          onClick={() => updateGolf({ puttingGreen: !golf.puttingGreen })}
                          className="relative rounded-full shrink-0"
                          style={{
                            width: 48,
                            height: 26,
                            background: golf.puttingGreen
                              ? 'var(--color-brand)'
                              : 'rgba(255,255,255,0.15)',
                            transition: 'background 180ms ease',
                          }}
                        >
                          <span
                            className="absolute rounded-full bg-white"
                            style={{
                              width: 20,
                              height: 20,
                              top: 3,
                              left: golf.puttingGreen ? 25 : 3,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
                              transition: 'left 180ms ease',
                            }}
                          />
                        </button>
                      </div>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider w-12 text-right">
                        {/* spacer to align with /max label */}
                      </span>
                    </div>
                  </div>
                )
              }

              const max = maxCourtsAtLocation(s.sport, location)
              const set = (n: number) => updateCourts(s.sport, Math.min(max, Math.max(1, n)))
              return (
                <div
                  key={s.sport}
                  className="flex items-center gap-3 py-2 px-3 border border-white/10 bg-white/[0.02]"
                >
                  <span
                    className="text-xs font-black uppercase tracking-wider flex-1"
                    style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', color }}
                  >
                    {SPORT_LABELS[s.sport] ?? s.sport}
                  </span>
                  <div className="flex items-stretch h-10">
                    <button
                      type="button"
                      aria-label="−"
                      onClick={() => set(s.courts - 1)}
                      disabled={s.courts <= 1}
                      className="w-10 flex items-center justify-center border border-white/15 border-r-0 text-white text-xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/15 transition-all"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={max}
                      inputMode="numeric"
                      value={s.courts}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) set(v)
                      }}
                      onFocus={(e) => e.currentTarget.select()}
                      className="w-14 bg-white/5 border-y border-white/15 text-center text-lg text-white focus:outline-none focus:bg-white/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', fontWeight: 900 }}
                    />
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => set(s.courts + 1)}
                      disabled={s.courts >= max}
                      className="w-10 flex items-center justify-center border border-white/15 border-l-0 text-white text-xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/15 transition-all"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider w-12 text-right">
                    /&nbsp;{max}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </StepShell>
  )
}

function SubStepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)))
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-bold uppercase tracking-wider text-white/85 flex-1"
        style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
      >
        {label}
      </span>
      <div className="flex items-stretch h-10">
        <button
          type="button"
          aria-label="−"
          onClick={() => set(value - 1)}
          disabled={value <= min}
          className="w-10 flex items-center justify-center border border-white/15 border-r-0 text-white text-xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/15 transition-all"
          style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) set(v)
          }}
          onFocus={(e) => e.currentTarget.select()}
          className="w-14 bg-white/5 border-y border-white/15 text-center text-lg text-white focus:outline-none focus:bg-white/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', fontWeight: 900 }}
        />
        <button
          type="button"
          aria-label="+"
          onClick={() => set(value + 1)}
          disabled={value >= max}
          className="w-10 flex items-center justify-center border border-white/15 border-l-0 text-white text-xl leading-none select-none hover:bg-[var(--color-brand)] hover:text-black hover:border-[var(--color-brand)] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/15 transition-all"
          style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
        >
          +
        </button>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-wider w-12 text-right">
        /&nbsp;{max}
      </span>
    </div>
  )
}

/**
 * Info-Popover neben dem "Courts"-Label: zeigt empfohlene Spieleranzahl pro
 * Court/Anlage je nach gewählter Sportart.
 */
const COURT_HINTS: Record<SportFamily, string> = {
  padel: '4 Spieler pro Court (Doppel-Format) — Empfehlung',
  tennis: '2 Spieler (Single) oder 4 Spieler (Doppel) pro Court',
  pball: '2 Spieler (Single) oder 4 Spieler (Doppel) pro Court',
  tabletennis: '2 Spieler (Single) oder 4 Spieler (Doppel) pro Tisch',
  golf: '1 Spieler pro Abschlag · 1–4 pro Trackman-Simulator · 4–6 am Putting Green',
}

function CourtsInfo({ sports }: { sports: SportFamily[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Empfehlung Spieleranzahl pro Court"
        className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-white/30 text-[11px] font-bold text-white/60 hover:text-white hover:border-white/60 transition-colors"
        style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
      >
        i
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute left-0 top-7 z-30 w-[280px] p-3 shadow-2xl"
          style={{
            background: 'rgba(15,15,15,0.97)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-brand)] mb-2"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
          >
            Empfehlung pro Court
          </div>
          <ul className="space-y-1.5">
            {sports.map((sp) => (
              <li key={sp} className="text-[11px] text-white/85 leading-relaxed">
                <span
                  className="font-bold uppercase tracking-wider mr-1.5"
                  style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                >
                  {sp === 'pball' ? 'Pickleball' : sp.charAt(0).toUpperCase() + sp.slice(1)}:
                </span>
                {COURT_HINTS[sp] ?? '—'}
              </li>
            ))}
          </ul>
          <div
            className="text-[9.5px] text-white/40 mt-2 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            Tipp: Personenzahl ÷ Spieler pro Court ≈ Anzahl benötigter Courts
          </div>
        </div>
      )}
    </div>
  )
}
