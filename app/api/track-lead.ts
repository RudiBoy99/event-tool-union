import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'
import { Resend } from 'resend'

const LOCATION_LABELS: Record<string, string> = {
  muenchenstein: 'Union Sport Münchenstein',
  hafen: 'Union Padel — Basel Hafen',
  wolf: 'Union PickleBall — Basel Wolf',
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  birthday: 'Geburtstag',
  corporate: 'Firmenanlass',
  teambuilding: 'Teambuilding',
  tournament: 'Turnier',
  camp: 'Camp',
  school: 'Schule / Jugend',
  court_only: 'Court-Only',
}

function fmtFlags(obj: any, dict?: Record<string, string>): string {
  if (!obj || typeof obj !== 'object') return '—'
  const trueKeys = Object.entries(obj).filter(([_, v]) => v === true).map(([k]) => k)
  if (trueKeys.length === 0) return '—'
  return trueKeys.map((k) => dict?.[k] ?? k).join(', ')
}

const GASTRO_LABELS: Record<string, string> = {
  bistro: 'Bistro',
  drinks: 'Getränkepauschale',
  apero: 'Apéro',
  foodtruck: 'Foodtruck',
  externalCatering: 'Externes Catering',
}
const ROOM_LABELS: Record<string, string> = {
  lounge: 'Eventlounge',
  meetingRoom: 'Meetingraum',
}
const EXTRA_LABELS: Record<string, string> = {
  coach: 'Coach / Trainer',
  equipment: 'Equipment-Leihe',
  photographer: 'Fotograf',
  music: 'Musik / DJ',
  trophies: 'Pokale',
}
const MEETING_LABELS: Record<string, string> = {
  none: 'Nicht nötig',
  call: 'Telefon-Call',
  onsite: 'Vor Ort',
}

