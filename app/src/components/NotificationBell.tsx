import { useEffect, useState, useRef } from 'react'
import {
  Sparkles, Star, X, CheckCircle2, AlertTriangle, Send, Loader2,
  Bug, HelpCircle, Lightbulb, MessageSquare, Zap, Wrench, Info,
} from 'lucide-react'
import {
  APP_UPDATES,
  isNewUpdate,
  formatUpdateDate,
  type UpdateCategory,
} from '@/lib/whats-new'

type FeedbackCategory = 'bug' | 'idea' | 'question' | 'other'

const SEEN_KEY = 'event-tool-whats-new-last-seen'
const DRAFT_KEY = 'event-tool-feedback-draft'

interface FeedbackDraft {
  category: FeedbackCategory
  message: string
  contact: string
  tab: 'updates' | 'feedback'
}

function loadDraft(): FeedbackDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || !parsed) return null
    return {
      category: ['bug', 'idea', 'question', 'other'].includes(parsed.category) ? parsed.category : 'idea',
      message: typeof parsed.message === 'string' ? parsed.message : '',
      contact: typeof parsed.contact === 'string' ? parsed.contact : '',
      tab: parsed.tab === 'feedback' ? 'feedback' : 'updates',
    }
  } catch {
    return null
  }
}

function saveDraft(d: FeedbackDraft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)) } catch { /* ignore */ }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

const categoryMeta: Record<UpdateCategory, { label: string; icon: React.ReactNode; color: string }> = {
  feature:     { label: 'Neu',          icon: <Zap className="h-3 w-3" />,        color: 'var(--color-brand)' },
  improvement: { label: 'Verbesserung', icon: <Lightbulb className="h-3 w-3" />,  color: '#3B82F6' },
  fix:         { label: 'Fix',          icon: <Wrench className="h-3 w-3" />,     color: '#10B981' },
  info:        { label: 'Info',         icon: <Info className="h-3 w-3" />,       color: '#6B7280' },
}

const fbCategoryMeta: Record<FeedbackCategory, { label: string; icon: React.ReactNode; color: string }> = {
  bug:      { label: 'Problem',   icon: <Bug className="h-3.5 w-3.5" />,         color: '#EF4444' },
  idea:     { label: 'Idee',      icon: <Lightbulb className="h-3.5 w-3.5" />,   color: 'var(--color-brand)' },
  question: { label: 'Frage',     icon: <HelpCircle className="h-3.5 w-3.5" />,  color: '#3B82F6' },
  other:    { label: 'Sonstiges', icon: <MessageSquare className="h-3.5 w-3.5" />, color: '#6B7280' },
}

interface Props {
  /** Theme variant. dark = white star on dark surfaces; light = black star on light surfaces */
  theme?: 'dark' | 'light'
}

