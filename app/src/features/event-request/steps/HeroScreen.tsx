import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { LanguageToggle } from '../components/LanguageToggle'

function AnimatedTitle({ parts }: { parts: { text: string; accent?: boolean }[] }) {
  let letterIndex = 0
  return (
    <h1 className="display-xl text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
      {parts.map((part, partIndex) => (
        <span key={partIndex} className={part.accent ? 'text-[var(--color-brand)]' : ''}>
          {part.text.split('').map((letter) => {
            const i = letterIndex++
            return (
              <motion.span
                key={`${partIndex}-${i}`}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.025,
                  type: 'spring',
                  stiffness: 160,
                  damping: 22,
                }}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            )
          })}
          {partIndex < parts.length - 1 && ' '}
        </span>
      ))}
    </h1>
  )
}

export function HeroScreen() {
  const { t } = useTranslation()
  const nav = useNavigate()

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-bg-primary)]">
      <BackgroundPaths intensity="full" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-sm bg-[rgba(10,10,10,0.2)] border-b border-white/[0.06]">
        <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_12px_rgba(255,107,26,0.6)]" />
          UNION SPORT · EVENTS
        </div>
        <LanguageToggle />
      </header>

      {/* Hero content, centered */}
      <main className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[10px] md:text-[11px] tracking-[0.3em] text-[var(--color-brand)] font-bold mb-5"
        >
          ★ {t('hero.eyebrow')}
        </motion.div>

        <AnimatedTitle
          parts={[
            { text: t('hero.title1') },
            { text: t('hero.titleAccent'), accent: true },
            { text: t('hero.title2') },
            { text: t('hero.titleUnderline'), accent: true },
          ]}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-sm md:text-base text-white/65 max-w-xl mt-6 md:mt-8 mb-8 md:mb-10"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          {/* Glass CTA with gradient border */}
          <div className="group relative inline-block p-[1px] rounded-xl bg-gradient-to-b from-white/20 to-black/20 backdrop-blur-lg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_40px_-10px_rgba(255,107,26,0.4)] transition-shadow">
            <button
              onClick={() => nav('/request?step=1')}
              className="rounded-[11px] px-6 md:px-8 py-3 md:py-3.5 text-sm font-extrabold tracking-[0.08em] uppercase bg-black/90 group-hover:bg-black text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-white/10 flex items-center gap-3"
            >
              <span className="text-[var(--color-brand)]">{t('hero.ctaPrimary').replace(' →', '')}</span>
              <span className="text-[var(--color-brand)] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
            </button>
          </div>

          <button className="px-6 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase border border-white/15 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors">
            {t('hero.ctaSecondary')}
          </button>
        </motion.div>

        {/* Stats row, refined small */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap gap-6 md:gap-10 mt-12 md:mt-16 justify-center text-center"
        >
          {[
            { v: '3', l: t('hero.stats.locations') },
            { v: '5', l: t('hero.stats.sports') },
            { v: '60–100', l: t('hero.stats.people') },
            { v: '24h', l: t('hero.stats.response') },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-xl md:text-2xl font-black text-[var(--color-brand)] leading-none">{s.v}</div>
              <div className="label-caps mt-1.5 text-[9px] md:text-[10px]">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