function buildSubmissionEmail(d: any, leadId: string): { subject: string; html: string; text: string } {
  const name = d.contact?.name || '—'
  const company = d.contact?.company || '—'
  const email = d.contact?.email || '—'
  const phone = d.contact?.phone || '—'
  const eventType = EVENT_TYPE_LABELS[d.eventType] || d.eventType || '—'
  const location = LOCATION_LABELS[d.location] || d.location || '—'
  const date = d.dateTime?.date || '—'
  const startTime = d.dateTime?.startTime || '—'
  const duration = d.dateTime?.durationMinutes ? `${(d.dateTime.durationMinutes / 60).toFixed(1)} h` : '—'
  const personen = d.attendees?.count ?? '—'
  const ageGroup = d.attendees?.ageGroup || '—'
  const level = d.attendees?.level || '—'
  const sportsList = Array.isArray(d.sports) && d.sports.length
    ? d.sports.map((s: any) => `${s.sport} (${s.courts} Court${s.courts === 1 ? '' : 's'})`).join(', ')
    : '—'
  const gastro = fmtFlags(d.gastro, GASTRO_LABELS)
  const rooms = fmtFlags(d.rooms, ROOM_LABELS)
  const extras = fmtFlags(d.extras, EXTRA_LABELS)
  const meetingWish = MEETING_LABELS[d.meeting?.wish] || d.meeting?.wish || '—'
  const meetingNote = d.meeting?.note || ''

  const subject = `Neue Event-Anfrage — ${name}${company !== '—' ? ` (${company})` : ''}`

  const sectionStyle = 'margin: 0 0 24px;'
  const labelStyle = 'font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin: 0 0 4px;'
  const valueStyle = 'font-size: 15px; color: #0a0a0a; margin: 0; line-height: 1.4;'

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#FFF1E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 24px; background: #FFF1E5;">
    <div style="background: #FF9829; padding: 24px; margin-bottom: 24px;">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #0a0a0a; font-weight: 700;">Union Sport · Events</div>
      <h1 style="font-size: 28px; font-weight: 900; color: #0a0a0a; margin: 8px 0 0; letter-spacing: -0.02em; text-transform: uppercase;">Neue Event-Anfrage</h1>
    </div>

    <div style="background: #fff; padding: 24px;">
      <div style="${sectionStyle}">
        <p style="${labelStyle}">Kontakt</p>
        <p style="${valueStyle}"><strong>${name}</strong>${company !== '—' ? ` · ${company}` : ''}</p>
        <p style="${valueStyle}"><a href="mailto:${email}" style="color: #FF9829;">${email}</a> · <a href="tel:${phone}" style="color: #FF9829;">${phone}</a></p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Event-Typ</p>
        <p style="${valueStyle}">${eventType}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Datum & Dauer</p>
        <p style="${valueStyle}">${date} · ${startTime} · ${duration}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Standort</p>
        <p style="${valueStyle}">${location}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Teilnehmer & Sport</p>
        <p style="${valueStyle}">${personen} Personen · ${ageGroup} · Level ${level}</p>
        <p style="${valueStyle}">${sportsList}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Gastro</p>
        <p style="${valueStyle}">${gastro}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Räume</p>
        <p style="${valueStyle}">${rooms}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Weitere Extras</p>
        <p style="${valueStyle}">${extras}</p>
      </div>

      <div style="${sectionStyle}">
        <p style="${labelStyle}">Persönliches Gespräch</p>
        <p style="${valueStyle}">${meetingWish}${meetingNote ? `<br><em style="color:#666;">«${meetingNote}»</em>` : ''}</p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 32px;">
        <p style="font-size: 11px; color: #888; margin: 0;">Lead-ID: <code>${leadId}</code></p>
        <p style="font-size: 11px; color: #888; margin: 4px 0 0;">Vollständige Lead-Historie im Google Sheet.</p>
      </div>
    </div>
  </div>
</body></html>`

  const text = `Neue Event-Anfrage — ${name}

KONTAKT
${name}${company !== '—' ? ` · ${company}` : ''}
${email} · ${phone}

EVENT-TYP: ${eventType}
DATUM: ${date} · ${startTime} · ${duration}
STANDORT: ${location}

TEILNEHMER & SPORT
${personen} Personen · ${ageGroup} · Level ${level}
${sportsList}

GASTRO: ${gastro}
RÄUME: ${rooms}
EXTRAS: ${extras}

PERSÖNLICHES GESPRÄCH: ${meetingWish}${meetingNote ? `\n«${meetingNote}»` : ''}

Lead-ID: ${leadId}`

  return { subject, html, text }
}

async function sendNotificationEmail(payload: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.EVENT_NOTIFICATION_TO
  const from = process.env.EVENT_NOTIFICATION_FROM
  if (!apiKey || !to || !from) {
    console.warn('Resend env vars missing, skipping email')
    return
  }
  const resend = new Resend(apiKey)
  const { subject, html, text } = buildSubmissionEmail(payload.data || {}, payload.leadId)
  await resend.emails.send({
    from: `Union Sport Events <${from}>`,
    to: [to],
    replyTo: payload.data?.contact?.email || undefined,
    subject,
    html,
    text,
  })
}

function buildConfirmationEmail(d: any, leadId: string): { subject: string; html: string; text: string } {
  const lang = (d.contact?.language || 'de').toLowerCase().startsWith('en') ? 'en' : 'de'
  const name = d.contact?.name || (lang === 'en' ? 'there' : 'zusammen')
  const eventType = EVENT_TYPE_LABELS[d.eventType] || d.eventType || '—'
  const location = LOCATION_LABELS[d.location] || d.location || '—'
  const date = d.dateTime?.date || '—'
  const startTime = d.dateTime?.startTime || '—'
  const personen = d.attendees?.count ?? '—'

  const copy = lang === 'en' ? {
    subject: `Your event request — Union Sport`,
    eyebrow: 'Union Sport · Events',
    hello: `Hi ${name},`,
    intro: 'Thanks for your event request — we received it and will get back to you shortly.',
    summaryTitle: 'YOUR REQUEST',
    type: 'Event type',
    when: 'When',
    where: 'Where',
    people: 'People',
    refLabel: 'Reference',
    closing: 'We will personally review your request and reply with a tailored offer.',
    signoff: 'Your Union Sport team',
    footer: 'If you have any questions, simply reply to this email.',
  } : {
    subject: `Deine Event-Anfrage — Union Sport`,
    eyebrow: 'Union Sport · Events',
    hello: `Hallo ${name},`,
    intro: 'Vielen Dank für deine Event-Anfrage — sie ist bei uns eingegangen und wir melden uns in Kürze persönlich.',
    summaryTitle: 'DEINE ANFRAGE',
    type: 'Event-Typ',
    when: 'Wann',
    where: 'Wo',
    people: 'Personen',
    refLabel: 'Referenz',
    closing: 'Wir prüfen deine Anfrage persönlich und melden uns mit einem massgeschneiderten Angebot.',
    signoff: 'Dein Union Sport Team',
    footer: 'Bei Fragen einfach auf diese Mail antworten.',
  }

  const subject = copy.subject

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFF1E5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;background:#FFF1E5;">
    <div style="background:#FF9829;padding:24px;margin-bottom:24px;">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#0a0a0a;font-weight:700;">${copy.eyebrow}</div>
      <h1 style="font-size:28px;font-weight:900;color:#0a0a0a;margin:8px 0 0;letter-spacing:-0.02em;text-transform:uppercase;">${lang === 'en' ? 'Request received' : 'Anfrage eingegangen'}</h1>
    </div>
    <div style="background:#fff;padding:24px;">
      <p style="font-size:16px;color:#0a0a0a;margin:0 0 16px;">${copy.hello}</p>
      <p style="font-size:15px;color:#0a0a0a;line-height:1.5;margin:0 0 24px;">${copy.intro}</p>

      <div style="border-top:1px solid #eee;padding-top:16px;margin-bottom:16px;">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 8px;">${copy.summaryTitle}</p>
        <p style="font-size:14px;color:#0a0a0a;margin:0 0 4px;"><strong>${copy.type}:</strong> ${eventType}</p>
        <p style="font-size:14px;color:#0a0a0a;margin:0 0 4px;"><strong>${copy.when}:</strong> ${date} · ${startTime}</p>
        <p style="font-size:14px;color:#0a0a0a;margin:0 0 4px;"><strong>${copy.where}:</strong> ${location}</p>
        <p style="font-size:14px;color:#0a0a0a;margin:0 0 4px;"><strong>${copy.people}:</strong> ${personen}</p>
      </div>

      <p style="font-size:15px;color:#0a0a0a;line-height:1.5;margin:24px 0 16px;">${copy.closing}</p>
      <p style="font-size:15px;color:#0a0a0a;margin:0 0 24px;">${copy.signoff}</p>

      <div style="border-top:1px solid #eee;padding-top:16px;margin-top:24px;">
        <p style="font-size:11px;color:#888;margin:0;">${copy.refLabel}: <code>${leadId}</code></p>
        <p style="font-size:11px;color:#888;margin:8px 0 0;">${copy.footer}</p>
      </div>
    </div>
  </div>
</body></html>`

  const text = `${copy.hello}

${copy.intro}

${copy.summaryTitle}
${copy.type}: ${eventType}
${copy.when}: ${date} · ${startTime}
${copy.where}: ${location}
${copy.people}: ${personen}

${copy.closing}

${copy.signoff}

${copy.refLabel}: ${leadId}
${copy.footer}`

  return { subject, html, text }
}

