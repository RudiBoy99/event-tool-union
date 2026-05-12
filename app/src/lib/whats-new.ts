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
    id: '2026-05-12-neon-story',
    date: '2026-05-12',
    category: 'feature',
    title: 'Neon Padel Story Mode',
    description:
      'Wer "Neon Padel" als Event wählt, sieht jetzt die echte Instagram-Story im iPhone-Frame mit Live-Link zu @union.padel.basel. Standort wird automatisch auf Basel Hafen gesetzt.',
  },
  {
    id: '2026-05-12-clock-picker',
    date: '2026-05-12',
    category: 'improvement',
    title: 'Neuer Uhrzeit-Picker',
    description:
      'Statt Dropdown-Listen jetzt eine analoge Uhr: Stunde antippen, dann Minute (in 15-Min-Schritten). Mit "Jetzt"-Button für schnelles Auto-Fill auf die nächste Viertelstunde.',
  },
  {
    id: '2026-05-12-courts',
    date: '2026-05-12',
    category: 'improvement',
    title: 'Courts-Auswahl umgebaut',
    description:
      'Court-Anzahl jetzt auf der Datums-Seite mit Stepper-Buttons (− / +). Golf bekommt eigene Felder für Abschläge, Trackman und Putting Green. Info-Icon (i) zeigt Empfehlung pro Sportart.',
  },
  {
    id: '2026-05-12-slideshow',
    date: '2026-05-12',
    category: 'improvement',
    title: 'Hintergrund-Slideshow lebendiger',
    description:
      'Bilder und Videos pro Sportart sind jetzt frisch geschnitten ohne Titel-Einblendungen, mit dynamischem Ken-Burns-Effekt und flüssigen Übergängen. Tennis-Pool erweitert um 6 4K-Cuts aus dem Tennis Promo Final.',
  },
  {
    id: '2026-05-12-update-star',
    date: '2026-05-12',
    category: 'feature',
    title: 'Stern oben rechts',
    description:
      'Auf jeder Seite sichtbar: Updates-Feed plus Feedback-Tab direkt an Yannis. Geschriebenes Feedback bleibt auch beim Step-Wechsel erhalten, falls du noch etwas ergänzen willst.',
  },
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
