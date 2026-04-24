import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export function ConfirmationScreen({ onNew }: { onNew: () => void }) {
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
          {/* Logo above headline */}
          <img src="/logos/UnionSport_RGB.png" alt="Union Sport" className="h-12 md:h-16 w-auto mb-8" />

          {/* Big DANKE headline */}
          <h1
            className="display-xl text-[80px] md:text-[120px] leading-none mb-6 text-black"
            style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
          >
            {t('steps.confirmation.title')}
          </h1>

          {/* Subtitle with reference */}
          <p className="text-black/70 text-base mb-2 max-w-md">
            {t('steps.confirmation.subtitle', { ref })}
          </p>

          {/* Monospace reference number */}
          <div
            className="font-mono text-xs tracking-[0.2em] text-black/40 mb-10 uppercase"
          >
            {ref}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.assign('/')}
              className="px-7 py-3 text-[11px] font-black uppercase tracking-[0.08em] border-2 border-black text-black hover:bg-black hover:text-white transition-all"
              style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
            >
              {t('steps.confirmation.ctaHome')}
            </button>
            <button
              onClick={onNew}
              className="px-7 py-3 text-[11px] font-black uppercase tracking-[0.08em] hover:brightness-110 transition-all"
              style={{
                fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                background: 'var(--color-brand)',
                color: '#000000',
                transition: 'background 400ms ease, filter 200ms ease',
              }}
            >
              {t('steps.confirmation.ctaNew')}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
