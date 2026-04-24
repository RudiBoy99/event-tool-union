import { motion, AnimatePresence } from 'framer-motion'
import { type ReactNode } from 'react'
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
  surface?: 'black' | 'sand'
}

export function StepShell({
  currentStep,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  hideNav,
  surface = 'black',
}: Props) {
  const { t } = useTranslation()
  const isSand = surface === 'sand'

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: isSand ? 'var(--color-sand)' : '#000000',
        color: isSand ? '#000000' : '#ffffff',
        transition: 'background 400ms ease, color 400ms ease',
      }}
    >
      {/* Decorative background quarter-circle — atmospheric, low opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0"
        style={{
          width: '38vw',
          height: '38vw',
          maxWidth: 420,
          maxHeight: 420,
          borderRadius: '100% 0 0 0',
          background: 'var(--color-brand)',
          opacity: isSand ? 0.22 : 0.13,
          transition: 'opacity 400ms ease, background 400ms ease',
          zIndex: 0,
        }}
      />

      {/* Header — sticky */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4 flex-shrink-0"
        style={{
          borderBottom: isSand ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Ball icon: quarter-circle-in-square */}
          <div className="relative w-5 h-5 flex-shrink-0">
            <div
              className="w-5 h-5"
              style={{ background: 'var(--color-brand)', transition: 'background 400ms ease' }}
            />
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5"
              style={{
                background: isSand ? 'var(--color-sand)' : '#000000',
                borderRadius: '100% 0 0 0',
                transition: 'background 400ms ease',
              }}
            />
          </div>
          <span
            className="font-black text-[11px] tracking-[0.15em] uppercase"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', color: isSand ? '#000' : '#fff' }}
          >
            UNION SPORT · EVENTS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <StepIndicator current={currentStep} />
          <LanguageToggle />
        </div>
      </header>

      {/* Main content — vertically centered, flush-left */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 py-8 md:py-12"
        >
          <div className="w-full max-w-[600px]">
            {children}

            {/* Footer nav */}
            {!hideNav && (
              <div className="flex justify-between mt-8 md:mt-10">
                <button
                  onClick={onBack}
                  disabled={!onBack}
                  className="px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors disabled:opacity-30"
                  style={{
                    border: isSand ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.18)',
                    color: isSand ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                    background: 'transparent',
                  }}
                >
                  {t('nav.back')}
                </button>
                <button
                  onClick={onNext}
                  disabled={nextDisabled || !onNext}
                  className="px-7 py-2.5 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-200 disabled:opacity-30 hover:brightness-110"
                  style={{
                    fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                    background: isSand ? '#000000' : 'var(--color-brand)',
                    color: isSand ? '#ffffff' : '#000000',
                    transition: 'background 400ms ease',
                  }}
                >
                  {nextLabel ?? t('nav.next')} →
                </button>
              </div>
            )}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
