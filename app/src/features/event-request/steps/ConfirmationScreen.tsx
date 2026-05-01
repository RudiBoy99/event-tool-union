import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export function ConfirmationScreen({ onNew: _onNew }: { onNew: () => void }) {
  const { t } = useTranslation()
  const ref = useMemo(() => `ES-2026-${String(Math.floor(1000 + Math.random() * 9000))}`, [])

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--color-sand)', color: '#000000' }}
    >
      {/* Giant brand quarter-circle anchored bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: '100% 0 0 0',
          background: 'var(--color-brand)',
          zIndex: 0,
          transition: 'background 400ms ease',
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-2.5">
          <img src="/logos/UnionSport_RGB.png" alt="Union Sport" className="h-7 md:h-8 w-auto" />
        </div>
      </header>

      {/* Confirmation content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-xl">
          {/* Big DANKE headline */}
          <h1
            className="display-xl text-[80px] md:text-[120px] leading-none mb-6 text-black"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
          >
            {t('steps.confirmation.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-black/70 text-base mb-6 max-w-md">
            {t('steps.confirmation.subtitle')}
          </p>

          {/* Reference number */}
          <div className="mb-10">
            <div className="label-caps-dark text-black/40 mb-1">
              {t('steps.confirmation.refLabel')}
            </div>
            <div className="font-mono text-sm tracking-[0.2em] text-black/70 uppercase">
              {ref}
            </div>
          </div>

          {/* Action button */}
          <div>
            <button
              onClick={() => window.location.assign('/')}
              className="px-7 py-3 text-[11px] font-black uppercase tracking-[0.08em] hover:brightness-110 active:scale-[0.97] transition-all"
              style={{
                fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                background: 'var(--color-brand)',
                color: '#000000',
              }}
            >
              {t('steps.confirmation.ctaHome')}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
