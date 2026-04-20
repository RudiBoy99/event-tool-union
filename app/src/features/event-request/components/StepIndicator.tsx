import { useTranslation } from 'react-i18next'

export function StepIndicator({ current, total = 7 }: { current: number; total?: number }) {
  const { t } = useTranslation()
  const display = t('steps.indicator', { n: String(current).padStart(2, '0') })
  return (
    <div className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium">
      {display.replace('07', String(total).padStart(2, '0'))}
    </div>
  )
}
