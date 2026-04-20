import { LOCATIONS } from '../data/locations'
import type { LocationId, SportId, AvailabilitySlot } from '../types'
import availabilityData from '../data/availability.json'

type SportFamily = 'padel' | 'tennis' | 'golf' | 'pball' | 'tabletennis'

const SPORT_FAMILY_MAP: Record<SportFamily, SportId[]> = {
  padel: ['padel_panorama', 'padel_single', 'padel_indoor'],
  tennis: ['tennis_indoor', 'tennis_outdoor'],
  golf: ['golf_sim', 'golf_range'],
  pball: ['pball'],
  tabletennis: ['tabletennis'],
}

export function getCapacity(locationId: LocationId, sport: SportFamily): number {
  const loc = LOCATIONS[locationId]
  if (!loc) return 0
  const keys = SPORT_FAMILY_MAP[sport]
  return keys.reduce((sum, k) => sum + (loc.sports[k] ?? 0), 0)
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function overlaps(
  slot: { date: string; from: string; to: string },
  queryDate: string,
  queryFrom: string,
  queryDurationMinutes: number,
): boolean {
  if (slot.date !== queryDate) return false
  const slotStart = toMinutes(slot.from)
  const slotEnd = toMinutes(slot.to)
  const queryStart = toMinutes(queryFrom)
  const queryEnd = queryStart + queryDurationMinutes
  return queryStart < slotEnd && queryEnd > slotStart
}

export type AvailabilityResult =
  | { status: 'ok'; free: number }
  | { status: 'tight'; free: number; alternatives: AlternativeSlot[] }
  | { status: 'full'; free: 0; alternatives: AlternativeSlot[] }

export interface AlternativeSlot {
  date: string
  from: string
  to: string
  freeCourts: number
  isBest: boolean
}

export interface CheckInput {
  location: LocationId
  date: string
  from: string
  durationMinutes: number
  sport: SportFamily
  courtsNeeded: number
}

function computeFree(input: CheckInput): number {
  const capacity = getCapacity(input.location, input.sport)
  const slots = (availabilityData as Record<string, AvailabilitySlot[]>)[input.location] ?? []
  const blocked = slots
    .filter((s) => overlaps(s, input.date, input.from, input.durationMinutes))
    .reduce((sum, s) => {
      const keys = SPORT_FAMILY_MAP[input.sport]
      return sum + keys.reduce((a, k) => a + (s.blockedCourts[k] ?? 0), 0)
    }, 0)
  return Math.max(0, capacity - blocked)
}

export function suggestAlternatives(input: CheckInput): AlternativeSlot[] {
  const baseDate = new Date(input.date + 'T00:00:00')
  const candidates: AlternativeSlot[] = []
  const times = ['10:00', '14:00', '18:00']

  for (let offset = -14; offset <= 14; offset++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)

    for (const time of times) {
      const free = computeFree({ ...input, date: dateStr, from: time })
      if (free >= input.courtsNeeded) {
        const endH = Number(time.split(':')[0]) + Math.ceil(input.durationMinutes / 60)
        candidates.push({
          date: dateStr,
          from: time,
          to: `${String(endH).padStart(2, '0')}:00`,
          freeCourts: free,
          isBest: false,
        })
      }
    }
  }

  candidates.sort((a, b) => {
    const da = Math.abs(new Date(a.date).getTime() - baseDate.getTime())
    const db = Math.abs(new Date(b.date).getTime() - baseDate.getTime())
    return da - db
  })

  const top3 = candidates.slice(0, 3)
  if (top3.length > 0) top3[Math.min(1, top3.length - 1)].isBest = true
  return top3
}

export function checkAvailability(input: CheckInput): AvailabilityResult {
  const free = computeFree(input)

  if (free >= input.courtsNeeded) return { status: 'ok', free }
  if (free > 0) return { status: 'tight', free, alternatives: suggestAlternatives(input) }
  return { status: 'full', free: 0, alternatives: suggestAlternatives(input) }
}
