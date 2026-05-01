import type { LocationInfo } from '../types'

export const LOCATIONS: Record<string, LocationInfo> = {
  muenchenstein: {
    id: 'muenchenstein',
    name: 'Union Sport Münchenstein',
    sports: {
      padel_panorama: 5,
      padel_single: 1,
      tennis_indoor: 5,
      tennis_outdoor: 2,
      golf_sim: 3,
      golf_range: 5,
      putting_green: 1,
    },
  },
  hafen: {
    id: 'hafen',
    name: 'Union Padel — Basel Hafen',
    sports: {
      padel_indoor: 5,
    },
  },
  wolf: {
    id: 'wolf',
    name: 'Union PickleBall — Basel Wolf',
    sports: {
      pball: 4,
      tabletennis: 4,
    },
  },
}

export type SportFamily = 'padel' | 'tennis' | 'golf' | 'pball' | 'tabletennis'

export const SPORT_FAMILY_TO_LOCATIONS: Record<SportFamily, string[]> = {
  padel: ['hafen', 'muenchenstein'],
  tennis: ['muenchenstein'],
  golf: ['muenchenstein'],
  pball: ['wolf'],
  tabletennis: ['wolf'],
}

export function getAvailableLocations(sportFamilies: string[]): string[] {
  if (sportFamilies.length === 0) return Object.keys(LOCATIONS)
  const sets = sportFamilies.map((s) => SPORT_FAMILY_TO_LOCATIONS[s as SportFamily] ?? [])
  if (sets.some((s) => s.length === 0)) return []
  return sets.reduce((acc, cur) => acc.filter((id) => cur.includes(id)), sets[0])
}

export const SPORT_LABELS: Record<string, { de: string; en: string }> = {
  padel_panorama: { de: 'Padel Panorama', en: 'Padel Panorama' },
  padel_single: { de: 'Padel Single', en: 'Padel Single' },
  padel_indoor: { de: 'Padel Indoor', en: 'Padel Indoor' },
  tennis_indoor: { de: 'Tennis Indoor', en: 'Tennis Indoor' },
  tennis_outdoor: { de: 'Tennis Outdoor', en: 'Tennis Outdoor' },
  golf_sim: { de: 'Golf Simulator', en: 'Golf Simulator' },
  golf_range: { de: 'Driving Range', en: 'Driving Range' },
  putting_green: { de: 'Putting Green', en: 'Putting Green' },
  pball: { de: 'Pickle-Ball', en: 'Pickle-Ball' },
  tabletennis: { de: 'Tischtennis', en: 'Table Tennis' },
}