async function sendConfirmationEmail(payload: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EVENT_NOTIFICATION_FROM
  const replyTo = process.env.EVENT_NOTIFICATION_TO
  const customerEmail = payload.data?.contact?.email
  if (!apiKey || !from || !customerEmail) {
    console.warn('Resend env or customer email missing, skipping confirmation email')
    return
  }
  const resend = new Resend(apiKey)
  const { subject, html, text } = buildConfirmationEmail(payload.data || {}, payload.leadId)
  await resend.emails.send({
    from: `Union Sport Events <${from}>`,
    to: [customerEmail],
    replyTo: replyTo || undefined,
    subject,
    html,
    text,
  })
}

const HEADERS = [
  'leadId', 'Erstellt', 'Aktualisiert', 'Status', 'Schritt',
  'Name', 'Firma', 'Email', 'Telefon', 'Sprache',
  'EventTyp', 'Personen', 'Altersgruppe', 'Level', 'Sportarten',
  'Standort', 'Datum', 'Startzeit', 'DauerMin',
  'Gastro', 'Räume', 'Extras',
  'MeetingWunsch', 'MeetingNote',
]

interface LeadPayload {
  leadId: string
  status: string
  step: number
  data: any  // the EventRequestData shape (partial)
}

function safe(v: any): string {
  if (v === undefined || v === null) return ''
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

function rowFromPayload(p: LeadPayload, isNew: boolean): string[] {
  const now = new Date().toISOString()
  const d = p.data || {}
  const sportsList = Array.isArray(d.sports)
    ? d.sports.map((s: any) => `${s.sport}(${s.courts})`).join(', ')
    : ''
  const flagsTrue = (obj: any) =>
    obj && typeof obj === 'object'
      ? Object.entries(obj).filter(([_, v]) => v === true).map(([k]) => k).join(', ')
      : ''

  return [
    p.leadId,
    isNew ? now : '',  // Erstellt only on insert (we'll handle preserve on update)
    now,               // Aktualisiert always
    p.status,
    String(p.step),
    safe(d.contact?.name),
    safe(d.contact?.company),
    safe(d.contact?.email),
    safe(d.contact?.phone),
    safe(d.contact?.language),
    safe(d.eventType),
    safe(d.attendees?.count),
    safe(d.attendees?.ageGroup),
    safe(d.attendees?.level),
    sportsList,
    safe(d.location),
    safe(d.dateTime?.date),
    safe(d.dateTime?.startTime),
    safe(d.dateTime?.durationMinutes),
    flagsTrue(d.gastro),
    flagsTrue(d.rooms),
    flagsTrue(d.extras),
    safe(d.meeting?.wish),
    safe(d.meeting?.note),
  ]
}

async function getClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  await auth.authorize()
  return google.sheets({ version: 'v4', auth })
}

