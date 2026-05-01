import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const MEETING_OPTS = ['none', 'call', 'onsite'] as const

const FIELD_LABEL_DE: Record<string, string> = {
  'contact.name': 'Name',
  'contact.email': 'E-Mail',
  'contact.phone': 'Telefon',
  'eventType': 'Event-Typ',
  'attendees.count': 'Personenzahl',
  'sports': 'Sportart',
  'location': 'Standort',
  'dateTime.date': 'Datum',
  'dateTime.startTime': 'Startzeit',
  'dateTime.durationMinutes': 'Dauer',
}

const FIELD_LABEL_EN: Record<string, string> = {
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'eventType': 'Event type',
  'attendees.count': 'People',
  'sports': 'Sport',
  'location': 'Venue',
  'dateTime.date': 'Date',
  'dateTime.startTime': 'Start time',
  'dateTime.durationMinutes': 'Duration',
}

interface Props {
  step: number
  onBack: () => void
  onSubmit: () => Promise<void>
  onJumpToStep?: (step: number) => void
}

interface ValidationError extends Error {
  fields?: string[]
  targetStep?: number | null
}

export function ReviewSubmitStep({ step, onBack, onSubmit, onJumpToStep }: Props) {
  const { t, i18n } = useTranslation()
  const { watch, control, register } = useFormContext<EventRequestData>()
  const data = watch()
  const lang = (i18n.language || 'de').startsWith('en') ? 'en' : 'de'
  const labels = lang === 'en' ? FIELD_LABEL_EN : FIELD_LABEL_DE
  const [pending, setPending] = useState(false)
  const [errFields, setErrFields] = useState<string[] | null>(null)
  const [errTargetStep, setErrTargetStep] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (pending) return
    setErrFields(null)
    setErrTargetStep(null)
    setSubmitError(null)
    setPending(true)
    try {
      await onSubmit()
    } catch (e) {
      const ve = e as ValidationError
      if (ve?.message === 'VALIDATION_FAILED' && ve.fields) {
        setErrFields(ve.fields)
        setErrTargetStep(ve.targetStep ?? null)
      } else {
        setSubmitError(
          lang === 'en'
            ? 'Could not send request. Please try again or contact us directly.'
            : 'Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen oder uns direkt kontaktieren.',
        )
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <StepShell
      currentStep={step}
      onBack={onBack}
      onNext={handleSubmit}
      nextLabel={t('nav.submit')}
      nextPending={pending}
      surface="sand"
    >
      <h1 className="display-xl text-3xl md:text-4xl mb-8 text-black">
        {t('steps.review.title')}
      </h1>

      {errFields && errFields.length > 0 && (
        <div
          role="alert"
          className="mb-6 p-4 border-l-4"
          style={{ background: 'rgba(245,81,39,0.10)', borderColor: '#F55127' }}
        >
          <div
            className="text-xs font-black uppercase tracking-wider mb-1 text-black"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
          >
            {lang === 'en' ? 'Please complete these fields' : 'Bitte ergänze diese Felder'}
          </div>
          <ul className="text-sm text-black/80 mt-1 space-y-1">
            {errFields.map((f) => (
              <li key={f}>· {labels[f] ?? f}</li>
            ))}
          </ul>
          {errTargetStep && onJumpToStep && (
            <button
              onClick={() => onJumpToStep(errTargetStep)}
              className="mt-3 px-4 py-2 text-[11px] font-black tracking-[0.08em] uppercase bg-black text-white hover:brightness-110 active:scale-[0.97] transition-all"
              style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
            >
              {lang === 'en' ? `Jump to step ${errTargetStep}` : `Zu Schritt ${errTargetStep} springen`} →
            </button>
          )}
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 border-l-4"
          style={{ background: 'rgba(245,81,39,0.10)', borderColor: '#F55127' }}
        >
          <div className="text-sm text-black/85">{submitError}</div>
        </div>
      )}

      {/* Review rows */}
      <div className="space-y-0 mb-8 text-sm">
        <Row label={t('steps.contact.title')} value={`${data.contact.name} · ${data.contact.email}`} />
        <Row label={t('steps.location.title')} value={data.location} />
        <Row
          label={t('steps.date.title')}
          value={`${data.dateTime.date || '—'} · ${data.dateTime.startTime || '—'} · ${data.dateTime.durationMinutes / 60}h`}
        />
        <Row label={t('steps.eventType.title')} value={t(`steps.eventType.${data.eventType}`)} />
        <Row
          label={t('steps.attendees.title')}
          value={`${data.attendees.count} · ${data.sports.map((s) => `${s.sport} (${s.courts})`).join(', ')}`}
        />
      </div>

      {/* Meeting preference */}
      <Controller
        name="meeting.wish"
        control={control}
        render={({ field }) => (
          <div className="mb-6">
            <Label className="label-caps-dark mb-3 block">{t('steps.review.meeting')}</Label>
            <div className="flex flex-wrap gap-2">
              {MEETING_OPTS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => field.onChange(opt)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all',
                    field.value === opt
                      ? 'bg-black text-white'
                      : 'border border-black/20 text-black/70 hover:border-black/40',
                  )}
                >
                  {t(`steps.review.meetingOptions.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      {/* Note textarea */}
      <div>
        <Label className="label-caps-dark">{t('steps.review.note')}</Label>
        <Textarea
          rows={3}
          {...register('meeting.note')}
          className="mt-1 bg-black/5 border-black/15 text-black placeholder:text-black/40 resize-none"
        />
      </div>
    </StepShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-black/10">
      <div className="label-caps-dark flex-shrink-0 w-32">{label}</div>
      <div className="text-right text-black/80 text-sm">{value}</div>
    </div>
  )
}
