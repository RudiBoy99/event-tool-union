import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const MEETING_OPTS = ['none', 'call', 'onsite'] as const

interface Props { step: number; onBack?: () => void; onSubmit: () => void }

export function ReviewSubmitStep({ step, onBack, onSubmit }: Props) {
  const { t } = useTranslation()
  const { watch, control, register } = useFormContext<EventRequestData>()
  const data = watch()

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onSubmit} nextLabel={t('nav.submit')}>
      <h1 className="display-xl text-2xl md:text-3xl mb-6">{t('steps.review.title')}</h1>

      <div className="space-y-5 mb-8 text-sm">
        <Row label={t('steps.contact.title')} value={`${data.contact.name} · ${data.contact.email}`} />
        <Row label={t('steps.location.title')} value={data.location} />
        <Row
          label={t('steps.date.title')}
          value={`${data.dateTime.date} · ${data.dateTime.startTime} · ${data.dateTime.durationMinutes / 60}h`}
        />
        <Row label={t('steps.eventType.title')} value={t(`steps.eventType.${data.eventType}`)} />
        <Row
          label={t('steps.attendees.title')}
          value={`${data.attendees.count} · ${data.sports.map((s) => `${s.sport} (${s.courts})`).join(', ')}`}
        />
      </div>

      <Controller
        name="meeting.wish"
        control={control}
        render={({ field }) => (
          <div className="mb-6">
            <Label className="label-caps mb-3 block">{t('steps.review.meeting')}</Label>
            <div className="flex gap-2">
              {MEETING_OPTS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => field.onChange(opt)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-full border transition',
                    field.value === opt
                      ? 'bg-[var(--color-brand)] text-black border-transparent'
                      : 'border-white/20 text-white/80',
                  )}
                >
                  {t(`steps.review.meetingOptions.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      <div>
        <Label className="label-caps">{t('steps.review.note')}</Label>
        <Textarea rows={3} {...register('meeting.note')} />
      </div>
    </StepShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
      <div className="label-caps flex-shrink-0 w-32">{label}</div>
      <div className="text-right text-white/80">{value}</div>
    </div>
  )
}
