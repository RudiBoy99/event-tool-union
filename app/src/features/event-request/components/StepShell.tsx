import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { StepIndicator } from './StepIndicator'
import { LanguageToggle } from './LanguageToggle'

interface Props {
  currentStep: number
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  hideNav?: boolean
}

export function StepShell({ currentStep, children, onBack, onNext, nextDisabled, nextLabel, hideNav }: Props) {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)]" />
          UNION SPORT · EVENTS
        </div>
        <div className="flex items-center gap-4">
          <StepIndicator current={currentStep} />
          <LanguageToggle />
        </div>
      </header>
      <motion.main
        key={currentStep}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 max-w-[720px] w-full mx-auto px-6 md:px-10 py-10"
      >
        {children}
      </motion.main>
      {!hideNav && (
        <footer className="max-w-[720px] w-full mx-auto px-6 md:px-10 py-6 flex justify-between">
          <Button variant="ghost_outline" onClick={onBack} disabled={!onBack}>
            {t('nav.back')}
          </Button>
          <Button variant="accent" onClick={onNext} disabled={nextDisabled || !onNext}>
            {nextLabel ?? t('nav.next')}
          </Button>
        </footer>
      )}
    </div>
  )
}
