import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function ContactStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, formState: { errors }, trigger } = useFormContext<EventRequestData>()

  const handleNext = async () => {
    const ok = await trigger('contact')
    if (ok) onNext()
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={handleNext}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">
        {t('steps.contact.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span style={{ color: 'var(--color-brand)' }}>
          {t('steps.contact.title').split(' ').slice(-1)}
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="label-caps">{t('steps.contact.name')}</Label>
          <Input
            {...register('contact.name')}
            className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.contact?.name && <p className="text-red-400 text-xs mt-1">{errors.contact.name.message}</p>}
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.company')}</Label>
          <Input
            {...register('contact.company')}
            className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.email')}</Label>
          <Input
            type="email"
            {...register('contact.email')}
            className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.contact?.email && <p className="text-red-400 text-xs mt-1">{errors.contact.email.message}</p>}
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.phone')}</Label>
          <Input
            {...register('contact.phone')}
            className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
          />
          {errors.contact?.phone && <p className="text-red-400 text-xs mt-1">{errors.contact.phone.message}</p>}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="text-[10px] tracking-[0.15em] uppercase text-white/45 font-semibold mb-1.5">
          {t('steps.contact.consentTitle')}
        </div>
        <p className="text-[12px] leading-[1.55] text-white/55">
          {t('steps.contact.consent')}{' '}
          <a
            href="https://www.union-sport.ch/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-brand)] decoration-2 underline-offset-2 hover:text-white"
          >
            {t('steps.contact.privacyLink')}
          </a>
        </p>
      </div>
    </StepShell>
  )
}