async function ensureHeaders(sheets: any, sheetId: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A1:Z1',
  })
  const existing = (res.data.values || [])[0] || []
  if (existing.length === 0 || existing[0] !== 'leadId') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    })
  }
}

async function findRow(sheets: any, sheetId: string, leadId: string): Promise<number | null> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A2:A10000',
  })
  const ids = (res.data.values || []).map((r: any[]) => r[0])
  const idx = ids.indexOf(leadId)
  return idx === -1 ? null : idx + 2  // 1-based + skip header
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const payload = req.body as LeadPayload
    if (!payload?.leadId) return res.status(400).json({ error: 'leadId required' })

    const sheetId = process.env.GOOGLE_SHEET_ID!
    const sheets = await getClient()
    await ensureHeaders(sheets, sheetId)

    const existingRow = await findRow(sheets, sheetId, payload.leadId)

    if (existingRow) {
      // Update — preserve "Erstellt" timestamp from existing row
      const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `B${existingRow}`,
      })
      const createdAt = (existing.data.values || [[]])[0]?.[0] || new Date().toISOString()
      const row = rowFromPayload(payload, false)
      row[1] = createdAt  // Erstellt
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `A${existingRow}:X${existingRow}`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      })

      if (payload.status === 'SUBMITTED') {
        try { await sendNotificationEmail(payload) } catch (e) { console.error('notification email failed:', e) }
        try { await sendConfirmationEmail(payload) } catch (e) { console.error('confirmation email failed:', e) }
      }

      return res.status(200).json({ ok: true, action: 'updated', row: existingRow })
    } else {
      const row = rowFromPayload(payload, true)
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:X',
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      })

      if (payload.status === 'SUBMITTED') {
        try { await sendNotificationEmail(payload) } catch (e) { console.error('notification email failed:', e) }
        try { await sendConfirmationEmail(payload) } catch (e) { console.error('confirmation email failed:', e) }
      }

      return res.status(200).json({ ok: true, action: 'inserted' })
    }
  } catch (err: any) {
    console.error('track-lead error:', err)
    return res.status(500).json({ error: err.message || 'unknown' })
  }
}
