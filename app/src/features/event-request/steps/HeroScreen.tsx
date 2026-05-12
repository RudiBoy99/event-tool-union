import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LanguageToggle } from '../components/LanguageToggle'
import { NotificationBell } from '@/components/NotificationBell'

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HeroScreen() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reduceMotion) videoRef.current?.pause()
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const isDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches
    if (!isDesktop) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 18
      setParallax({ x, y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion])

  const handleCta = () => {
    if (reduceMotion) {
      nav('/request?step=1')
      return
    }
    setTransitioning(true)
    window.setTimeout(() => nav('/request?step=1'), 550)
  }

  const grainBg =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <motion.div
        className="absolute inset-0 z-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
        animate={transitioning ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
        transition={
          transitioning
            ? { duration: 0.6, ease: EASE_OUT_EXPO }
            : {
                opacity: { duration: 1.2, ease: EASE_OUT_EXPO },
                scale: { duration: 4, ease: EASE_OUT_EXPO },
              }
        }
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/union-padel-hype-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/union-padel-hype.webm" type="video/webm" />
          <source src="/videos/union-padel-hype.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[2] mix-blend-overlay"
        style={{ opacity: 0.07, backgroundImage: grainBg }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 md:px-10 md:py-5 transition-[backdrop-filter,background-color] duration-300 ${
          scrolled ? 'backdrop-blur-md bg-black/30' : ''
        }`}
      >
        <img
          src="/logos/UnionSport_negativ-auf-Schwarz_RGB.png"
          alt="Union Sport"
          className="h-7 md:h-8 w-auto"
        />
        <div className="flex items-center gap-2 md:gap-3">
          <NotificationBell theme="dark" />
          <LanguageToggle />
        </div>
      </header>

      {/* Eyebrow — bottom-left, aligned vertically with "PLANEN" word inside the right CTA */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT_EXPO }}
        className="absolute z-20 text-[var(--color-brand)] text-[10px] md:text-[11px] font-bold uppercase whitespace-nowrap"
        style={{
          left: 'clamp(24px, 4vw, 48px)',
          bottom: 'clamp(28px, 4vw, 56px)',
          letterSpacing: '0.22em',
          fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
        }}
      >
        {t('hero.eyebrow')}
      </motion.div>

      <main className="relative z-20 flex min-h-screen items-center px-6 md:px-12 lg:px-20 pt-24 pb-44 md:pb-56">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
          className="font-black uppercase max-w-[820px]"
          style={{
            fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
            fontSize: 'clamp(40px, 9vw, 128px)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
          }}
        >
          {t('hero.title1')}{' '}
          <span style={{ color: 'var(--color-brand)' }}>{t('hero.titleAccent')}</span>
          <br />
          {t('hero.title2')}{' '}
          <span style={{ color: 'var(--color-brand)' }}>{t('hero.titleUnderline')}</span>
        </motion.h1>
      </main>

      {/* CTA — Union quarter-circle, bottom-right; contains subtitle + CTA */}
      <div
        className="absolute bottom-0 right-0 z-20"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.button
          type="button"
          onClick={handleCta}
          aria-label={t('hero.ctaPrimary')}
          className="group relative block cursor-pointer border-0 p-0 transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            width: 'min(36vw, 460px)',
            height: 'min(36vw, 460px)',
            background: 'var(--color-brand)',
            borderRadius: '100% 0 0 0',
            transformOrigin: 'bottom right',
          }}
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.7 }}
        >
          <span
            className="absolute right-7 bottom-6 md:right-12 md:bottom-10 flex flex-col items-end gap-4 md:gap-5 text-black pointer-events-none text-right"
            style={{
              fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
            }}
          >
            {/* Subtitle — inside the quarter-circle, restrained width to clear the curve */}
            <span
              className="text-[11px] md:text-[13px] leading-[1.45] font-medium normal-case text-black/85 max-w-[200px] md:max-w-[280px]"
              style={{ letterSpacing: '0.01em', fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {t('hero.subtitle')}
            </span>

            {/* CTA word stack — large */}
            <span
              className="leading-[0.92] font-black uppercase"
              style={{
                fontSize: 'clamp(28px, 5.5vw, 64px)',
                letterSpacing: '0.04em',
              }}
            >
              {t('hero.ctaPrimary').replace(' →', '').split(' ').map((w, i) => (
                <span key={i} className="block">{w}</span>
              ))}
            </span>

            {/* Arrow */}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 leading-none"
              style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}
            >
              →
            </span>
          </span>
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-brand)] z-10" />

      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="curtain"
            className="fixed inset-0 z-50 pointer-events-none bg-black"
            initial={{ clipPath: 'circle(0% at 100% 100%)' }}
            animate={{ clipPath: 'circle(150% at 100% 100%)' }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
