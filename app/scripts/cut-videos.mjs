import { spawnSync } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const APP_ROOT = resolve(__dirname, '..')
const PUBLIC = resolve(APP_ROOT, 'public', 'videos')

const DOWNLOADS = '/Users/yannisgisler/Downloads'

const SRC = {
  gondi:        `${DOWNLOADS}/Gondi Hype Final.mp4`,
  sommerfest:   `${DOWNLOADS}/Sommerfest Video..mp4`,
  muenchenstein:`${DOWNLOADS}/Münchenstein Web Final.mp4`,
  pb:           `${DOWNLOADS}/PB reel v1.mp4`,
  // WhatsApp video, displayed as portrait 720x1280 via rotation=-90 metadata.
  neon2:        `${DOWNLOADS}/WhatsApp Video 2026-05-11 at 23.51.28.mp4`,
  // Native portrait 720x1280 Instagram-Story clip (12.7s, includes Story-bake-in).
  neonStory:    `${DOWNLOADS}/b7612f1163d24fa0bb959a632637b1ea (1).mov`,
  // Tennis Promo Final long — 4K UHD landscape, 97s, premium marketing piece.
  tennisLong:   `${DOWNLOADS}/Tennis Promo Final (long version).mp4`,
}

// Each cut: { src, ss (start seconds), t (duration seconds), out (relative path under public/videos), portrait (true to center-crop horizontal slice) }
// Sub-agents reported some timestamps wrong (Gondi+Sommerfest: 2× too late; Münchenstein: ~4s shift)
// Verified via direct frame inspection. Frame N at fps=1/1.5 → real time ≈ (N − 0.5) × 1.5s
// (Gondi: 36s · Sommerfest: 81s · Münchenstein: 39s · PB reel: 43s · Neon: 12.8s)
const CUTS = [
  // PADEL — Title-Overlays vermeiden (Gondi-Video hat "COURTS"/"5"/"GOOD"/"UNION PADEL"-Bake-ins)
  { src: 'gondi',         ss:    3, t: 2,   out: 'sports/padel/padel-01.mp4' }, // Indoor-Sweep (gekürzt vor "5/COURTS"-Title)
  { src: 'gondi',         ss:   17, t: 3,   out: 'sports/padel/padel-02.mp4' }, // Schmash WOW (gekürzt vor Banquet-Hall-Szenenwechsel)
  { src: 'gondi',         ss:   22, t: 3,   out: 'sports/padel/padel-03.mp4' }, // Sneaker-Detail (sauber)
  { src: 'gondi',         ss:   25, t: 2,   out: 'sports/padel/padel-04.mp4' }, // High-Five (gekürzt vor "GOOD"-Text-Overlay)
  // padel-05 (Drei lachende) entfernt — Gondi-Source schneidet bereits ab ~31s zum "UNION PADEL"-Outro-Card.
  { src: 'sommerfest',    ss:    4, t: 4,   out: 'sports/padel/padel-07.mp4' }, // Padel-Match Outdoor mit Zuschauern

  // TENNIS — Münchenstein-Source nur noch für Indoor-Action ohne Title-Bleed
  // tennis-01 (Drohne Sandplatz, ss=5.5) entfernt — "TENNIS"-Title-Overlay direkt am Anfang
  // tennis-02 (Indoor Wilson, ss=7.5) entfernt — "INDOOR/TENNIS"-Title-Overlays im Schnittfenster
  { src: 'sommerfest',    ss:   10, t: 4,   out: 'sports/tennis/tennis-03.mp4' }, // Tennis Indoor Spielerin + Männer-Handshake
  { src: 'sommerfest',    ss:   13, t: 2,   out: 'sports/tennis/tennis-04.mp4' }, // Tennis-Volley Nadal-Shirt
  { src: 'muenchenstein', ss: 27.5, t: 2,   out: 'sports/tennis/tennis-05.mp4' }, // Tennis-Spielerin in Bewegung Indoor (sauber, kein Title in 27.5-29.5s)

  // TENNIS Promo Final (Long, 4K UHD) — premium marketing cuts
  { src: 'tennisLong',    ss:    2, t: 3,   out: 'sports/tennis/tennis-06.mp4' }, // Wilson Ball-Dose Close-Up (Equipment Detail)
  { src: 'tennisLong',    ss:   10, t: 3,   out: 'sports/tennis/tennis-07.mp4' }, // Lachende Spielerin Indoor (Social)
  { src: 'tennisLong',    ss:   14, t: 2.5, out: 'sports/tennis/tennis-08.mp4' }, // Spielerin in Bewegung vor Graffiti (Action)
  { src: 'tennisLong',    ss:   35, t: 2,   out: 'sports/tennis/tennis-09.mp4' }, // Forehand Hero Female (Money-Shot, ss shifted from 34 → 35 to skip "4"-Chapter-Badge)
  { src: 'tennisLong',    ss:   42, t: 2.5, out: 'sports/tennis/tennis-10.mp4' }, // Lachende Spielerin Outdoor (Social-Moment)
  { src: 'tennisLong',    ss:   58, t: 3,   out: 'sports/tennis/tennis-11.mp4' }, // Backhand Outdoor vor Bäumen (Action)
  // tennis-12 (Forehand Graffiti) lag im korrupten Bereich der Source-Datei (NAL-Fehler ~88s), ausgelassen.

  // GOLF — clean Halle-Window erst ab 13.0s (nach Fade-Out des "GOLF"-Title-Overlays)
  { src: 'muenchenstein', ss: 13.0, t: 2,   out: 'sports/golf/golf-01.mp4' }, // Driving Range Halle Wide + SportsCoach Simulator (mit Source-Scene-Cut bei 13.5s)

  // PICKLEBALL (portrait, timestamps korrekt)
  { src: 'pb', ss: 10, t: 6, out: 'sports/pball/pball-01.mp4', portrait: true }, // Hero Jubel + Architektur
  { src: 'pb', ss: 17, t: 6, out: 'sports/pball/pball-02.mp4', portrait: true }, // Backhand-Slice
  { src: 'pb', ss: 30, t: 7, out: 'sports/pball/pball-03.mp4', portrait: true }, // Doppel-Rally Scoreboard
  { src: 'pb', ss:  1, t: 7, out: 'sports/pball/pball-04.mp4', letterbox: true }, // Pickleball-Corner-Halle Establisher (Letterbox + Blur-Backdrop für volle Hallenübersicht)
  { src: 'pb', ss:  8, t: 6, out: 'sports/pball/pball-05.mp4', portrait: true }, // Studio-Portraits

  // DEFAULT (pre-sport)
  { src: 'sommerfest',    ss:   54, t: 5, out: 'default/default-01.mp4' }, // DJ-Pult + Tanzgruppe HERO
  { src: 'sommerfest',    ss:   14, t: 4, out: 'default/default-02.mp4' }, // Lichterketten-Lauf
  { src: 'sommerfest',    ss:   21, t: 5, out: 'default/default-03.mp4' }, // Apéro→DJ→Tanz
  { src: 'sommerfest',    ss:   29, t: 3, out: 'default/default-04.mp4' }, // Töggeli + Lounge
  { src: 'sommerfest',    ss:   31, t: 3, out: 'default/default-05.mp4' }, // Grill-Closeup
  // default-06 (Drohne UNION HAFEN) komplett entfernt — Source startet sofort mit "UNION/HAFEN/PADEL"-Title-Burn-in, kein clean Schnittfenster.
  { src: 'muenchenstein', ss:    0, t: 2, out: 'default/default-07.mp4' }, // Drohne Anlage Establishing (vor PADEL Title)

  // NEON PADEL — all from neon2 (WhatsApp clip, displayed-portrait 720x1280)
  // Marketing-style only: clean composition, focused subjects, no blurry walk-throughs.
  // portrait: true → center horizontal slice cropped to 1280x720 landscape.
  // crf: 19 → slightly higher quality than default (23) for hero-pool footage.
  { src: 'neon2', ss: 0.5,  t: 2.5, out: 'event/neon_padel/neon-01.mp4', portrait: true, crf: 19 }, // UNION PADEL Flag (Branding Hero)
  { src: 'neon2', ss: 18.5, t: 3,   out: 'event/neon_padel/neon-02.mp4', portrait: true, crf: 19 }, // Rally durch Court-Zaun (Action)
  { src: 'neon2', ss: 24,   t: 3,   out: 'event/neon_padel/neon-03.mp4', portrait: true, crf: 19 }, // Architektur-Walkway Wide (Establishing)
  { src: 'neon2', ss: 28.5, t: 3.5, out: 'event/neon_padel/neon-04.mp4', portrait: true, crf: 19 }, // SIGNATURE: Spielerin + glühender Ball am Netz (Money-Shot)
  { src: 'neon2', ss: 32,   t: 2.5, out: 'event/neon_padel/neon-05.mp4', portrait: true, crf: 19 }, // Rally-Fortsetzung mit Player + Ball-Trail
  { src: 'neon2', ss: 6,    t: 3,   out: 'event/neon_padel/neon-06.mp4', portrait: true, crf: 19 }, // Venue-Pan: Lounge + DJ-Booth (Architektur)

  // Default-Pool Neon-Atmosphere (DJ-Setup, portrait-cropped)
  { src: 'neon2', ss: 3,    t: 5,   out: 'default/default-08-neonatmo.mp4', portrait: true, crf: 20 }, // DJ-Booth + UV-Atmosphäre

  // NEON STORY — original IG-Story clip, kept native portrait for "Story Mode" layout.
  // `cropTop: 160` removes the burned-in @union.padel.basel username + 0:NN countdown
  // that sit in the upper ~12% of the source frame.
  { src: 'neonStory', ss: 0, t: 12.5, out: 'event/neon_padel/neon-story.mp4', keepPortrait: true, cropTop: 160, crf: 19, sat: 1.18, contrast: 1.05 },
]

