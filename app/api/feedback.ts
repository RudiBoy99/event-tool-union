import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const FEEDBACK_TARGET = 'ai.yannisgisler@gmail.com'

const CATEGORY_LABEL: Record<string, string> = {
  bug: 'Problem',
  idea: 'Idee',
  question: 'Frage',
  other: 'Sonstiges',
}

interface FeedbackPayload {
  category?: string
  message?: string
  contact?: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildEmail(p: { category: string; message: string; contact?: string }) {
  const ts = new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })
  const catLabel = CATEGORY_LABEL[p.category] ?? 'Sonstiges'
  const snippet = p.message.slice(0, 70).replace(/\s+/g, ' ').trim()
  const subject = `Kundenfeedback Event-Tool — ${catLabel}: ${snippet}`

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFF1E5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;background:#FFF1E5;">
    <div style="background:#FF9829;padding:24px;margin-bottom:24px;">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#0a0a0a;font-weight:700;">Union Sport · Event-Tool</div>
      <h1 style="font-size:24px;font-weight:900;color:#0a0a0a;margin:8px 0 0;letter-spacing:-0.01em;text-transform:uppercase;">Neues Feedback</h1>
      <div style="margin-top:8px;font-size:12px;color:#0a0a0a;opacity:0.7;">${ts}</div>
    </div>
    <div style="background:#fff;padding:24px;">
      <div style="margin-bottom:20px;">
        <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 4px;">Kategorie</div>
        <div style="font-size:15px;color:#0a0a0a;">${catLabel}</div>
      </div>
      ${p.contact ? `<div style="margin-bottom:20px;">
        <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 4px;">Kontakt</div>
        <div style="font-size:15px;color:#0a0a0a;"><a href="mailto:${escapeHtml(p.contact)}" style="color:#FF9829;">${escapeHtml(p.contact)}</a></div>
      </div>` : ''}
      <div>
        <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 6px;">Nachricht</div>
        <pre style="font-family:inherit;white-space:pre-wrap;font-size:15px;line-height:1.5;margin:0;padding:14px;background:#FFF1E5;border-left:3px solid #FF9829;color:#0a0a0a;">${escapeHtml(p.message)}</pre>
      </div>
    </div>
  </div>
</body></html>`

  const text = `Neues Feedback — Event-Tool
${ts}

Kategorie: ${catLabel}${p.contact ? `\nKontakt: ${p.contact}` : ''}

${p.message}`

  return { subject, html, text }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = req.body as FeedbackPayload
    const message = (body?.message ?? '').toString().trim()
    if (!message) {
      return res.status(400).json({ error: 'Bitte eine Nachricht eingeben.' })
    }
    const rawCategory = (body?.category ?? '').toString()
    const category = ['bug', 'idea', 'question', 'other'].includes(rawCategory) ? rawCategory : 'other'
    const contact = (body?.contact ?? '').toString().trim() || undefined

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.EVENT_NOTIFICATION_FROM
    if (!apiKey || !from) {
      console.error('[feedback] env vars missing')
      return res.status(500).json({ error: 'Mail-Konfiguration fehlt' })
    }

    const { subject, html, text } = buildEmail({ category, message, contact })
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: `Union Sport Event-Tool <${from}>`,
      to: [FEEDBACK_TARGET],
      replyTo: contact,
      subject,
      html,
      text,
    })

    console.log(`[feedback] sent: ${category}, ${message.length} chars`)
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('[feedback] error:', err)
    return res.status(500).json({ error: err?.message ?? 'unknown' })
  }
}
