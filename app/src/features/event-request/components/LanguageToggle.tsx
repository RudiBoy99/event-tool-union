import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const active = i18n.language.startsWith('en') ? 'en' : 'de'

  return (
    <div className="flex items-center gap-0">
      {(['de', 'en'] as const).map((lang, idx) => (
        <>
          {idx > 0 && (
            <span key={`sep-${lang}`} className="opacity-20 mx-1.5 text-[10px]">|</span>
          )}
          <button
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            className="text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors pb-0.5"
            style={{
              opacity: active === lang ? 1 : 0.4,
              borderBottom: active === lang ? '1px solid currentColor' : '1px solid transparent',
            }}
          >
            {lang.toUpperCase()}
          </button>
        </>
      ))}
    </div>
  )
}
