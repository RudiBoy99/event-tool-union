import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LanguageToggle } from '../components/LanguageToggle'

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
        <LanguageToggle />
      </header>

      <div
        className="absolute bottom-0 right-0 pointer-events-none z-10"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.div
          aria-hidden
          style={{
            width: 'min(22vw, 320px)',
            height: 'min(22vw, 320px)',
            background: 'var(--color-brand)',
            borderRadius: '100% 0 0 0',
            transformOrigin: 'bottom right',
          }}
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.9 }}
        />
      </div>

      <main className="relative z-20 flex min-h-screen items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-[720px] flex flex-col gap-6 md:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
            className="text-[var(--color-brand)] text-[11px] md:text-xs font-bold uppercase"
            style={{
              letterSpacing: '0.22em',
              fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
            }}
          >
            {t('hero.eyebrow')}
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="font-black uppercase"
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

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT_EXPO }}
            className="text-white/85 text-base md:text-lg max-w-md leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: EASE_OUT_EXPO }}
            className="mt-2"
          >
            <button
              onClick={handleCta}
              className="group inline-flex items-center gap-4 bg-[var(--color-brand)] px-10 py-5 text-black font-black text-sm uppercase transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black w-full sm:w-auto justify-center sm:justify-start"
              style={{
                fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                letterSpacing: '0.08em',
              }}
            >
              <span>{t('hero.ctaPrimary').replace(' →', '')}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </div>
      </main>

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
