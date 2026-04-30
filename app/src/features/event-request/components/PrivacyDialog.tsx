import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onClose: () => void
}

const SECTION_KEYS = [
  'responsible',
  'data',
  'purpose',
  'legal',
  'retention',
  'sharing',
  'cookies',
  'rights',
  'contact',
  'updated',
] as const

export function PrivacyDialog({ open, onClose }: Props) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  const lang = i18n.language?.startsWith('en') ? 'en' : 'de'
  const printHref = `/datenschutz.html?lang=${lang}&print=1`

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="privacy-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-dialog-title"
        >
          <motion.div
            key="privacy-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative flex flex-col w-full max-w-3xl max-h-[90vh] overflow-hidden"
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brand accent strip */}
            <div
              aria-hidden="true"
              style={{ height: 4, background: 'var(--color-brand)' }}
            />

            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 px-6 md:px-8 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h2
                id="privacy-dialog-title"
                className="text-xl md:text-2xl"
                style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
              >
                {t('steps.contact.privacy.title')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('steps.contact.privacy.close')}
                className="text-white/60 hover:text-white transition-colors text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
              {SECTION_KEYS.map((key) => (
                <section key={key}>
                  <h3
                    className="text-[11px] tracking-[0.15em] uppercase font-semibold mb-2"
                    style={{ color: 'var(--color-brand)' }}
                  >
                    {t(`steps.contact.privacy.sections.${key}.title`)}
                  </h3>
                  <p className="text-[13px] leading-[1.65] text-white/80 whitespace-pre-line">
                    {t(`steps.contact.privacy.sections.${key}.body`)}
                  </p>
                </section>
              ))}
            </div>

            {/* Footer */}
            <div
              className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 px-6 md:px-8 py-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.7)',
                  background: 'transparent',
                }}
              >
                {t('steps.contact.privacy.close')}
              </button>
              <a
                href={printHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-2.5 text-[11px] font-black tracking-[0.08em] uppercase transition-all duration-200 hover:brightness-110 text-center"
                style={{
                  fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                  background: 'var(--color-brand)',
                  color: '#000000',
                }}
              >
                {t('steps.contact.privacy.download')}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