export function NotificationBell({ theme = 'dark' }: Props) {
  const [open, setOpen] = useState(false)
  const [lastSeenId, setLastSeenId] = useState<string | null>(null)
  // Hydrate from localStorage so feedback drafts survive step navigation
  const initialDraft = useRef<FeedbackDraft | null>(null)
  if (initialDraft.current === null) {
    initialDraft.current = loadDraft() ?? { category: 'idea', message: '', contact: '', tab: 'updates' }
  }
  const [tab, setTab] = useState<'updates' | 'feedback'>(initialDraft.current.tab)
  const [fbCategory, setFbCategory] = useState<FeedbackCategory>(initialDraft.current.category)
  const [fbMessage, setFbMessage] = useState(initialDraft.current.message)
  const [fbContact, setFbContact] = useState(initialDraft.current.contact)
  const [fbSending, setFbSending] = useState(false)
  const [fbResult, setFbResult] = useState<'success' | 'error' | null>(null)
  const [fbError, setFbError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEEN_KEY)
      if (stored) setLastSeenId(stored)
    } catch { /* ignore */ }
  }, [])

  // Persist draft on each change so it's available after step navigation / remount
  useEffect(() => {
    if (fbMessage || fbContact || tab === 'feedback' || fbCategory !== 'idea') {
      saveDraft({ category: fbCategory, message: fbMessage, contact: fbContact, tab })
    }
  }, [fbCategory, fbMessage, fbContact, tab])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Unread = updates newer than last-seen AND inside the recency window (14d)
  const unseenCount = (() => {
    if (APP_UPDATES.length === 0) return 0
    if (!lastSeenId) return APP_UPDATES.filter((u) => isNewUpdate(u.date)).length
    const idx = APP_UPDATES.findIndex((u) => u.id === lastSeenId)
    if (idx === -1) return APP_UPDATES.filter((u) => isNewUpdate(u.date)).length
    return idx
  })()

  const handleOpen = () => {
    setOpen(true)
    if (APP_UPDATES.length > 0) {
      const topId = APP_UPDATES[0].id
      try { localStorage.setItem(SEEN_KEY, topId) } catch { /* ignore */ }
      setLastSeenId(topId)
    }
  }

  const submitFeedback = async () => {
    if (fbMessage.trim().length < 1 || fbSending) return
    setFbSending(true)
    setFbResult(null)
    setFbError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: fbCategory,
          message: fbMessage.trim(),
          contact: fbContact.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFbResult('error')
        setFbError(data.error || 'Versand fehlgeschlagen')
      } else {
        setFbResult('success')
        setFbMessage('')
        setFbContact('')
        clearDraft()
        setTimeout(() => { setFbResult(null); setTab('updates') }, 4000)
      }
    } catch (e) {
      setFbResult('error')
      setFbError(e instanceof Error ? e.message : 'Netzwerkfehler')
    } finally {
      setFbSending(false)
    }
  }

  const starColor = theme === 'light' ? '#0a0a0a' : '#ffffff'
  const hasUnread = unseenCount > 0

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label={`What's New (${unseenCount} ungelesen)`}
        className="relative p-2 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] rounded"
        style={{ background: 'transparent', border: 0 }}
      >
        {/* Glow ring (only when unread) */}
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'var(--color-brand)',
              opacity: 0.25,
              animationDuration: '2s',
            }}
          />
        )}
        <Star
          className="h-5 w-5 md:h-[22px] md:w-[22px] relative"
          strokeWidth={hasUnread ? 0 : 1.75}
          fill={hasUnread ? 'var(--color-brand)' : 'none'}
          color={hasUnread ? 'var(--color-brand)' : starColor}
          style={hasUnread ? { filter: 'drop-shadow(0 0 6px var(--color-brand))' } : undefined}
        />
        {hasUnread && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black"
            style={{
              background: 'var(--color-brand)',
              color: '#0a0a0a',
              fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
            }}
          >
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 z-50 w-[320px] sm:w-[400px] shadow-2xl border border-white/10"
          style={{ background: 'rgba(15,15,15,0.97)', backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-[var(--color-brand)]" />
              <h3
                className="text-sm font-black uppercase tracking-wide"
                style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif', letterSpacing: '0.08em' }}
              >
                What's New
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
              style={{ background: 'transparent', border: 0 }}
              aria-label="Schliessen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 px-2 pt-2 gap-1">
            <button
              type="button"
              onClick={() => setTab('updates')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              style={{
                fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                letterSpacing: '0.12em',
                background: tab === 'updates' ? 'rgba(255,152,41,0.18)' : 'transparent',
                color: tab === 'updates' ? 'var(--color-brand)' : 'rgba(255,255,255,0.55)',
                border: 0,
              }}
            >
              <Sparkles className="h-3 w-3" />
              Updates
            </button>
            <button
              type="button"
              onClick={() => setTab('feedback')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              style={{
                fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                letterSpacing: '0.12em',
                background: tab === 'feedback' ? 'rgba(255,152,41,0.18)' : 'transparent',
                color: tab === 'feedback' ? 'var(--color-brand)' : 'rgba(255,255,255,0.55)',
                border: 0,
              }}
            >
              <MessageSquare className="h-3 w-3" />
              Feedback
            </button>
          </div>

          {tab === 'updates' ? (
            <div className="max-h-[500px] overflow-y-auto">
              {APP_UPDATES.length === 0 ? (
                <div className="px-4 py-8 text-center text-white/50 text-sm">
                  Noch keine Updates.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {APP_UPDATES.map((u) => {
                    const meta = categoryMeta[u.category]
                    return (
                      <article key={u.id} className="px-4 py-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                            style={{
                              fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                              letterSpacing: '0.12em',
                              background: `${meta.color}20`,
                              color: meta.color,
                              border: `1px solid ${meta.color}40`,
                            }}
                          >
                            {meta.icon}
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-white/40">{formatUpdateDate(u.date)}</span>
                        </div>
                        <h4
                          className="text-sm font-black text-white mb-1"
                          style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                        >
                          {u.title}
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed">{u.description}</p>
                      </article>
                    )
                  })}
                </div>
              )}
              {/* Footer link to feedback */}
              <div className="border-t border-white/10 px-4 py-2.5 flex items-center justify-between bg-black/40">
                <span className="text-[10px] text-white/40">Fragen oder Probleme?</span>
                <button
                  type="button"
                  onClick={() => setTab('feedback')}
                  className="text-[10px] font-bold uppercase tracking-wider hover:underline cursor-pointer"
                  style={{
                    fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                    letterSpacing: '0.12em',
                    color: 'var(--color-brand)',
                    background: 'transparent', border: 0,
                  }}
                >
                  Feedback geben →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {fbResult === 'success' ? (
                <div
                  className="flex items-start gap-3 p-3.5 border"
                  style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.35)' }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                  <div>
                    <p className="text-sm font-black text-white" style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}>
                      Danke!
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Deine Nachricht ist bei Yannis angekommen. Er meldet sich sobald möglich.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-black text-white" style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}>
                      Problem oder Idee?
                    </h4>
                    <p className="text-xs text-white/60 mt-0.5">
                      Direkt an Yannis — landet in seinem Posteingang.
                    </p>
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                    >
                      Kategorie
                    </label>
                    <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                      {(Object.keys(fbCategoryMeta) as FeedbackCategory[]).map((c) => {
                        const m = fbCategoryMeta[c]
                        const active = fbCategory === c
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setFbCategory(c)}
                            disabled={fbSending}
                            className="flex flex-col items-center gap-1 px-1 py-2 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                            style={{
                              fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                              letterSpacing: '0.1em',
                              border: active ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,0.12)',
                              background: active ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                              color: active ? m.color : 'rgba(255,255,255,0.6)',
                            }}
                          >
                            {m.icon}
                            {m.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                    >
                      Nachricht
                    </label>
                    <textarea
                      value={fbMessage}
                      onChange={(e) => setFbMessage(e.target.value)}
                      disabled={fbSending}
                      placeholder={
                        fbCategory === 'bug' ? 'Was funktioniert nicht? Seite, Fehlermeldung, was hast du erwartet?'
                          : fbCategory === 'idea' ? 'Welches Feature würdest du dir wünschen?'
                          : 'Beschreib dein Anliegen …'
                      }
                      rows={4}
                      className="mt-1 w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:bg-white/10 focus:border-[var(--color-brand)]/50 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50"
                      style={{ fontFamily: 'Söhne Breit, Archivo Black, sans-serif' }}
                    >
                      Deine E-Mail <span className="normal-case opacity-60 font-normal">(optional, für Rückmeldung)</span>
                    </label>
                    <input
                      type="email"
                      value={fbContact}
                      onChange={(e) => setFbContact(e.target.value)}
                      disabled={fbSending}
                      placeholder="z.B. du@example.com"
                      className="mt-1 w-full bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:bg-white/10 focus:border-[var(--color-brand)]/50 disabled:opacity-50"
                    />
                  </div>

                  {fbResult === 'error' && (
                    <div
                      className="flex items-start gap-2 p-3 text-xs"
                      style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #EF4444', color: '#FCA5A5' }}
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Versand fehlgeschlagen</div>
                        {fbError && <div className="opacity-80 mt-0.5">{fbError}</div>}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={submitFeedback}
                    disabled={!fbMessage.trim() || fbSending}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-[0.1em] cursor-pointer transition-[filter] duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: 'Söhne Breit, Archivo Black, sans-serif',
                      background: 'var(--color-brand)',
                      color: '#0a0a0a',
                      border: 0,
                    }}
                  >
                    {fbSending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Wird gesendet …
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        An Yannis senden
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
