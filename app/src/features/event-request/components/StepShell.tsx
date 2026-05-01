import { motion, AnimatePresence } from 'framer-motion'
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StepIndicator } from './StepIndicator'
import { LanguageToggle } from './LanguageToggle'
import { HalftoneImage } from '@/components/ui/halftone-image'

const WIZARD_IMG = '/images/union-padel-01.jpg'

interface Props {
  currentStep: number
  children: ReactNode
  onBack: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  nextPending?: boolean
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
  nextPending,
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
          <img
            src={isSand ? '/logos/UnionSport_RGB.png' : '/logos/UnionSport_negativ-auf-Schwarz_RGB.png'}
            alt="Union Sport"
            className="h-7 md:h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <StepIndicator current={currentStep} />
          <LanguageToggle />
        </div>
      </header>

      {/* 2-column layout on desktop: form left, halftone image right */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-0">
        {/* Left: form content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col justify-center px-6 md:px-10 lg:pl-12 xl:pl-20 py-8 md:py-12"
          >
            <div className="w-full max-w-[560px]">
              {children}

              {/* Footer nav */}
              {!hideNav && (
                <div className="flex justify-between mt-8 md:mt-10">
                  <button
                    onClick={onBack}
                    className="px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors"
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
                    disabled={nextDisabled || nextPending || !onNext}
                    className="relative inline-flex items-center justify-center gap-2 px-7 py-2.5 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-200 disabled:opacity-30 hover:brightness-110 active:scale-[0.97] active:brightness-95"
                    style={{
                      fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                      background: isSand ? '#000000' : 'var(--color-brand)',
                      color: isSand ? '#ffffff' : '#000000',
                    }}
                  >
                    {nextPending && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-3.5 h-3.5 rounded-full animate-spin"
                        style={{
                          border: `2px solid ${isSand ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'}`,
                          borderTopColor: 'transparent',
                        }}
                      />
                    )}
                    <span>
                      {nextPending ? t('nav.submitting') : (nextLabel ?? t('nav.next'))}
                    </span>
                    {!nextPending && <span aria-hidden="true">→</span>}
                  </button>
                </div>
              )}
            </div>
          </motion.main>
        </AnimatePresence>

        {/* Right: halftone image in quarter-circle — only on dark surfaces + desktop */}
        {!isSand && (
          <div className="hidden lg:flex items-center justify-center p-8 xl:p-12 relative">
            <div
              className="relative overflow-hidden bg-black"
              style={{
                width: 'min(42vw, 520px)',
                height: 'min(42vw, 520px)',
                borderRadius: '100% 0 0 0',
              }}
            >
              <HalftoneImage
                src={WIZARD_IMG}
                grade={2}
                className="absolute inset-0 w-full h-full"
              />
              {/* Small brand square bottom-right inside quarter-circle */}
              <div
                className="absolute bottom-0 right-0"
                style={{
                  width: '18%',
                  height: '18%',
                  background: 'var(--color-brand)',
                  transition: 'background 400ms ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
