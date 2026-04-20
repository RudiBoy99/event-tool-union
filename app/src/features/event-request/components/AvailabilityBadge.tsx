import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { AvailabilityResult } from '../logic/availability'

export function AvailabilityBadge({ result, sportLabel }: { result: AvailabilityResult; sportLabel: string }) {
  const { t } = useTranslation()
  const color =
    result.status === 'ok'
      ? 'rgba(34,197,94,1)'
      : result.status === 'tight'
      ? 'rgba(251,146,60,1)'
      : 'rgba(239,68,68,1)'
  const title =
    result.status === 'ok' ? t('steps.date.available') : result.status === 'tight' ? t('steps.date.tight') : t('steps.date.full')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-md p-4 flex gap-3 items-start"
      style={{ background: `${color.replace('1)', '0.1)')}`, border: `1px solid ${color.replace('1)', '0.3)')}` }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-black flex-shrink-0"
        style={{ background: color }}
      >
        {result.status === 'ok' ? '✓' : '!'}
      </div>
      <div>
        <div className="text-sm font-bold" style={{ color }}>{title}</div>
        <div className="text-xs text-white/60 mt-0.5">
          {result.status === 'ok' && (
            <>Free: <strong>{result.free}</strong> {sportLabel} courts</>
          )}
          {result.status !== 'ok' && (
            <>Free: <strong>{result.free}</strong></>
          )}
        </div>
      </div>
    </motion.div>
  )
}
