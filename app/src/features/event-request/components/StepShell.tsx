import { motion, AnimatePresence } from 'framer-motion'
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { StepIndicator } from './StepIndicator'
import { LanguageToggle } from './LanguageToggle'
import { NotificationBell } from '@/components/NotificationBell'
import { Slideshow } from './Slideshow'
import { getMediaForContext, NEON_STORY_VIDEO } from '../data/images'
import type { EventRequestData } from '../schema'

const STATIC_BG_IMAGE = '/images/union-padel-01.jpg'

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
  /**
   * Use a subtle static background image instead of the rotating slideshow.
   * Set on info-style steps (Contact, EventType, Review) where animated video
   * behind the form would distract.
   */
  legacyImage?: boolean
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
  legacyImage = false,
}: Props) {
  const { t } = useTranslation()
  const isSand = surface === 'sand'
  const { watch } = useFormContext<EventRequestData>()
  const sports = watch('sports')
  const eventType = watch('eventType')
  const isNeonStory = !isSand && eventType === 'neon_padel'
  const slideshowMedia = getMediaForContext({ sports, eventType })

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: isSand ? 'var(--color-sand)' : '#000000',
        color: isSand ? '#000000' : '#ffffff',
        transition: 'background 400ms ease, color 400ms ease',
      }}
    >
      {/* ───── BACKGROUND LAYERS ───── */}
      {isNeonStory ? (
        <NeonStoryBackground />
      ) : (
        <>
          {!isSand && legacyImage && (
            <img
              src={STATIC_BG_IMAGE}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              style={{ filter: 'brightness(0.8) saturate(0.95)' }}
            />
          )}
          {!isSand && !legacyImage && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Slideshow
                items={slideshowMedia}
                intervalMs={3000}
                fadeMs={1000}
                kenBurns
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>
          )}

          {/* z-[1] — Dark left-side gradient: form-side opaque, right-side video clear */}
          {!isSand && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-[1] pointer-events-none hidden lg:block"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 75%, transparent 100%)',
              }}
            />
          )}
          {!isSand && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
              style={{ background: 'rgba(0,0,0,0.78)' }}
            />
          )}

          {/* z-[2] — Subtle Union brand quarter-circle accent (bottom-right) */}
          {!isSand && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 z-[2]"
              style={{
                width: 'min(34vw, 260px)',
                height: 'min(34vw, 260px)',
                borderRadius: '100% 0 0 0',
                background: 'var(--color-brand)',
                opacity: 0.35,
                transition: 'background 400ms ease',
              }}
            />
          )}
        </>
      )}

      {/* Sand-surface atmospheric quarter-circle */}
      {isSand && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 right-0 z-0"
          style={{
            width: '38vw',
            height: '38vw',
            maxWidth: 420,
            maxHeight: 420,
            borderRadius: '100% 0 0 0',
            background: 'var(--color-brand)',
            opacity: 0.22,
            transition: 'opacity 400ms ease, background 400ms ease',
          }}
        />
      )}

      {/* z-20 — Header (above form area z-10 so NotificationBell dropdown stays on top) */}
      <header
        className="relative z-20 flex items-center justify-between px-6 md:px-10 py-4 flex-shrink-0"
        style={{
          borderBottom: isSand ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={isSand ? '/logos/UnionSport_RGB.png' : '/logos/UnionSport_negativ-auf-Schwarz_RGB.png'}
            alt="Union Sport"
            className="h-7 md:h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <StepIndicator current={currentStep} />
          <NotificationBell theme={isSand ? 'light' : 'dark'} />
          <LanguageToggle />
        </div>
      </header>

      {/* z-10 — Form content. Form sits on the left; PhoneFrame (neon story) sits on the right. */}
      <div className="relative z-10 flex-1 flex min-h-0">
        <AnimatePresence mode="wait">
          <motion.main
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col justify-center px-6 md:px-10 lg:pl-12 xl:pl-20 py-8 md:py-12 w-full lg:max-w-[55%]"
          >
            <div className="w-full max-w-[560px]">
              {children}

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

        {/* Phone-frame on the right edge (Neon Story Mode only, desktop only) */}
        {isNeonStory && <PhoneFrame />}
      </div>
    </div>
  )
}

/**
 * Story Mode background — the same vertical clip massively blurred & tinted,
 * scaled up to fill the viewport. Gives a UV-haze atmosphere without competing
 * with the sharp phone-frame video on the right.
 */
