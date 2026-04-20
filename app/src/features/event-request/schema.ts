import { z } from 'zod'

export const eventRequestSchema = z.object({
  contact: z.object({
    name: z.string().min(2, 'Name ist zu kurz'),
    company: z.string().optional(),
    email: z.string().email('Ungültige E-Mail'),
    phone: z.string().min(5, 'Telefonnummer fehlt'),
    language: z.enum(['de', 'en']),
  }),
  location: z.enum(['muenchenstein', 'hafen', 'wolf']),
  dateTime: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum erforderlich'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Startzeit erforderlich'),
    durationMinutes: z.number().int().positive(),
  }),
  eventType: z.enum(['birthday', 'corporate', 'teambuilding', 'tournament', 'camp', 'school', 'court_only']),
  attendees: z.object({
    count: z.number().int().min(1).max(200),
    ageGroup: z.enum(['children', 'teens', 'adults', 'mixed']),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  }),
  sports: z.array(z.object({
    sport: z.enum(['padel', 'tennis', 'golf', 'pball', 'tabletennis']),
    courts: z.number().int().min(1),
  })).min(1, 'Mindestens eine Sportart wählen'),
  gastro: z.object({
    bistro: z.boolean(),
    drinks: z.boolean(),
    apero: z.boolean(),
    foodtruck: z.boolean(),
    externalCatering: z.boolean(),
  }),
  rooms: z.object({
    lounge: z.boolean(),
    meetingRoom: z.boolean(),
  }),
  extras: z.object({
    coach: z.boolean(),
    equipment: z.boolean(),
    photographer: z.boolean(),
    music: z.boolean(),
    trophies: z.boolean(),
  }),
  meeting: z.object({
    wish: z.enum(['none', 'call', 'onsite']),
    note: z.string().optional(),
  }),
})

export type EventRequestData = z.infer<typeof eventRequestSchema>

export const emptyEventRequest: EventRequestData = {
  contact: { name: '', company: '', email: '', phone: '', language: 'de' },
  location: 'muenchenstein',
  dateTime: { date: '', startTime: '', durationMinutes: 120 },
  eventType: 'corporate',
  attendees: { count: 10, ageGroup: 'adults', level: 'mixed' },
  sports: [],
  gastro: { bistro: false, drinks: false, apero: false, foodtruck: false, externalCatering: false },
  rooms: { lounge: false, meetingRoom: false },
  extras: { coach: false, equipment: false, photographer: false, music: false, trophies: false },
  meeting: { wish: 'none', note: '' },
}
