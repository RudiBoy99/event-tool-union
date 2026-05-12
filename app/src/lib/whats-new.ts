// Update-Feed für das Event-Tool. Wenn ein neuer Eintrag oben dazukommt,
// erscheint am Stern oben rechts eine Badge mit Anzahl ungelesener Items.

export type UpdateCategory = 'feature' | 'improvement' | 'fix' | 'info'

export interface AppUpdate {
  id: string
  date: string // YYYY-MM-DD
  category: UpdateCategory
  title: string
  description: string
}

export const APP_UPDATES: AppUpdate[] = [
  {
    id: '2026-05-11-launch',
    date: '2026-05-11',
    category: 'feature',
    title: 'Event-Tool ist live',
    description:
      'Buche dein Event in 7 Schritten — Sportart, Standort, Datum, Extras. Mit cinematic Video-Slideshow pro Sport, Neon-Padel Event-Typ und direktem Draht zu Union Sport via Feedback-Tab.',
  },
]

export function isNewUpdate(dateStr: string, thresholdDays = 14): boolean {
  const age = Date.now() - new Date(dateStr).getTime()
  return age < thresholdDays * 24 * 60 * 60 * 1000
}

export function formatUpdateDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