function NeonStoryBackground() {
  return (
    <>
      <video
        src={NEON_STORY_VIDEO.src}
        poster={NEON_STORY_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          filter: 'blur(56px) brightness(0.45) saturate(1.5)',
          transform: 'scale(1.25)',
        }}
      />
      {/* UV-violet/pink tint vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 25% 50%, rgba(120,30,200,0.32) 0%, rgba(0,0,0,0.75) 70%)',
        }}
      />
      {/* Left-side form gradient (keeps text readable over the blurred video) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 65%, transparent 100%)',
        }}
      />
      {/* Mobile dim for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
        style={{ background: 'rgba(0,0,0,0.7)' }}
      />
    </>
  )
}

/**
 * iPhone-style frame with the IG-Story clip looping inside.
 * Pinned to the right edge of the form area on lg+, vertically centered.
 * Includes notch + animated story progress bars to lean into the Story aesthetic.
 */
function PhoneFrame() {
  const storySeconds = (NEON_STORY_VIDEO.durationMs ?? 12500) / 1000
  return (
    <div
      className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-24 xl:right-[16rem] 2xl:right-[28rem] z-[5] hidden lg:block"
      style={{
        filter: 'drop-shadow(0 0 80px rgba(255,30,180,0.35)) drop-shadow(0 24px 48px rgba(0,0,0,0.6))',
      }}
    >
      {/* Outer phone bezel */}
      <div
        className="relative bg-[#0c0c0e]"
        style={{
          width: 'min(32vw, 380px)',
          aspectRatio: '9 / 19.5',
          borderRadius: '48px',
          padding: '8px',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 2px rgba(255,255,255,0.025)',
        }}
      >
        {/* Inner screen */}
        <div
          className="relative w-full h-full overflow-hidden bg-black"
          style={{ borderRadius: '40px' }}
        >
          {/* Looping vertical story. The burned-in username/timer at the top
              of the source clip is masked by the gradient + IG-header below. */}
          <video
            src={NEON_STORY_VIDEO.src}
            poster={NEON_STORY_VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top mask — provides a subtle backdrop for the integrated IG-link
              header. The burned-in bake-in is already cropped at the source. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-[5] pointer-events-none"
            style={{
              height: '14%',
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            }}
          />

          {/* Story progress bars (top) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex gap-1 z-10">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-[2.5px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.28)' }}
              >
                <div
                  className="h-full rounded-full neon-story-bar"
                  style={{
                    background: '#ffffff',
                    animationDuration: `${storySeconds}s`,
                    animationDelay: `${i * (storySeconds / 4)}s`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Notch */}
          <div
            className="absolute top-[8px] left-1/2 -translate-x-1/2 z-20"
            style={{
              width: '88px',
              height: '22px',
              background: '#000',
              borderRadius: '14px',
            }}
          />

          {/* Integrated Instagram link header — replaces the IG-Story bake-in.
              Mimics the real IG Stories header (avatar + handle, top-left). */}
          <a
            href="https://www.instagram.com/union.padel.basel/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Union Padel Basel auf Instagram öffnen"
            className="ig-header pointer-events-auto absolute z-[12] flex items-center gap-2.5 group"
            style={{
              left: 12,
              top: 38,
              padding: '5px 11px 5px 5px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.32)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.10)',
              transition: 'background 180ms ease, border-color 180ms ease, transform 180ms ease',
            }}
          >
            {/* Instagram-gradient avatar */}
            <span
              aria-hidden="true"
              className="grid place-items-center text-white shrink-0 group-hover:scale-110 transition-transform"
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background:
                  'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                boxShadow: '0 2px 8px rgba(220,39,67,0.45)',
              }}
            >
              <InstagramGlyph small />
            </span>
            <span
              className="text-[11px] font-bold text-white tracking-wide leading-tight"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              @union.padel.basel
            </span>
          </a>

          {/* Subtle inner highlight for screen depth */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[6] pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.45)',
              borderRadius: '40px',
            }}
          />
        </div>
      </div>

      {/* Local keyframes for the story-bar fill */}
      <style>{`
        @keyframes neonStoryBar {
          0%   { width: 0%;   opacity: 1; }
          22%  { width: 100%; opacity: 1; }
          24%  { opacity: 0.5; }
          100% { width: 100%; opacity: 0.5; }
        }
        .neon-story-bar {
          width: 0%;
          animation-name: neonStoryBar;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .ig-header:hover {
          background: rgba(0,0,0,0.55) !important;
          border-color: rgba(255,255,255,0.22) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}

/** Minimal Instagram glyph — lucide v1.8 doesn't ship the Instagram icon, so we inline it. */
function InstagramGlyph({ small = false }: { small?: boolean }) {
  const size = small ? 14 : 16
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
