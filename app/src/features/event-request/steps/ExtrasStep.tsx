import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { cn } from '@/lib/utils'

const GASTRO_KEYS = ['bistro', 'drinks', 'apero', 'foodtruck', 'externalCatering'] as const
const ROOM_KEYS = ['lounge', 'meetingRoom'] as const
const EXTRA_KEYS = ['coach', 'equipment', 'photographer', 'music', 'trophies'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

function ToggleGroup({ title, path, keys, labelPrefix }: {
  title: string
  path: 'gastro' | 'rooms' | 'extras'
  keys: readonly string[]
  labelPrefix: string
}) {
  const { t } = useTranslation()
  const { watch, setValue } = useFormContext<EventRequestData>()
  const values = watch(path) as Record<string, boolean>
  const toggle = (k: string) => setValue(`${path}.${k}` as any, !values[k])
  return (
    <section className="mb-8">
      <div className="label-caps mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={cn(
              'px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200',
              values[k]
                ? 'text-black'
                : 'border border-white/20 text-white/80 hover:text-white hover:border-white/40',
            )}
            style={values[k] ? { background: 'var(--color-brand)' } : {}}
          >
            {t(`${labelPrefix}.${k}`)}
          </button>
        ))}
      </div>
    </section>
  )
}

export function ExtrasStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext}>
      <h1 className="display-xl text-3xl md:text-4xl mb-8">{t('steps.extras.title')}</h1>
      <ToggleGroup title={t('steps.extras.gastro')} path="gastro" keys={GASTRO_KEYS} labelPrefix="steps.extras" />
      <ToggleGroup title={t('steps.extras.rooms')} path="rooms" keys={ROOM_KEYS} labelPrefix="steps.extras" />
      <ToggleGroup title={t('steps.extras.otherExtras')} path="extras" keys={EXTRA_KEYS} labelPrefix="steps.extras" />
    </StepShell>
  )
}
