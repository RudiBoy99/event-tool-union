import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '../components/LanguageToggle'

export function HeroScreen() {
  const { t } = useTranslation()
  const nav = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute -top-[30%] -right-[5%] w-[60%] h-[140%] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF6B1A 0%, transparent 60%)', opacity: 0.35 }}
      />
      <div
        className="absolute -top-[120px] -right-[120px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: '#FF6B1A', opacity: 0.08 }}
      />

      <header className="relative flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)]" />
          UNION SPORT · EVENTS
        </div>
        <LanguageToggle />
      </header>

      <main className="relative max-w-[1200px] mx-auto px-6 md:px-12 pt-10 pb-20 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[var(--color-accent)] font-bold mb-5">
            ★ {t('hero.eyebrow')}
          </div>
          <h1 className="display-xl text-6xl md:text-8xl mb-5">
            {t('hero.title1')} <span className="text-[var(--color-accent)]">{t('hero.titleAccent')}</span><br />
            {t('hero.title2')}{' '}
            <span className="underline decoration-[var(--color-accent)] decoration-[5px] underline-offset-[10px]">
              {t('hero.titleUnderline')}
            </span>
          </h1>
          <p className="text-sm md:text-base text-white/65 max-w-lg mb-8">{t('hero.subtitle')}</p>
          <div className="flex gap-3">
            <Button variant="accent" size="lg" onClick={() => nav('/request?step=1')}>
              {t('hero.ctaPrimary')}
            </Button>
            <Button variant="ghost_outline" size="lg">{t('hero.ctaSecondary')}</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat value="3" label={t('hero.stats.locations')} />
          <Stat value="5" label={t('hero.stats.sports')} />
          <Stat value="60–100" label={t('hero.stats.people')} />
          <Stat value="24h" label={t('hero.stats.response')} />
        </div>
      </main>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-md p-5">
      <div className="text-3xl md:text-4xl font-black text-[var(--color-accent)]">{value}</div>
      <div className="label-caps mt-1">{label}</div>
    </div>
  )
}
