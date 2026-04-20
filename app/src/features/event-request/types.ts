export type LocationId = 'muenchenstein' | 'hafen' | 'wolf'

export type SportId =
  | 'padel_panorama'
  | 'padel_single'
  | 'padel_indoor'
  | 'tennis_indoor'
  | 'tennis_outdoor'
  | 'golf_sim'
  | 'golf_range'
  | 'putting_green'
  | 'pball'
  | 'tabletennis'

export type EventTypeId =
  | 'birthday'
  | 'corporate'
  | 'teambuilding'
  | 'tournament'
  | 'camp'
  | 'school'
  | 'court_only'

export interface LocationInfo {
  id: LocationId
  name: string
  sports: Partial<Record<SportId, number>>
}

export interface AvailabilitySlot {
  date: string
  from: string
  to: string
  blockedCourts: Partial<Record<SportId, number>>
}
