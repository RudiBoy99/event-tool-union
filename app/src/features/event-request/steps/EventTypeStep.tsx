import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { cn } from '@/lib/utils'

const TYPES = [
  { id: 'birthday',   tagline: { de: 'Privat feiern',     en: 'Private party' } },
  { id: 'corporate',  tagline: { de: 'Mit dem Team',      en: 'With the team' } },
  { id: 'tournament', tagline: { de: 'Wettkampf-Modus',   en: 'Compete' } },
  { id: 'school',     tagline: { de: 'Schul-Anlass',      en: 'School event' } },
  { id: 'court_only', tagline: { de: 'Nur Court mieten',  en: 'Court rental only' } },
] as const

interface Props { step: number; onBack: () => void; onNext: () => void }

export function EventTypeStep({ step, onBack, onNext }: Props) {
  const { t, i18n } = useTranslation()
  const { control, watch } = useFormContext<EventRequestData>()
  const selected = watch('eventType')
  const lang = (i18n.language || 'de').startsWith('en') ? 'en' : 'de'

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">{t('steps.eventType.title')}</h1>
      <Controller
        name="eventType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TYPES.map((type, idx) => {
              const isActive = field.value === type.id
              const num = String(idx + 1).padStart(2, '0')
              return (
                <button
                  key={type.id}
                  onClick={() => field.onChange(type.id)}
                  className={cn(
                    'group relative text-left overflow-hidden transition-all duration-300',
                    'min-h-[140px] pl-5 pr-14 py-5 flex flex-col justify-between',
                    isActive
                      ? 'bg-[var(--color-brand)] text-black'
                      : 'bg-white/[0.03] text-white hover:bg-white/[0.06]',
                  )}
                  style={{
                    border: isActive ? '2px solid var(--color-brand)' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {/* Animated quarter-circle accent — slides in on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 transition-all duration-500 ease-out"
                    style={{
                      width: isActive ? 120 : 56,
                      height: isActive ? 120 : 56,
                      borderRadius: '100% 0 0 0',
                      background: isActive ? 'rgba(0,0,0,0.12)' : 'var(--color-brand)',
                      opacity: isActive ? 1 : 0.18,
                      transform: isActive ? 'translate(0,0)' : 'translate(0,0)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      width: 80, height: 80,
                      borderRadius: '100% 0 0 0',
                      background: 'var(--color-brand)',
                      opacity: isActive ? 0 : undefined,
                    }}
                  />

                  {/* Top: number marker only */}
                  <div className="relative z-10">
                    <span
                      className={cn(
                        'font-mono text-[10px] tracking-[0.2em] uppercase',
                        isActive ? 'text-black/60' : 'text-white/35',
                      )}
                    >
                      {num}
                    </span>
                  </div>

                  {/* Bottom row: title + tagline */}
                  <div className="relative z-10">
                    <div
                      className="font-black text-[15px] md:text-base uppercase leading-tight tracking-wide break-words"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', wordBreak: 'break-word' }}
                    >
                      {t(`steps.eventType.${type.id}`)}
                    </div>
                    <div
                      className={cn(
                        'text-[11px] mt-1 tracking-wide',
                        isActive ? 'text-black/65' : 'text-white/50',
                      )}
                    >
                      {type.tagline[lang]}
                    </div>
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <div
                      className="absolute top-4 right-4 z-20 w-6 h-6 flex items-center justify-center text-[12px] font-black"
                      style={{ background: '#000', color: 'var(--color-brand)' }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      />
    </StepShell>
  )
}
