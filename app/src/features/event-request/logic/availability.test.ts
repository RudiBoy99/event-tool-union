import { describe, it, expect } from 'vitest'
import { getCapacity, overlaps, checkAvailability, suggestAlternatives } from './availability'

describe('getCapacity', () => {
  it('returns 6 for padel at muenchenstein (5 panorama + 1 single)', () => {
    const result = getCapacity('muenchenstein', 'padel')
    expect(result).toBe(6)
  })

  it('returns 5 for padel at hafen', () => {
    const result = getCapacity('hafen', 'padel')
    expect(result).toBe(5)
  })

  it('returns 4 for pball at wolf', () => {
    const result = getCapacity('wolf', 'pball')
    expect(result).toBe(4)
  })

  it('returns 0 for unknown sport at location', () => {
    const result = getCapacity('hafen', 'tennis')
    expect(result).toBe(0)
  })
})

describe('overlaps', () => {
  const slot = { date: '2026-08-15', from: '19:00', to: '22:00' }

  it('returns true when exact same slot', () => {
    expect(overlaps(slot, '2026-08-15', '19:00', 180)).toBe(true)
  })

  it('returns true when query starts inside slot', () => {
    expect(overlaps(slot, '2026-08-15', '20:00', 60)).toBe(true)
  })

  it('returns true when query ends inside slot', () => {
    expect(overlaps(slot, '2026-08-15', '18:00', 120)).toBe(true)
  })

  it('returns false when before slot', () => {
    expect(overlaps(slot, '2026-08-15', '16:00', 120)).toBe(false)
  })

  it('returns false when after slot', () => {
    expect(overlaps(slot, '2026-08-15', '22:00', 60)).toBe(false)
  })

  it('returns false on different date', () => {
    expect(overlaps(slot, '2026-08-16', '19:00', 60)).toBe(false)
  })
})

describe('checkAvailability', () => {
  it('returns ok when no overlap', () => {
    const r = checkAvailability({
      location: 'muenchenstein',
      date: '2026-08-15',
      from: '10:00',
      durationMinutes: 120,
      sport: 'padel',
      courtsNeeded: 1,
    })
    expect(r.status).toBe('ok')
    expect(r.free).toBe(6)
  })

  it('returns full when all padel blocked at muenchenstein 19:00', () => {
    const r = checkAvailability({
      location: 'muenchenstein',
      date: '2026-08-15',
      from: '19:00',
      durationMinutes: 180,
      sport: 'padel',
      courtsNeeded: 1,
    })
    expect(r.status).toBe('full')
    expect(r.free).toBe(0)
  })

  it('returns tight when some courts free but fewer than needed', () => {
    const r = checkAvailability({
      location: 'hafen',
      date: '2026-08-15',
      from: '14:00',
      durationMinutes: 180,
      sport: 'padel',
      courtsNeeded: 4,
    })
    expect(r.status).toBe('tight')
    expect(r.free).toBe(3)
  })
})

describe('suggestAlternatives', () => {
  it('returns up to 3 slots within ±14 days of target', () => {
    const alts = suggestAlternatives({
      location: 'hafen',
      date: '2026-08-15',
      from: '19:00',
      durationMinutes: 180,
      sport: 'padel',
      courtsNeeded: 5,
    })
    expect(alts.length).toBeGreaterThan(0)
    expect(alts.length).toBeLessThanOrEqual(3)
    alts.forEach((a) => {
      expect(a.freeCourts).toBeGreaterThanOrEqual(5)
    })
  })

  it('marks exactly one alternative as best', () => {
    const alts = suggestAlternatives({
      location: 'hafen',
      date: '2026-08-15',
      from: '19:00',
      durationMinutes: 180,
      sport: 'padel',
      courtsNeeded: 5,
    })
    const bestCount = alts.filter((a) => a.isBest).length
    expect(bestCount).toBe(1)
  })
})
