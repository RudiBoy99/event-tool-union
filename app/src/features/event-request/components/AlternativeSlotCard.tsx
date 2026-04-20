import { useTranslation } from 'react-i18next'
import type { AlternativeSlot } from '../logic/availability'
import { cn } from '@/lib/utils'

export function AlternativeSlotCard({
  slot,
  onPick,
}: {
  slot: AlternativeSlot
  onPick: () => void
}) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onPick}
      className={cn(
        'w-full text-left rounded-md px-3.5 py-3 flex items-center justify-between transition',
        slot.isBest
          ? 'border-2 border-[var(--color-brand)] bg-[var(--color-brand-soft)]'
          : 'border border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
      )}
    >
      <div>
        <div className={cn('text-xs', slot.isBest ? 'font-extrabold' : 'font-bold')}>
          {slot.date} · {slot.from} – {slot.to}
        </div>
        <div className="text-[10px] text-white/50">
          {slot.freeCourts} courts free{slot.isBest ? ` · ${t('steps.date.best')}` : ''}
        </div>
      </div>
      <div className="text-[var(--color-brand)] font-extrabold text-xs">{t('steps.date.chooseSlot')}</div>
    </button>
  )
}
