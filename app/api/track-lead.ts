import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

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
      return res.status(200).json({ ok: true, action: 'updated', row: existingRow })
    } else {
      const row = rowFromPayload(payload, true)
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:X',
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      })
      return res.status(200).json({ ok: true, action: 'inserted' })
    }
  } catch (err: any) {
    console.error('track-lead error:', err)
    return res.status(500).json({ error: err.message || 'unknown' })
  }
}