const VIDEO_FILTER_LANDSCAPE = 'scale=1280:-2:flags=lanczos'
// Portrait → take central horizontal slice for 16:9 framing
// Crop the source so that height = width * 9/16, then scale to 1280x720
const VIDEO_FILTER_PORTRAIT = 'crop=in_w:in_w*9/16,scale=1280:720:flags=lanczos'
// Portrait → fit FULL portrait into 16:9 frame with blurred backdrop fill.
// Used for "übersichtlich"-style cuts where we want to see the whole portrait scene.
const VIDEO_FILTER_LETTERBOX =
  '[0:v]split[bg][fg];' +
  '[bg]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=28:6,eq=brightness=-0.18:saturation=0.55[bg2];' +
  '[fg]scale=-2:720:flags=lanczos[fg2];' +
  '[bg2][fg2]overlay=(W-w)/2:0'

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  if (r.status !== 0) {
    const stderr = (r.stderr ?? '').toString()
    throw new Error(`${cmd} ${args.join(' ')}\n${stderr}`)
  }
  return r
}

async function processCut(cut) {
  const srcPath = SRC[cut.src]
  if (!srcPath) throw new Error(`Unknown source: ${cut.src}`)
  const outPath = join(PUBLIC, cut.out)
  await mkdir(dirname(outPath), { recursive: true })

  // Pick filter: keepPortrait = no aspect crop, native portrait + optional top-crop + eq grade
  // letterbox = fit FULL portrait inside 16:9 with blurred backdrop (übersichtlicher)
  // portrait = center-crop horizontal slice to 1280x720 landscape
  // (default) = scale to 1280p landscape (assumes source is already landscape)
  let filter
  let useFilterComplex = false
  if (cut.keepPortrait) {
    const parts = []
    if (cut.cropTop) {
      // chop N pixels off the top of the source frame (removes burned-in overlays)
      parts.push(`crop=in_w:in_h-${cut.cropTop}:0:${cut.cropTop}`)
    }
    const eqParts = []
    if (cut.sat != null) eqParts.push(`saturation=${cut.sat}`)
    if (cut.contrast != null) eqParts.push(`contrast=${cut.contrast}`)
    if (cut.brightness != null) eqParts.push(`brightness=${cut.brightness}`)
    if (eqParts.length > 0) parts.push(`eq=${eqParts.join(':')}`)
    filter = parts.length > 0 ? parts.join(',') : 'null'
  } else if (cut.letterbox) {
    filter = VIDEO_FILTER_LETTERBOX
    useFilterComplex = true
  } else if (cut.portrait) {
    filter = VIDEO_FILTER_PORTRAIT
  } else {
    filter = VIDEO_FILTER_LANDSCAPE
  }
  const crf = cut.crf != null ? String(cut.crf) : '23'
  const args = [
    '-y',
    '-ss', String(cut.ss),
    '-i', srcPath,
    '-t', String(cut.t),
    useFilterComplex ? '-filter_complex' : '-vf', filter,
    '-c:v', 'libx264',
    '-profile:v', 'main',
    '-preset', 'medium',
    '-crf', crf,
    '-movflags', '+faststart',
    '-an',
    outPath,
  ]
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args])

  // Poster: extract mid-frame as PNG (codec-independent), then sharp → webp
  const tmpPng = outPath.replace(/\.mp4$/, '-poster.png')
  run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error',
    '-y',
    '-ss', String(cut.ss + cut.t / 2),  // mid-frame, more representative
    '-i', srcPath,
    useFilterComplex ? '-filter_complex' : '-vf', filter,
    '-frames:v', '1',
    tmpPng,
  ])
  const webpPath = tmpPng.replace(/\.png$/, '.webp')
  await sharp(tmpPng).webp({ quality: 80 }).toFile(webpPath)
  await rm(tmpPng, { force: true })

  return outPath
}

async function main() {
  // Only wipe the script-managed subfolders — keep root-level hero videos intact
  for (const sub of ['sports', 'default', 'event']) {
    await rm(join(PUBLIC, sub), { recursive: true, force: true })
  }
  await mkdir(PUBLIC, { recursive: true })

  let total = 0
  let totalBytes = 0
  for (const cut of CUTS) {
    const out = await processCut(cut)
    const { statSync } = await import('node:fs')
    const sz = statSync(out).size
    totalBytes += sz
    total++
    console.log(`✓ ${cut.out}  ${cut.t}s  ${(sz / 1024).toFixed(0)} KB`)
  }
  console.log(`\n${total} cuts, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`)
}

main().catch((e) => { console.error(e); process.exit(1) })
