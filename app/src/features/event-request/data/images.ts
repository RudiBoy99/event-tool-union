import type { SportFamily } from './locations'

/**
 * Media item displayed in the slideshow. Discriminated by `type`.
 * Videos auto-loop and crossfade after `durationMs`.
 *
 * `tags` drives event-type-aware filtering:
 *  - `action`  → ball-in-play, swings, rallies, jumps
 *  - `court`   → court/arena establishing shots, drone overviews, facility
 *  - `social`  → people, group shots, high-fives, lounge moments
 *  - `neon`    → neon padel material (UV-lit, only used for neon_padel event)
 */
export type MediaItem = {
  poster?: string
  durationMs?: number
  tags?: string[]
} & ({ type: 'image'; src: string } | { type: 'video'; src: string })

const img = (src: string, tags?: string[]): MediaItem => ({ type: 'image', src, tags })
const vid = (slug: string, durationMs: number, tags?: string[]): MediaItem => ({
  type: 'video',
  src: `/videos/${slug}.mp4`,
  poster: `/videos/${slug}-poster.webp`,
  durationMs,
  tags,
})

/**
 * Pools per sport. Videos dominate (~80%), images sprinkled in as variety.
 * Each item gets its slot duration based on the actual cut length.
 */
export const SPORT_MEDIA: Record<SportFamily, MediaItem[]> = {
  padel: [
    // padel-02 (Schmash WOW) entfernt — KAP-Shirt Jump-Cut bei 1.7s
    // padel-03 (Sneaker-Detail) entfernt — "Play"-Title-Bleed am Schluss
    // padel-04 (High-Five) entfernt — Source-Material-Cut unfixbar
    // padel-07 (Sommerfest) entfernt — Dancing→Match Jump-Cut bei 1.3s
    // Pool ist jetzt 100% Single-Scene Play-Sequenzen, alternierend Outdoor/Indoor
    vid('sports/padel/padel-08', 3400, ['action']),                  // Outdoor Smash Münchenstein (Glaswand + Strasse BG)
    vid('sports/padel/padel-10', 2000, ['action']),                  // Indoor Serve Scene (2 Spieler + Ball-Machine)
    vid('sports/padel/padel-09', 2300, ['action']),                  // Doppel-Match Outdoor (Mann am Netz)
    vid('sports/padel/padel-01', 1500, ['court']),                   // Indoor-Sweep leere Courts (Establisher)
    vid('sports/padel/padel-11', 2200, ['action']),                  // Indoor Drone Dive (Frau Stretch-Shot)
  ],
  golf: [
    // Halle-Video zuerst (User-Wunsch), dann Bilder dazwischen statt clustered am Ende
    vid('sports/golf/golf-01', 2000, ['court']),                     // Driving Range Halle Wide + SportsCoach Simulator (HERO)
    img('/images/sports/golf/golf-01.webp', ['court']),
    img('/images/sports/golf/golf-03.webp', ['social']),
    img('/images/sports/golf/golf-02.webp', ['court']),
  ],
  pball: [
    // Pickleball-Corner-Halle als Hero zuerst (länger gezeigt für Establishing-Wirkung)
    vid('sports/pball/pball-04', 7000, ['court']),                   // Pickleball-Corner Halle Establisher (HERO, 7s)
    img('/images/sports/pball/pball-01.webp', ['social']),
    vid('sports/pball/pball-01', 6000, ['court']),                   // Hero Jubel + Architektur
    img('/images/sports/pball/pball-03.webp', ['social']),
    vid('sports/pball/pball-02', 6000, ['action']),                  // Backhand-Slice
    img('/images/sports/pball/pball-02.webp', ['social']),
    vid('sports/pball/pball-03', 7000, ['action']),                  // Doppel-Rally Scoreboard
    img('/images/sports/pball/pball-04.webp', ['social']),
    vid('sports/pball/pball-05', 6000, ['social']),                  // Studio-Portraits
  ],
  tennis: [
    // Hero-Action zuerst — Money-Shots aus dem Tennis Promo Final
    // tennis-01 / tennis-02 (Münchenstein) entfernt — Title-Bleed im Source-Material unfixbar
    vid('sports/tennis/tennis-09', 2000, ['action']),                // Forehand Hero Female (Money-Shot)
    vid('sports/tennis/tennis-11', 3000, ['action']),                // Backhand Outdoor vor Bäumen
    vid('sports/tennis/tennis-08', 2500, ['action']),                // Spielerin in Bewegung vor Graffiti
    vid('sports/tennis/tennis-06', 3000, ['court']),                 // Wilson Ball-Dose Close-Up Detail
    vid('sports/tennis/tennis-10', 2500, ['social']),                // Lachende Spielerin Outdoor
    vid('sports/tennis/tennis-07', 3000, ['social']),                // Lachende Spielerin Indoor
    vid('sports/tennis/tennis-03', 4000, ['social']),                // Tennis Indoor Spielerin + Männer Handshake
    vid('sports/tennis/tennis-05', 2000, ['action']),                // Tennis-Spielerin in Bewegung Indoor
    vid('sports/tennis/tennis-04', 2000, ['action']),                // Tennis-Volley Nadal
  ],
  tabletennis: [
    // No dedicated material yet — full pball fallback (same venue Wolf)
    vid('sports/pball/pball-01', 6000, ['court']),
    img('/images/sports/pball/pball-01.webp', ['social']),
    vid('sports/pball/pball-02', 6000, ['action']),
    img('/images/sports/pball/pball-02.webp', ['social']),
    vid('sports/pball/pball-03', 7000, ['action']),
  ],
}

