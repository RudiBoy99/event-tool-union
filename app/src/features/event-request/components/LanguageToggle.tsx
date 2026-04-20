import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const active = i18n.language.startsWith('en') ? 'en' : 'de'
  const btn = (lang: 'de' | 'en') =>
    cn(
      'px-3 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full border transition',
      active === lang
        ? 'bg-[var(--color-accent)] text-black border-transparent'
        : 'border-white/20 text-white/70 hover:text-white',
    )
  return (
    <div className="flex gap-2">
      <button className={btn('de')} onClick={() => i18n.changeLanguage('de')}>DE</button>
      <button className={btn('en')} onClick={() => i18n.changeLanguage('en')}>EN</button>
    </div>
  )
}
