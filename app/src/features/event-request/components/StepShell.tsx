import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { BackgroundPaths } from '@/components/ui/background-paths'
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
    <div className="relative min-h-screen bg-[var(--color-bg-primary)] text-white overflow-hidden">
      {/* Muted paths background, consistent with Hero but quieter */}
      <BackgroundPaths intensity="muted" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md bg-[rgba(10,10,10,0.35)] border-b border-white/[0.06]">
          <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_10px_rgba(255,107,26,0.5)]" />
            UNION SPORT · EVENTS
          </div>
          <div className="flex items-center gap-4">
            <StepIndicator current={currentStep} />
            <LanguageToggle />
          </div>
        </header>

        {/* Main form area, vertically centered */}
        <motion.main
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 flex items-center justify-center px-6 md:px-10 py-8 md:py-12"
        >
          <div className="w-full max-w-[560px]">
            {/* Dark-Glass Card */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-[rgba(20,20,20,0.55)] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] p-6 md:p-8">
              {children}
            </div>

            {/* Footer nav BELOW the card, not inside */}
            {!hideNav && (
              <div className="flex justify-between mt-5 md:mt-6">
                <Button
                  variant="ghost_outline"
                  onClick={onBack}
                  disabled={!onBack}
                  className="px-5 py-2 text-[11px]"
                >
                  {t('nav.back')}
                </Button>
                <Button
                  variant="accent"
                  onClick={onNext}
                  disabled={nextDisabled || !onNext}
                  className="px-5 py-2 text-[11px] shadow-[0_0_0_0_rgba(255,107,26,0)] hover:shadow-[0_0_24px_-4px_rgba(255,107,26,0.6)] transition-shadow"
                >
                  {nextLabel ?? t('nav.next')}
                </Button>
              </div>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  )
}
