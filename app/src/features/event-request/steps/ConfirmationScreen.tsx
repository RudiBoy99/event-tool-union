import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { StepShell } from '../components/StepShell'
import { Button } from '@/components/ui/button'

export function ConfirmationScreen({ onNew }: { onNew: () => void }) {
  const { t } = useTranslation()
  const ref = useMemo(() => `ES-2026-${String(Math.floor(1000 + Math.random() * 9000))}`, [])

  return (
    <StepShell currentStep={7} hideNav>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-black text-4xl font-black">
          ✓
        </div>
        <h1 className="display-xl text-5xl md:text-6xl">{t('steps.confirmation.title')}</h1>
        <p className="text-white/70 max-w-md">{t('steps.confirmation.subtitle', { ref })}</p>
        <div className="flex gap-3 mt-4">
          <Button variant="ghost_outline" onClick={() => window.location.assign('/')}>
            {t('steps.confirmation.ctaHome')}
          </Button>
          <Button variant="accent" onClick={onNew}>{t('steps.confirmation.ctaNew')}</Button>
        </div>
      </div>
    </StepShell>
  )
}
