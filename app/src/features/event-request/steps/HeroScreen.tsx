import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LanguageToggle } from '../components/LanguageToggle'
import { QuarterCircle } from '@/components/ui/quarter-circle'
import { HalftoneImage } from '@/components/ui/halftone-image'

const PADEL_IMG = '/images/union-padel-01.jpg'
const SPORT_IMG = '/images/union-padel-01.jpg'

export function HeroScreen() {
  const { t } = useTranslation()
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Brand dot — the quarter-circle-in-square ball icon */}
          <div className="relative w-5 h-5 flex-shrink-0">
            <div className="w-5 h-5 bg-[var(--color-brand)]" />
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black"
              style={{ borderRadius: '100% 0 0 0' }}
            />
          </div>
          <span className="font-black text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}>
            UNION SPORT · EVENTS
          </span>
        </div>
        <LanguageToggle />
      </header>

      {/* Main hero area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        {/* Left column: editorial content */}
        <div className="flex flex-col justify-center px-6 md:px-10 py-10 md:py-16 relative">
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="label-caps text-[var(--color-brand)] mb-6"
          >
            {t('hero.eyebrow')}
          </motion.div>

          {/* Main headline — Archivo Black, flush left, uppercase */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="display-xl text-4xl sm:text-5xl md:text-6xl mb-8 max-w-lg"
          >
            {t('hero.title1')}{' '}
            <span className="text-[var(--color-brand)]">{t('hero.titleAccent')}</span>{' '}
            {t('hero.title2')}{' '}
            <span className="text-[var(--color-brand)]">{t('hero.titleUnderline')}</span>
          </motion.h1>

          {/* 2×2 brand grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-2 mb-10 w-fit"
          >
            {/* Cell 1: Orange solid with black brand name */}
            <div
              className="w-24 h-24 md:w-32 md:h-32 bg-[var(--color-brand)] flex items-end p-2"
            >
              <span
                className="text-black font-black text-[8px] leading-tight uppercase tracking-tight"
                style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
              >
                UNION<br />SPORT
              </span>
            </div>
            {/* Cell 2: Halftone padel image clipped to quarter-circle */}
            <div className="w-24 h-24 md:w-32 md:h-32 relative overflow-hidden bg-[#111]">
              <HalftoneImage src={PADEL_IMG} grade={2} className="absolute inset-0 w-full h-full" />
              {/* Quarter-circle overlay mask — top-right orientation */}
              <div
                className="absolute inset-0 bg-black"
                style={{ borderRadius: '0 0 0 100%' }}
              />
            </div>
            {/* Cell 3: Black with sand quarter-circle bottom-right */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black relative overflow-hidden border border-white/[0.08]">
              <QuarterCircle
                size="100%"
                color="var(--color-sand)"
                rotation={180}
                className="absolute inset-0"
              />
            </div>
            {/* Cell 4: Sand with small orange quarter-circle */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[var(--color-sand)] relative overflow-hidden flex items-center justify-center">
              <QuarterCircle
                size="60%"
                color="var(--color-brand)"
                rotation={270}
              />
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-6 text-left mb-10"
          >
            {[
              { v: '3', l: t('hero.stats.locations') },
              { v: '5', l: t('hero.stats.sports') },
              { v: '24h', l: t('hero.stats.response') },
            ].map((s, i) => (
              <div key={i}>
                <div
                  className="text-2xl font-black text-[var(--color-brand)] leading-none"
                  style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                >
                  {s.v}
                </div>
                <div className="label-caps mt-1.5">{s.l}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA button — flat solid, no glass */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => nav('/request?step=1')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-brand)] text-black font-black text-sm uppercase tracking-[0.08em] hover:brightness-110 transition-all duration-200"
              style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
            >
              {t('hero.ctaPrimary').replace(' →', '')}
              <span className="opacity-80">→</span>
            </button>
          </motion.div>
        </div>

        {/* Right column: large halftone image in quarter-circle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:flex items-center justify-center p-10 relative"
        >
          {/* Large quarter-circle image, anchored bottom-right */}
          <div
            className="relative overflow-hidden bg-[#111]"
            style={{
              width: 'min(55vw, 520px)',
              height: 'min(55vw, 520px)',
              borderRadius: '100% 0 0 0',
            }}
          >
            <HalftoneImage
              src={SPORT_IMG}
              grade={2}
              className="absolute inset-0 w-full h-full"
            />
            {/* Orange accent corner */}
            <div
              className="absolute bottom-0 right-0 bg-[var(--color-brand)]"
              style={{ width: '20%', height: '20%' }}
            />
          </div>

          {/* Decorative quarter-circle behind */}
          <div
            className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: '35vw',
              height: '35vw',
              maxWidth: '380px',
              maxHeight: '380px',
              borderRadius: '100% 0 0 0',
              background: 'var(--color-brand)',
              opacity: 0.12,
            }}
          />
        </motion.div>
      </main>

      {/* Bottom accent line */}
      <div className="h-1 bg-[var(--color-brand)] flex-shrink-0" />
    </div>
  )
}