/**
 * Default pool shown before a sport has been chosen
 * (steps Contact + EventType + initial AttendeesSport).
 * Heavy on event atmosphere — sells the "Erlebnis" not yet a specific sport.
 */
export const DEFAULT_MEDIA: MediaItem[] = [
  vid('default/default-01', 5000, ['social']),                       // DJ-Pult + Tanzgruppe HERO
  vid('default/default-07', 2000, ['court']),                        // Drohne Münchenstein Anlage
  vid('default/default-03', 5000, ['social']),                       // Apéro→DJ→Tanz
  vid('default/default-08-neonatmo', 5000, ['social']),              // Neon Padel Atmosphäre (DJ-Booth + UV)
  // default-06 (Drohne UNION HAFEN) entfernt — Source-Video startet sofort mit "UNION/HAFEN/PADEL"-Title-Burn-in
  vid('default/default-02', 4000, ['social']),                       // Lichterketten-Lauf
  vid('default/default-05', 3000, ['social']),                       // Grill-Closeup
  vid('default/default-04', 3000, ['social']),                       // Töggeli + Lounge
]

/**
 * Event-type-specific pools. Override the sport pool when the user picks
 * one of these event types (priority: eventType > sports).
 *
 * `neon_padel` ist strikt Neon-only — kein Hafen-Padel-Mix.
 */
/**
 * Native portrait IG-Story clip used in the "Story Mode" layout for Neon Padel.
 * Bypasses the slideshow — played as a single looping video inside the Phone-Frame
 * (and as a blurred backdrop fill).
 */
export const NEON_STORY_VIDEO = {
  src: '/videos/event/neon_padel/neon-story.mp4',
  poster: '/videos/event/neon_padel/neon-story-poster.webp',
  durationMs: 12500,
} as const

export const EVENT_TYPE_MEDIA: Record<string, MediaItem[]> = {
  neon_padel: [
    vid('event/neon_padel/neon-04', 3500, ['action', 'neon']),       // SIGNATURE: Spielerin + glühender Ball am Netz (Money-Shot)
    vid('event/neon_padel/neon-01', 2500, ['neon']),                 // UNION PADEL Flag (Branding Hero)
    vid('event/neon_padel/neon-02', 3000, ['action', 'neon']),       // Rally durch Court-Zaun
    vid('event/neon_padel/neon-03', 3000, ['court', 'neon']),        // Architektur-Walkway Wide
    vid('event/neon_padel/neon-05', 2500, ['action', 'neon']),       // Rally-Fortsetzung mit Ball-Trail
    vid('event/neon_padel/neon-06', 3000, ['court', 'neon']),        // Venue-Pan: Lounge + DJ
  ],
}

interface MediaContext {
  sports?: { sport: SportFamily }[]
  eventType?: string
}

export function getMediaForContext({ sports, eventType }: MediaContext): MediaItem[] {
  // Event-type pool wins if defined (e.g. neon_padel → strict Neon-only)
  if (eventType && EVENT_TYPE_MEDIA[eventType]) {
    return EVENT_TYPE_MEDIA[eventType]
  }
  if (!sports || sports.length === 0) return DEFAULT_MEDIA
  const pool: MediaItem[] = []
  const seen = new Set<string>()
  for (const { sport } of sports) {
    for (const item of SPORT_MEDIA[sport] ?? []) {
      if (!seen.has(item.src)) {
        seen.add(item.src)
        pool.push(item)
      }
    }
  }
  return pool.length > 0 ? pool : DEFAULT_MEDIA
}

/** @deprecated Use getMediaForContext({ sports, eventType }) instead. */
export function getMediaForSports(sports: { sport: SportFamily }[] | undefined): MediaItem[] {
  return getMediaForContext({ sports })
}
