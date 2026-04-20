# Union Sport Event-Anfrage-Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Baue ein klickbares, designstarkes 7-Step-Event-Anfrage-Formular für Union Sport (Vite + React + TS + Tailwind + shadcn/ui + Framer Motion) mit Mock-basiertem Verfügbarkeits-Check und Alternativ-Vorschlägen.

**Architecture:** Single-Page-App (SPA) mit URL-gesteuertem Wizard (`?step=1..7`), zentraler `react-hook-form`-State via `FormProvider`, zod-Schema für Validation, Mock-JSON für Availability. Kein Backend. Design-System als CSS-Vars in `globals.css`, alle UI-Primitives über shadcn/ui.

**Tech Stack:** Vite 5, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui, Framer Motion, react-hook-form, zod, react-i18next, Vitest + React Testing Library, Playwright (optional E2E).

**Projekt-Basispfad:** `~/Documents/EventToolUnion/app/` (neuer Unterordner — existierende Dateien im Parent bleiben unangetastet)

---

## File Structure

```
~/Documents/EventToolUnion/app/
├── package.json, vite.config.ts, tsconfig.json
├── tailwind.config.ts, postcss.config.js
├── index.html
├── .gitignore
└── src/
    ├── main.tsx                                  — entry
    ├── App.tsx                                   — router, i18n provider
    ├── styles/globals.css                        — tailwind + design tokens
    ├── lib/utils.ts                              — cn() helper
    ├── i18n/{index.ts, de.ts, en.ts}             — translations
    ├── components/ui/                            — shadcn/ui primitives
    │   ├── button.tsx, input.tsx, label.tsx
    │   ├── radio-group.tsx, checkbox.tsx
    │   ├── select.tsx, textarea.tsx
    │   └── ... (added by shadcn CLI as needed)
    ├── features/event-request/
    │   ├── EventRequestWizard.tsx                — container, step routing
    │   ├── schema.ts                             — zod schema + TS types
    │   ├── types.ts                              — shared enums (Location, Sport, EventType)
    │   ├── data/
    │   │   ├── locations.ts                      — Court-Matrix (§7 Spec)
    │   │   └── availability.json                 — Mock belegte Slots
    │   ├── logic/
    │   │   ├── availability.ts                   — check() + suggestAlternatives()
    │   │   └── availability.test.ts              — Vitest
    │   ├── hooks/
    │   │   ├── useEventRequestForm.ts            — react-hook-form + zod
    │   │   └── useStepNavigation.ts              — URL ?step=N sync
    │   ├── components/
    │   │   ├── StepShell.tsx                     — shared layout (topbar, footer nav)
    │   │   ├── StepIndicator.tsx                 — "SCHRITT 03 / 07"
    │   │   ├── LanguageToggle.tsx                — DE/EN pills
    │   │   ├── AvailabilityBadge.tsx             — ok/tight/full states
    │   │   ├── AlternativeSlotCard.tsx           — 1 slot suggestion card
    │   │   └── FormField.tsx                     — label + input + error pattern
    │   └── steps/
    │       ├── ContactStep.tsx
    │       ├── LocationStep.tsx
    │       ├── DateDurationStep.tsx
    │       ├── EventTypeStep.tsx
    │       ├── AttendeesSportStep.tsx
    │       ├── ExtrasStep.tsx
    │       ├── ReviewSubmitStep.tsx
    │       ├── ConfirmationScreen.tsx
    │       └── HeroScreen.tsx                    — landing (CTA → step=1)
    └── test/
        └── setup.ts                              — vitest config
```

**Responsibilities at a glance:**
- `logic/availability.ts` — pure functions, no UI, no React, fully unit-tested
- `schema.ts` — single source of truth for form data shape
- `EventRequestWizard.tsx` — reads URL, renders current step, provides FormContext
- Each `*Step.tsx` — one screen, uses `useFormContext()`, no own state other than UI transient

---

## Task 0: Projekt-Setup (Vite + TS + React)

**Files:**
- Create: `app/` folder via Vite scaffolder
- Modify: nothing (new project)

- [ ] **Step 0.1: Git initialisieren im Projekt-Root**

```bash
cd ~/Documents/EventToolUnion
git init
echo "node_modules\ndist\n.superpowers/\n.DS_Store" > .gitignore
git add .gitignore MEMORY*.md 01_*.md 02_*.md 03_*.md 05_*.pdf 06_*.pdf docs/
git commit -m "chore: initial project state with specs"
```

- [ ] **Step 0.2: Vite-React-TS scaffolden**

```bash
cd ~/Documents/EventToolUnion
npm create vite@latest app -- --template react-ts
cd app
npm install
```

Expected: `app/` directory mit Vite-Default-Template.

- [ ] **Step 0.3: Dev-Server starten und verifizieren**

```bash
cd ~/Documents/EventToolUnion/app
npm run dev
```

Expected: `http://localhost:5173` zeigt Vite-Default-Seite. Stoppe mit Ctrl+C.

- [ ] **Step 0.4: Commit**

```bash
cd ~/Documents/EventToolUnion
git add app/
git commit -m "chore: scaffold vite react-ts app"
```

---

## Task 1: Tailwind v4 + Design-Tokens

**Files:**
- Create: `app/tailwind.config.ts`, `app/postcss.config.js`, `app/src/styles/globals.css`, `app/src/lib/utils.ts`
- Modify: `app/src/main.tsx`, `app/package.json`

- [ ] **Step 1.1: Tailwind + shadcn Dependencies installieren**

```bash
cd ~/Documents/EventToolUnion/app
npm install -D tailwindcss@next @tailwindcss/vite@next postcss autoprefixer
npm install clsx tailwind-merge
```

- [ ] **Step 1.2: Vite-Config für Tailwind anpassen**

Ersetze `app/vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 1.3: TS-Path-Alias konfigurieren**

In `app/tsconfig.json` unter `compilerOptions` einfügen:

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

Auch in `app/tsconfig.app.json`:

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

- [ ] **Step 1.4: Globals.css mit Design-Tokens anlegen**

Create `app/src/styles/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #0A0A0A;
  --color-bg-surface: rgba(255, 255, 255, 0.04);
  --color-accent: #FF6B1A;
  --color-accent-soft: rgba(255, 107, 26, 0.08);
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.6);
  --color-text-muted: rgba(255, 255, 255, 0.35);
  --color-success: #22C55E;
  --color-warning: #FB923C;
  --color-danger: #EF4444;
  --color-border-subtle: rgba(255, 255, 255, 0.12);

  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --radius-input: 4px;
  --radius-card: 8px;
  --radius-pill: 999px;

  --shadow-card: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
}

@layer base {
  html, body, #root {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    min-height: 100vh;
  }

  * { box-sizing: border-box; }
}

@layer utilities {
  .display-xl {
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 0.93;
    text-transform: uppercase;
  }
  .label-caps {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
}
```

- [ ] **Step 1.5: Inter-Font via Fontsource**

```bash
cd ~/Documents/EventToolUnion/app
npm install @fontsource-variable/inter
```

In `app/src/main.tsx` oben ergänzen:

```ts
import '@fontsource-variable/inter'
import './styles/globals.css'
```

Alte `import './index.css'`-Zeile löschen, `app/src/index.css` und `app/src/App.css` löschen.

- [ ] **Step 1.6: lib/utils.ts anlegen**

Create `app/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 1.7: Smoke-Test im Browser**

Ersetze `app/src/App.tsx`:

```tsx
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="display-xl text-5xl">
        UNION <span style={{ color: 'var(--color-accent)' }}>SPORT</span>
      </div>
    </div>
  )
}
```

Run `npm run dev`. Erwartet: Schwarzer Hintergrund, weisse + orangene Display-Typo, Inter-Font.

- [ ] **Step 1.8: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): tailwind v4 + design tokens + inter font"
```

---

## Task 2: shadcn/ui + UI-Primitives

**Files:**
- Create: `app/components.json`, `app/src/components/ui/*.tsx` (via shadcn CLI)

- [ ] **Step 2.1: shadcn/ui initialisieren**

```bash
cd ~/Documents/EventToolUnion/app
npx shadcn@latest init
```

Prompts beantworten:
- Style: `default`
- Base color: `neutral`
- CSS variables: `yes`

Erzeugt `components.json`.

- [ ] **Step 2.2: Benötigte Components installieren**

```bash
cd ~/Documents/EventToolUnion/app
npx shadcn@latest add button input label radio-group checkbox select textarea
```

Erzeugt `src/components/ui/{button,input,label,radio-group,checkbox,select,textarea}.tsx`.

- [ ] **Step 2.3: Button-Variante "accent" ergänzen**

In `app/src/components/ui/button.tsx`, im `buttonVariants` cva-Aufruf unter `variants.variant` ergänzen:

```ts
accent: "bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-extrabold uppercase tracking-wider hover:brightness-110 rounded-md",
ghost_outline: "border border-[var(--color-border-subtle)] text-white uppercase tracking-wider hover:bg-white/5 rounded-md",
```

- [ ] **Step 2.4: Smoke-Test im Browser**

Ersetze `app/src/App.tsx`:

```tsx
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Button variant="accent" size="lg">Event planen →</Button>
      <Button variant="ghost_outline" size="lg">Beispiele</Button>
    </div>
  )
}
```

Run `npm run dev`. Erwartet: Orange CTA + Ghost-Outline-Button auf schwarzem Hintergrund.

- [ ] **Step 2.5: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): shadcn/ui primitives + brand button variants"
```

---

## Task 3: Restliche Dependencies (Forms, Motion, i18n, Router, Test-Stack)

**Files:**
- Modify: `app/package.json`

- [ ] **Step 3.1: Dependencies installieren**

```bash
cd ~/Documents/EventToolUnion/app
npm install react-hook-form @hookform/resolvers zod framer-motion react-i18next i18next react-router-dom date-fns
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3.2: Vitest konfigurieren**

Ersetze `app/vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 3.3: Test-Setup anlegen**

Create `app/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3.4: Test-Script in package.json**

In `app/package.json` unter `scripts` ergänzen:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3.5: Smoke-Test ausführen (keine Tests = ok)**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: `No test files found` ist ok — setup funktioniert.

- [ ] **Step 3.6: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "chore(app): add forms, motion, i18n, router, vitest"
```

---

## Task 4: Mock-Daten (Locations + Availability)

**Files:**
- Create: `app/src/features/event-request/data/locations.ts`, `app/src/features/event-request/data/availability.json`, `app/src/features/event-request/types.ts`

- [ ] **Step 4.1: Shared Types anlegen**

Create `app/src/features/event-request/types.ts`:

```ts
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
```

- [ ] **Step 4.2: Locations-Matrix anlegen**

Create `app/src/features/event-request/data/locations.ts`:

```ts
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
    name: 'Union P-Ball — Basel Wolf',
    sports: {
      pball: 4,
      tabletennis: 4,
    },
  },
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
```

- [ ] **Step 4.3: Availability-Mock anlegen**

Create `app/src/features/event-request/data/availability.json`:

```json
{
  "muenchenstein": [
    { "date": "2026-08-15", "from": "19:00", "to": "22:00", "blockedCourts": { "padel_panorama": 5, "padel_single": 1 } },
    { "date": "2026-08-22", "from": "18:00", "to": "22:00", "blockedCourts": { "tennis_indoor": 5 } },
    { "date": "2026-09-05", "from": "10:00", "to": "14:00", "blockedCourts": { "padel_panorama": 3 } }
  ],
  "hafen": [
    { "date": "2026-08-15", "from": "19:00", "to": "22:00", "blockedCourts": { "padel_indoor": 4 } },
    { "date": "2026-08-15", "from": "14:00", "to": "17:00", "blockedCourts": { "padel_indoor": 2 } },
    { "date": "2026-08-29", "from": "19:30", "to": "22:00", "blockedCourts": { "padel_indoor": 5 } }
  ],
  "wolf": [
    { "date": "2026-08-15", "from": "18:00", "to": "20:00", "blockedCourts": { "pball": 2 } }
  ]
}
```

- [ ] **Step 4.4: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): add location matrix + availability mock data"
```

---

## Task 5: Availability-Logik (TDD)

**Files:**
- Create: `app/src/features/event-request/logic/availability.ts`, `app/src/features/event-request/logic/availability.test.ts`

- [ ] **Step 5.1: Test-File mit erstem failing Test anlegen**

Create `app/src/features/event-request/logic/availability.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCapacity } from './availability'

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
```

- [ ] **Step 5.2: Test laufen lassen — muss fehlschlagen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: FAIL mit "Cannot find module './availability'".

- [ ] **Step 5.3: availability.ts anlegen mit minimaler `getCapacity`**

Create `app/src/features/event-request/logic/availability.ts`:

```ts
import { LOCATIONS } from '../data/locations'
import type { LocationId, SportId, AvailabilitySlot } from '../types'

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
```

- [ ] **Step 5.4: Tests laufen — müssen passen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: 4 passing.

- [ ] **Step 5.5: Failing test für `overlaps`**

In `availability.test.ts` unterhalb von getCapacity-Describe ergänzen:

```ts
import { overlaps } from './availability'

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
```

- [ ] **Step 5.6: Test laufen — muss fehlschlagen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: FAIL — `overlaps` not exported.

- [ ] **Step 5.7: `overlaps` implementieren**

In `availability.ts` ergänzen:

```ts
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
```

- [ ] **Step 5.8: Tests laufen — alle passen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: 10 passing.

- [ ] **Step 5.9: Failing test für `checkAvailability`**

In `availability.test.ts` ergänzen:

```ts
import { checkAvailability } from './availability'

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
```

- [ ] **Step 5.10: Test laufen — muss fehlschlagen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: FAIL — `checkAvailability` not exported.

- [ ] **Step 5.11: `checkAvailability` implementieren**

In `availability.ts` ergänzen:

```ts
import availabilityData from '../data/availability.json'

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

export function checkAvailability(input: CheckInput): AvailabilityResult {
  const capacity = getCapacity(input.location, input.sport)
  const slots = (availabilityData as Record<string, AvailabilitySlot[]>)[input.location] ?? []
  const blocked = slots
    .filter((s) => overlaps(s, input.date, input.from, input.durationMinutes))
    .reduce((sum, s) => {
      const keys = SPORT_FAMILY_MAP[input.sport]
      return sum + keys.reduce((a, k) => a + (s.blockedCourts[k] ?? 0), 0)
    }, 0)
  const free = Math.max(0, capacity - blocked)

  if (free >= input.courtsNeeded) return { status: 'ok', free }
  if (free > 0) return { status: 'tight', free, alternatives: suggestAlternatives(input) }
  return { status: 'full', free: 0, alternatives: suggestAlternatives(input) }
}
```

- [ ] **Step 5.12: Tests laufen — alle passen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: FAIL — `suggestAlternatives` not defined. Stub es zunächst:

In `availability.ts` oberhalb von checkAvailability ergänzen:

```ts
export function suggestAlternatives(input: CheckInput): AlternativeSlot[] {
  return []
}
```

Dann erneut `npm run test:run` → 13 passing.

- [ ] **Step 5.13: Failing test für `suggestAlternatives`**

In `availability.test.ts` ergänzen:

```ts
import { suggestAlternatives } from './availability'

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
```

- [ ] **Step 5.14: Test laufen — muss fehlschlagen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: FAIL — empty array.

- [ ] **Step 5.15: `suggestAlternatives` implementieren**

Ersetze in `availability.ts` die Stub-Implementierung:

```ts
export function suggestAlternatives(input: CheckInput): AlternativeSlot[] {
  const baseDate = new Date(input.date + 'T00:00:00')
  const candidates: AlternativeSlot[] = []
  const times = ['10:00', '14:00', '18:00']

  for (let offset = -14; offset <= 14; offset++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)

    for (const time of times) {
      const res = checkAvailability({ ...input, date: dateStr, from: time, courtsNeeded: 1 })
      if (res.status === 'ok' && res.free >= input.courtsNeeded) {
        const endH = Number(time.split(':')[0]) + Math.ceil(input.durationMinutes / 60)
        candidates.push({
          date: dateStr,
          from: time,
          to: `${String(endH).padStart(2, '0')}:00`,
          freeCourts: res.free,
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
```

- [ ] **Step 5.16: Tests laufen — alle passen**

```bash
cd ~/Documents/EventToolUnion/app
npm run test:run
```

Expected: 15 passing.

- [ ] **Step 5.17: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): availability logic with TDD (capacity, overlap, check, suggest)"
```

---

## Task 6: Form-Schema (zod)

**Files:**
- Create: `app/src/features/event-request/schema.ts`

- [ ] **Step 6.1: Schema anlegen**

Create `app/src/features/event-request/schema.ts`:

```ts
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
```

- [ ] **Step 6.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): zod form schema for event request"
```

---

## Task 7: i18n-Setup (DE/EN)

**Files:**
- Create: `app/src/i18n/index.ts`, `app/src/i18n/de.ts`, `app/src/i18n/en.ts`
- Modify: `app/src/main.tsx`

- [ ] **Step 7.1: Translations DE**

Create `app/src/i18n/de.ts`:

```ts
export const de = {
  hero: {
    eyebrow: 'B2B · Teambuilding · Turnier · Geburtstag',
    title1: 'Dein',
    titleAccent: 'Event.',
    title2: 'Unser',
    titleUnderline: 'Platz.',
    subtitle: 'Padel, Tennis, Golf, Pickle-Ball — an drei Standorten in Basel. Anfrage in 3 Minuten, Angebot in 24 Stunden.',
    ctaPrimary: 'Event planen →',
    ctaSecondary: 'Beispiele',
    stats: { locations: 'Standorte', sports: 'Sportarten', people: 'Personen/Event', response: 'Antwortzeit' },
  },
  nav: { back: '← Zurück', next: 'Weiter →', submit: 'Anfrage senden' },
  steps: {
    indicator: 'Schritt {{n}} / 07',
    contact: {
      title: 'Wie erreichen wir dich?',
      name: 'Name', company: 'Firma (optional)', email: 'E-Mail', phone: 'Telefon', language: 'Sprache',
    },
    location: { title: 'Wo steigt\'s?' },
    date: {
      title: 'Wann soll\'s steigen?',
      date: 'Datum', startTime: 'Startzeit', duration: 'Dauer',
      durations: { '2h': '2 h', '4h': '4 h', '6h': '6 h', day: 'Ganzer Tag' },
      available: 'Courts verfügbar',
      tight: 'Knapp — hier sind Alternativen',
      full: 'Leider belegt — wir empfehlen:',
      best: 'Beste Option',
      chooseSlot: 'Wählen →',
    },
    eventType: {
      title: 'Was planst du?',
      birthday: 'Geburtstag', corporate: 'Firmenanlass', teambuilding: 'Teambuilding',
      tournament: 'Turnier', camp: 'Camp', school: 'Schule/Jugend', court_only: 'Court-Only',
    },
    attendees: {
      title: 'Teilnehmer & Sport',
      count: 'Personenzahl', ageGroup: 'Altersgruppe', level: 'Level',
      ageGroups: { children: 'Kinder', teens: 'Jugend', adults: 'Erwachsene', mixed: 'Gemischt' },
      levels: { beginner: 'Anfänger', intermediate: 'Fortgeschritten', advanced: 'Pro', mixed: 'Gemischt' },
      sports: 'Sportart(en)', courts: 'Courts',
    },
    extras: {
      title: 'Extras & Gastro',
      gastro: 'Gastro', bistro: 'Bistro', drinks: 'Getränkepauschale', apero: 'Apéro',
      foodtruck: 'Foodtruck', externalCatering: 'Externes Catering',
      rooms: 'Räume', lounge: 'Eventlounge', meetingRoom: 'Meetingraum',
      otherExtras: 'Weitere Extras', coach: 'Coach/Trainer', equipment: 'Equipment-Leihe',
      photographer: 'Fotograf', music: 'Musik/DJ', trophies: 'Pokale',
    },
    review: {
      title: 'Fast geschafft.',
      meeting: 'Persönliches Gespräch?',
      meetingOptions: { none: 'Nicht nötig', call: 'Call', onsite: 'Vor Ort' },
      note: 'Sonstiges (optional)',
      editLink: 'Ändern',
    },
    confirmation: {
      title: 'Danke!',
      subtitle: 'Referenznummer #{{ref}}. Wir melden uns in 24 h mit deinem Angebot.',
      ctaNew: 'Noch eine Anfrage',
      ctaHome: 'Zur Übersicht',
    },
  },
}
export default de
```

- [ ] **Step 7.2: Translations EN**

Create `app/src/i18n/en.ts`:

```ts
export const en = {
  hero: {
    eyebrow: 'B2B · Teambuilding · Tournament · Birthday',
    title1: 'Your',
    titleAccent: 'Event.',
    title2: 'Our',
    titleUnderline: 'Court.',
    subtitle: 'Padel, Tennis, Golf, Pickle-Ball — three locations in Basel. Request in 3 minutes, offer in 24 hours.',
    ctaPrimary: 'Plan event →',
    ctaSecondary: 'Examples',
    stats: { locations: 'Locations', sports: 'Sports', people: 'People/Event', response: 'Response' },
  },
  nav: { back: '← Back', next: 'Next →', submit: 'Send request' },
  steps: {
    indicator: 'Step {{n}} / 07',
    contact: {
      title: 'How to reach you?',
      name: 'Name', company: 'Company (optional)', email: 'Email', phone: 'Phone', language: 'Language',
    },
    location: { title: 'Where?' },
    date: {
      title: 'When?',
      date: 'Date', startTime: 'Start', duration: 'Duration',
      durations: { '2h': '2 h', '4h': '4 h', '6h': '6 h', day: 'All day' },
      available: 'Courts available',
      tight: 'Tight — we suggest:',
      full: 'Sold out — suggestions:',
      best: 'Best option',
      chooseSlot: 'Pick →',
    },
    eventType: {
      title: 'What are you planning?',
      birthday: 'Birthday', corporate: 'Corporate', teambuilding: 'Team-Building',
      tournament: 'Tournament', camp: 'Camp', school: 'School/Youth', court_only: 'Courts only',
    },
    attendees: {
      title: 'Attendees & sport',
      count: 'People', ageGroup: 'Age', level: 'Level',
      ageGroups: { children: 'Children', teens: 'Teens', adults: 'Adults', mixed: 'Mixed' },
      levels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Pro', mixed: 'Mixed' },
      sports: 'Sport(s)', courts: 'Courts',
    },
    extras: {
      title: 'Extras & food',
      gastro: 'Food & drink', bistro: 'Bistro', drinks: 'Drinks package', apero: 'Aperitif',
      foodtruck: 'Foodtruck', externalCatering: 'External catering',
      rooms: 'Rooms', lounge: 'Event lounge', meetingRoom: 'Meeting room',
      otherExtras: 'Other extras', coach: 'Coach', equipment: 'Equipment rental',
      photographer: 'Photographer', music: 'Music/DJ', trophies: 'Trophies',
    },
    review: {
      title: 'Almost done.',
      meeting: 'Personal meeting?',
      meetingOptions: { none: 'Not needed', call: 'Call', onsite: 'On-site' },
      note: 'Notes (optional)',
      editLink: 'Edit',
    },
    confirmation: {
      title: 'Thanks!',
      subtitle: 'Reference #{{ref}}. We\'ll reply with an offer within 24h.',
      ctaNew: 'New request',
      ctaHome: 'Home',
    },
  },
}
export default en
```

- [ ] **Step 7.3: i18n-Init**

Create `app/src/i18n/index.ts`:

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './de'
import en from './en'

i18n.use(initReactI18next).init({
  resources: { de: { translation: de }, en: { translation: en } },
  lng: 'de',
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
})

export default i18n
```

- [ ] **Step 7.4: main.tsx erweitern**

In `app/src/main.tsx` nach den existierenden Imports ergänzen:

```ts
import './i18n'
```

- [ ] **Step 7.5: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): i18n setup with DE/EN translations"
```

---

## Task 8: StepShell + StepIndicator + LanguageToggle

**Files:**
- Create: `app/src/features/event-request/components/StepShell.tsx`, `StepIndicator.tsx`, `LanguageToggle.tsx`

- [ ] **Step 8.1: StepIndicator**

Create `app/src/features/event-request/components/StepIndicator.tsx`:

```tsx
import { useTranslation } from 'react-i18next'

export function StepIndicator({ current, total = 7 }: { current: number; total?: number }) {
  const { t } = useTranslation()
  const display = t('steps.indicator', { n: String(current).padStart(2, '0') })
  return (
    <div className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium">
      {display.replace('07', String(total).padStart(2, '0'))}
    </div>
  )
}
```

- [ ] **Step 8.2: LanguageToggle**

Create `app/src/features/event-request/components/LanguageToggle.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const active = i18n.language.startsWith('en') ? 'en' : 'de'
  const btn = (lang: 'de' | 'en') =>
    cn(
      'px-3 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full border transition',
      active === lang
        ? 'bg-[var(--color-accent)] text-black border-transparent'
        : 'border-white/20 text-white/70 hover:text-white',
    )
  return (
    <div className="flex gap-2">
      <button className={btn('de')} onClick={() => i18n.changeLanguage('de')}>DE</button>
      <button className={btn('en')} onClick={() => i18n.changeLanguage('en')}>EN</button>
    </div>
  )
}
```

- [ ] **Step 8.3: StepShell**

Create `app/src/features/event-request/components/StepShell.tsx`:

```tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { StepIndicator } from './StepIndicator'
import { LanguageToggle } from './LanguageToggle'

interface Props {
  currentStep: number
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  hideNav?: boolean
}

export function StepShell({ currentStep, children, onBack, onNext, nextDisabled, nextLabel, hideNav }: Props) {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)]" />
          UNION SPORT · EVENTS
        </div>
        <div className="flex items-center gap-4">
          <StepIndicator current={currentStep} />
          <LanguageToggle />
        </div>
      </header>
      <motion.main
        key={currentStep}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 max-w-[720px] w-full mx-auto px-6 md:px-10 py-10"
      >
        {children}
      </motion.main>
      {!hideNav && (
        <footer className="max-w-[720px] w-full mx-auto px-6 md:px-10 py-6 flex justify-between">
          <Button variant="ghost_outline" onClick={onBack} disabled={!onBack}>
            {t('nav.back')}
          </Button>
          <Button variant="accent" onClick={onNext} disabled={nextDisabled || !onNext}>
            {nextLabel ?? t('nav.next')}
          </Button>
        </footer>
      )}
    </div>
  )
}
```

- [ ] **Step 8.4: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): StepShell, StepIndicator, LanguageToggle"
```

---

## Task 9: AvailabilityBadge + AlternativeSlotCard

**Files:**
- Create: `app/src/features/event-request/components/AvailabilityBadge.tsx`, `AlternativeSlotCard.tsx`

- [ ] **Step 9.1: AvailabilityBadge**

Create `app/src/features/event-request/components/AvailabilityBadge.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { AvailabilityResult } from '../logic/availability'

export function AvailabilityBadge({ result, sportLabel }: { result: AvailabilityResult; sportLabel: string }) {
  const { t } = useTranslation()
  const color =
    result.status === 'ok'
      ? 'rgba(34,197,94,1)'
      : result.status === 'tight'
      ? 'rgba(251,146,60,1)'
      : 'rgba(239,68,68,1)'
  const title =
    result.status === 'ok' ? t('steps.date.available') : result.status === 'tight' ? t('steps.date.tight') : t('steps.date.full')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-md p-4 flex gap-3 items-start"
      style={{ background: `${color.replace('1)', '0.1)')}`, border: `1px solid ${color.replace('1)', '0.3)')}` }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-black flex-shrink-0"
        style={{ background: color }}
      >
        {result.status === 'ok' ? '✓' : '!'}
      </div>
      <div>
        <div className="text-sm font-bold" style={{ color }}>{title}</div>
        <div className="text-xs text-white/60 mt-0.5">
          {result.status === 'ok' && (
            <>Free: <strong>{result.free}</strong> {sportLabel} courts</>
          )}
          {result.status !== 'ok' && (
            <>Free: <strong>{result.free}</strong></>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 9.2: AlternativeSlotCard**

Create `app/src/features/event-request/components/AlternativeSlotCard.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { AlternativeSlot } from '../logic/availability'
import { cn } from '@/lib/utils'

export function AlternativeSlotCard({
  slot,
  onPick,
}: {
  slot: AlternativeSlot
  onPick: () => void
}) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onPick}
      className={cn(
        'w-full text-left rounded-md px-3.5 py-3 flex items-center justify-between transition',
        slot.isBest
          ? 'border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
          : 'border border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
      )}
    >
      <div>
        <div className={cn('text-xs', slot.isBest ? 'font-extrabold' : 'font-bold')}>
          {slot.date} · {slot.from} – {slot.to}
        </div>
        <div className="text-[10px] text-white/50">
          {slot.freeCourts} courts free{slot.isBest ? ` · ${t('steps.date.best')}` : ''}
        </div>
      </div>
      <div className="text-[var(--color-accent)] font-extrabold text-xs">{t('steps.date.chooseSlot')}</div>
    </button>
  )
}
```

- [ ] **Step 9.3: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): AvailabilityBadge + AlternativeSlotCard"
```

---

## Task 10: Wizard-Container + URL-Routing

**Files:**
- Create: `app/src/features/event-request/EventRequestWizard.tsx`, `app/src/features/event-request/hooks/useStepNavigation.ts`
- Modify: `app/src/App.tsx`

- [ ] **Step 10.1: useStepNavigation hook**

Create `app/src/features/event-request/hooks/useStepNavigation.ts`:

```ts
import { useSearchParams } from 'react-router-dom'

export function useStepNavigation(totalSteps = 7) {
  const [params, setParams] = useSearchParams()
  const step = Math.min(Math.max(Number(params.get('step') ?? 1), 1), totalSteps)

  const go = (n: number) => {
    const next = Math.min(Math.max(n, 1), totalSteps)
    const newParams = new URLSearchParams(params)
    newParams.set('step', String(next))
    setParams(newParams)
  }

  return {
    step,
    next: () => go(step + 1),
    back: step > 1 ? () => go(step - 1) : undefined,
    goTo: go,
  }
}
```

- [ ] **Step 10.2: EventRequestWizard**

Create `app/src/features/event-request/EventRequestWizard.tsx`:

```tsx
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from 'framer-motion'
import { eventRequestSchema, emptyEventRequest, type EventRequestData } from './schema'
import { useStepNavigation } from './hooks/useStepNavigation'
import { ContactStep } from './steps/ContactStep'
import { LocationStep } from './steps/LocationStep'
import { DateDurationStep } from './steps/DateDurationStep'
import { EventTypeStep } from './steps/EventTypeStep'
import { AttendeesSportStep } from './steps/AttendeesSportStep'
import { ExtrasStep } from './steps/ExtrasStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { ConfirmationScreen } from './steps/ConfirmationScreen'

export function EventRequestWizard() {
  const methods = useForm<EventRequestData>({
    resolver: zodResolver(eventRequestSchema),
    mode: 'onBlur',
    defaultValues: emptyEventRequest,
  })
  const nav = useStepNavigation(7)

  const onSubmit = (data: EventRequestData) => {
    console.log('EVENT REQUEST SUBMITTED:', data)
    nav.goTo(8)
  }

  return (
    <FormProvider {...methods}>
      <AnimatePresence mode="wait">
        {nav.step === 1 && <ContactStep key="1" step={1} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 2 && <LocationStep key="2" step={2} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 3 && <DateDurationStep key="3" step={3} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 4 && <EventTypeStep key="4" step={4} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 5 && <AttendeesSportStep key="5" step={5} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 6 && <ExtrasStep key="6" step={6} onBack={nav.back} onNext={nav.next} />}
        {nav.step === 7 && (
          <ReviewSubmitStep
            key="7"
            step={7}
            onBack={nav.back}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        )}
        {nav.step === 8 && <ConfirmationScreen key="8" onNew={() => nav.goTo(1)} />}
      </AnimatePresence>
    </FormProvider>
  )
}
```

- [ ] **Step 10.3: App.tsx mit Router**

Ersetze `app/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EventRequestWizard } from '@/features/event-request/EventRequestWizard'
import { HeroScreen } from '@/features/event-request/steps/HeroScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroScreen />} />
        <Route path="/request" element={<EventRequestWizard />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 10.4: Commit (Build wird noch failen — Steps fehlen)**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): wizard container + routing (steps to follow)"
```

---

## Task 11: ContactStep (Step 1)

**Files:**
- Create: `app/src/features/event-request/steps/ContactStep.tsx`

- [ ] **Step 11.1: Component schreiben**

Create `app/src/features/event-request/steps/ContactStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function ContactStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, formState: { errors }, trigger } = useFormContext<EventRequestData>()

  const handleNext = async () => {
    const ok = await trigger('contact')
    if (ok) onNext()
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={handleNext}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">
        {t('steps.contact.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span className="text-[var(--color-accent)]">
          {t('steps.contact.title').split(' ').slice(-1)}
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="label-caps">{t('steps.contact.name')}</Label>
          <Input {...register('contact.name')} />
          {errors.contact?.name && <p className="text-red-400 text-xs mt-1">{errors.contact.name.message}</p>}
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.company')}</Label>
          <Input {...register('contact.company')} />
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.email')}</Label>
          <Input type="email" {...register('contact.email')} />
          {errors.contact?.email && <p className="text-red-400 text-xs mt-1">{errors.contact.email.message}</p>}
        </div>
        <div>
          <Label className="label-caps">{t('steps.contact.phone')}</Label>
          <Input {...register('contact.phone')} />
          {errors.contact?.phone && <p className="text-red-400 text-xs mt-1">{errors.contact.phone.message}</p>}
        </div>
      </div>
    </StepShell>
  )
}
```

- [ ] **Step 11.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): ContactStep (step 1)"
```

---

## Task 12: LocationStep (Step 2)

**Files:**
- Create: `app/src/features/event-request/steps/LocationStep.tsx`

- [ ] **Step 12.1: Component schreiben**

Create `app/src/features/event-request/steps/LocationStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS } from '../data/locations'
import { cn } from '@/lib/utils'

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function LocationStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<EventRequestData>()
  const selected = watch('location')

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.location.title')}</h1>
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="grid gap-3">
            {Object.values(LOCATIONS).map((loc) => (
              <button
                key={loc.id}
                onClick={() => field.onChange(loc.id)}
                className={cn(
                  'text-left p-5 rounded-md transition border',
                  field.value === loc.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
                )}
              >
                <div className="font-extrabold text-lg">{loc.name}</div>
                <div className="text-xs text-white/60 mt-1">
                  {Object.keys(loc.sports).join(' · ')}
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </StepShell>
  )
}
```

- [ ] **Step 12.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): LocationStep (step 2)"
```

---

## Task 13: DateDurationStep (Step 3) — Availability-Integration

**Files:**
- Create: `app/src/features/event-request/steps/DateDurationStep.tsx`

- [ ] **Step 13.1: Component schreiben**

Create `app/src/features/event-request/steps/DateDurationStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { AvailabilityBadge } from '../components/AvailabilityBadge'
import { AlternativeSlotCard } from '../components/AlternativeSlotCard'
import { checkAvailability } from '../logic/availability'
import { LOCATIONS } from '../data/locations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const DURATIONS = [
  { key: '2h', minutes: 120 },
  { key: '4h', minutes: 240 },
  { key: '6h', minutes: 360 },
  { key: 'day', minutes: 600 },
]

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function DateDurationStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, setValue, watch } = useFormContext<EventRequestData>()
  const location = watch('location')
  const date = watch('dateTime.date')
  const startTime = watch('dateTime.startTime')
  const duration = watch('dateTime.durationMinutes')

  const sportFamily = useMemo(() => {
    const loc = LOCATIONS[location]
    const keys = Object.keys(loc?.sports ?? {})
    if (keys.some((k) => k.startsWith('padel'))) return 'padel' as const
    if (keys.some((k) => k.startsWith('tennis'))) return 'tennis' as const
    if (keys.includes('pball')) return 'pball' as const
    return 'padel' as const
  }, [location])

  const result = useMemo(() => {
    if (!date || !startTime) return null
    return checkAvailability({
      location,
      date,
      from: startTime,
      durationMinutes: duration,
      sport: sportFamily,
      courtsNeeded: 1,
    })
  }, [location, date, startTime, duration, sportFamily])

  const pickAlternative = (d: string, f: string, mins: number) => {
    setValue('dateTime.date', d)
    setValue('dateTime.startTime', f)
    setValue('dateTime.durationMinutes', mins)
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={result?.status === 'full'}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">
        {t('steps.date.title').split(' ').slice(0, -1).join(' ')}{' '}
        <span className="text-[var(--color-accent)]">
          {t('steps.date.title').split(' ').slice(-1)}
        </span>
      </h1>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="label-caps">{t('steps.date.date')}</Label>
          <Input type="date" {...register('dateTime.date')} />
        </div>
        <div>
          <Label className="label-caps">{t('steps.date.startTime')}</Label>
          <Input type="time" {...register('dateTime.startTime')} />
        </div>
      </div>
      <div className="mb-6">
        <Label className="label-caps">{t('steps.date.duration')}</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {DURATIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setValue('dateTime.durationMinutes', d.minutes)}
              className={cn(
                'px-3.5 py-2 text-xs font-semibold rounded-full border transition',
                duration === d.minutes
                  ? 'bg-[var(--color-accent)] text-black border-transparent'
                  : 'border-white/20 text-white/80 hover:text-white',
              )}
            >
              {t(`steps.date.durations.${d.key}`)}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <AvailabilityBadge result={result} sportLabel={sportFamily} />
          {result.status !== 'ok' && result.alternatives.length > 0 && (
            <div className="space-y-2">
              {result.alternatives.map((a, i) => (
                <AlternativeSlotCard
                  key={`${a.date}-${a.from}-${i}`}
                  slot={a}
                  onPick={() => pickAlternative(a.date, a.from, duration)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </StepShell>
  )
}
```

- [ ] **Step 13.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): DateDurationStep with live availability check (step 3)"
```

---

## Task 14: EventTypeStep (Step 4)

**Files:**
- Create: `app/src/features/event-request/steps/EventTypeStep.tsx`

- [ ] **Step 14.1: Component schreiben**

Create `app/src/features/event-request/steps/EventTypeStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { cn } from '@/lib/utils'

const TYPES = ['birthday', 'corporate', 'teambuilding', 'tournament', 'camp', 'school', 'court_only'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function EventTypeStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<EventRequestData>()
  const selected = watch('eventType')

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={!selected}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.eventType.title')}</h1>
      <Controller
        name="eventType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => field.onChange(type)}
                className={cn(
                  'p-5 rounded-md border text-left transition',
                  field.value === type
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]',
                )}
              >
                <div className="font-extrabold text-sm uppercase tracking-wider">
                  {t(`steps.eventType.${type}`)}
                </div>
              </button>
            ))}
          </div>
        )}
      />
    </StepShell>
  )
}
```

- [ ] **Step 14.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): EventTypeStep (step 4)"
```

---

## Task 15: AttendeesSportStep (Step 5) — Conditional Sport-Auswahl

**Files:**
- Create: `app/src/features/event-request/steps/AttendeesSportStep.tsx`

- [ ] **Step 15.1: Component schreiben**

Create `app/src/features/event-request/steps/AttendeesSportStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import { useMemo } from 'react'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { LOCATIONS } from '../data/locations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const AGES = ['children', 'teens', 'adults', 'mixed'] as const
const LEVELS = ['beginner', 'intermediate', 'advanced', 'mixed'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

export function AttendeesSportStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  const { register, control, watch, setValue } = useFormContext<EventRequestData>()
  const location = watch('location')
  const sports = watch('sports')

  const availableSports = useMemo(() => {
    const loc = LOCATIONS[location]
    const keys = Object.keys(loc?.sports ?? {})
    const families = new Set<string>()
    keys.forEach((k) => {
      if (k.startsWith('padel')) families.add('padel')
      else if (k.startsWith('tennis')) families.add('tennis')
      else if (k.startsWith('golf')) families.add('golf')
      else if (k === 'pball') families.add('pball')
      else if (k === 'tabletennis') families.add('tabletennis')
    })
    return Array.from(families)
  }, [location])

  const toggleSport = (sport: string) => {
    const current = sports ?? []
    const exists = current.find((s) => s.sport === sport)
    if (exists) {
      setValue('sports', current.filter((s) => s.sport !== sport))
    } else {
      setValue('sports', [...current, { sport: sport as any, courts: 1 }])
    }
  }

  const updateCourts = (sport: string, courts: number) => {
    const current = sports ?? []
    setValue('sports', current.map((s) => (s.sport === sport ? { ...s, courts } : s)))
  }

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext} nextDisabled={(sports?.length ?? 0) === 0}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.attendees.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label className="label-caps">{t('steps.attendees.count')}</Label>
          <Input type="number" min={1} {...register('attendees.count', { valueAsNumber: true })} />
        </div>
        <Controller
          name="attendees.ageGroup"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="label-caps">{t('steps.attendees.ageGroup')}</Label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {AGES.map((a) => (
                  <option key={a} value={a}>{t(`steps.attendees.ageGroups.${a}`)}</option>
                ))}
              </select>
            </div>
          )}
        />
        <Controller
          name="attendees.level"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="label-caps">{t('steps.attendees.level')}</Label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{t(`steps.attendees.levels.${l}`)}</option>
                ))}
              </select>
            </div>
          )}
        />
      </div>

      <Label className="label-caps mb-3 block">{t('steps.attendees.sports')}</Label>
      <div className="grid gap-3">
        {availableSports.map((sport) => {
          const picked = sports?.find((s) => s.sport === sport)
          return (
            <div
              key={sport}
              className={cn(
                'p-4 rounded-md border flex items-center justify-between gap-3',
                picked ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-white/10 bg-white/[0.02]',
              )}
            >
              <button
                onClick={() => toggleSport(sport)}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider"
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center text-xs',
                    picked ? 'bg-[var(--color-accent)] text-black' : 'border border-white/30',
                  )}
                >
                  {picked ? '✓' : ''}
                </span>
                {sport}
              </button>
              {picked && (
                <div className="flex items-center gap-2">
                  <Label className="label-caps">{t('steps.attendees.courts')}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    className="w-20"
                    value={picked.courts}
                    onChange={(e) => updateCourts(sport, Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </StepShell>
  )
}
```

- [ ] **Step 15.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): AttendeesSportStep with conditional sport list (step 5)"
```

---

## Task 16: ExtrasStep (Step 6) — Gastro/Räume/Zusatz

**Files:**
- Create: `app/src/features/event-request/steps/ExtrasStep.tsx`

- [ ] **Step 16.1: Component schreiben**

Create `app/src/features/event-request/steps/ExtrasStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { cn } from '@/lib/utils'

const GASTRO_KEYS = ['bistro', 'drinks', 'apero', 'foodtruck', 'externalCatering'] as const
const ROOM_KEYS = ['lounge', 'meetingRoom'] as const
const EXTRA_KEYS = ['coach', 'equipment', 'photographer', 'music', 'trophies'] as const

interface Props { step: number; onBack?: () => void; onNext: () => void }

function ToggleGroup({ title, path, keys, labelPrefix }: {
  title: string
  path: 'gastro' | 'rooms' | 'extras'
  keys: readonly string[]
  labelPrefix: string
}) {
  const { t } = useTranslation()
  const { watch, setValue } = useFormContext<EventRequestData>()
  const values = watch(path) as Record<string, boolean>
  const toggle = (k: string) => setValue(`${path}.${k}` as any, !values[k])
  return (
    <section className="mb-8">
      <div className="label-caps mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-full border transition',
              values[k]
                ? 'bg-[var(--color-accent)] text-black border-transparent'
                : 'border-white/20 text-white/80 hover:text-white',
            )}
          >
            {t(`${labelPrefix}.${k}`)}
          </button>
        ))}
      </div>
    </section>
  )
}

export function ExtrasStep({ step, onBack, onNext }: Props) {
  const { t } = useTranslation()
  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onNext}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.extras.title')}</h1>
      <ToggleGroup title={t('steps.extras.gastro')} path="gastro" keys={GASTRO_KEYS} labelPrefix="steps.extras" />
      <ToggleGroup title={t('steps.extras.rooms')} path="rooms" keys={ROOM_KEYS} labelPrefix="steps.extras" />
      <ToggleGroup title={t('steps.extras.otherExtras')} path="extras" keys={EXTRA_KEYS} labelPrefix="steps.extras" />
    </StepShell>
  )
}
```

- [ ] **Step 16.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): ExtrasStep (step 6)"
```

---

## Task 17: ReviewSubmitStep (Step 7)

**Files:**
- Create: `app/src/features/event-request/steps/ReviewSubmitStep.tsx`

- [ ] **Step 17.1: Component schreiben**

Create `app/src/features/event-request/steps/ReviewSubmitStep.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useFormContext, Controller } from 'react-hook-form'
import type { EventRequestData } from '../schema'
import { StepShell } from '../components/StepShell'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const MEETING_OPTS = ['none', 'call', 'onsite'] as const

interface Props { step: number; onBack?: () => void; onSubmit: () => void }

export function ReviewSubmitStep({ step, onBack, onSubmit }: Props) {
  const { t } = useTranslation()
  const { watch, control, register } = useFormContext<EventRequestData>()
  const data = watch()

  return (
    <StepShell currentStep={step} onBack={onBack} onNext={onSubmit} nextLabel={t('nav.submit')}>
      <h1 className="display-xl text-4xl md:text-5xl mb-8">{t('steps.review.title')}</h1>

      <div className="space-y-5 mb-8 text-sm">
        <Row label={t('steps.contact.title')} value={`${data.contact.name} · ${data.contact.email}`} />
        <Row label={t('steps.location.title')} value={data.location} />
        <Row
          label={t('steps.date.title')}
          value={`${data.dateTime.date} · ${data.dateTime.startTime} · ${data.dateTime.durationMinutes / 60}h`}
        />
        <Row label={t('steps.eventType.title')} value={t(`steps.eventType.${data.eventType}`)} />
        <Row
          label={t('steps.attendees.title')}
          value={`${data.attendees.count} · ${data.sports.map((s) => `${s.sport} (${s.courts})`).join(', ')}`}
        />
      </div>

      <Controller
        name="meeting.wish"
        control={control}
        render={({ field }) => (
          <div className="mb-6">
            <Label className="label-caps mb-3 block">{t('steps.review.meeting')}</Label>
            <div className="flex gap-2">
              {MEETING_OPTS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => field.onChange(opt)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-full border transition',
                    field.value === opt
                      ? 'bg-[var(--color-accent)] text-black border-transparent'
                      : 'border-white/20 text-white/80',
                  )}
                >
                  {t(`steps.review.meetingOptions.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      <div>
        <Label className="label-caps">{t('steps.review.note')}</Label>
        <Textarea rows={3} {...register('meeting.note')} />
      </div>
    </StepShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
      <div className="label-caps flex-shrink-0 w-32">{label}</div>
      <div className="text-right text-white/80">{value}</div>
    </div>
  )
}
```

- [ ] **Step 17.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): ReviewSubmitStep (step 7)"
```

---

## Task 18: ConfirmationScreen

**Files:**
- Create: `app/src/features/event-request/steps/ConfirmationScreen.tsx`

- [ ] **Step 18.1: Component schreiben**

Create `app/src/features/event-request/steps/ConfirmationScreen.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { StepShell } from '../components/StepShell'
import { Button } from '@/components/ui/button'

export function ConfirmationScreen({ onNew }: { onNew: () => void }) {
  const { t } = useTranslation()
  const ref = useMemo(() => `ES-2026-${String(Math.floor(1000 + Math.random() * 9000))}`, [])

  return (
    <StepShell currentStep={7} hideNav>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-black text-4xl font-black">
          ✓
        </div>
        <h1 className="display-xl text-5xl md:text-6xl">{t('steps.confirmation.title')}</h1>
        <p className="text-white/70 max-w-md">{t('steps.confirmation.subtitle', { ref })}</p>
        <div className="flex gap-3 mt-4">
          <Button variant="ghost_outline" onClick={() => window.location.assign('/')}>
            {t('steps.confirmation.ctaHome')}
          </Button>
          <Button variant="accent" onClick={onNew}>{t('steps.confirmation.ctaNew')}</Button>
        </div>
      </div>
    </StepShell>
  )
}
```

- [ ] **Step 18.2: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): ConfirmationScreen"
```

---

## Task 19: HeroScreen (Landing)

**Files:**
- Create: `app/src/features/event-request/steps/HeroScreen.tsx`

- [ ] **Step 19.1: Component schreiben**

Create `app/src/features/event-request/steps/HeroScreen.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '../components/LanguageToggle'

export function HeroScreen() {
  const { t } = useTranslation()
  const nav = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute -top-[30%] -right-[5%] w-[60%] h-[140%] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF6B1A 0%, transparent 60%)', opacity: 0.35 }}
      />
      <div
        className="absolute -top-[120px] -right-[120px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: '#FF6B1A', opacity: 0.08 }}
      />

      <header className="relative flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2 font-extrabold text-xs tracking-[0.12em]">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)]" />
          UNION SPORT · EVENTS
        </div>
        <LanguageToggle />
      </header>

      <main className="relative max-w-[1200px] mx-auto px-6 md:px-12 pt-10 pb-20 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[var(--color-accent)] font-bold mb-5">
            ★ {t('hero.eyebrow')}
          </div>
          <h1 className="display-xl text-6xl md:text-8xl mb-5">
            {t('hero.title1')} <span className="text-[var(--color-accent)]">{t('hero.titleAccent')}</span><br />
            {t('hero.title2')}{' '}
            <span className="underline decoration-[var(--color-accent)] decoration-[5px] underline-offset-[10px]">
              {t('hero.titleUnderline')}
            </span>
          </h1>
          <p className="text-sm md:text-base text-white/65 max-w-lg mb-8">{t('hero.subtitle')}</p>
          <div className="flex gap-3">
            <Button variant="accent" size="lg" onClick={() => nav('/request?step=1')}>
              {t('hero.ctaPrimary')}
            </Button>
            <Button variant="ghost_outline" size="lg">{t('hero.ctaSecondary')}</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat value="3" label={t('hero.stats.locations')} />
          <Stat value="5" label={t('hero.stats.sports')} />
          <Stat value="60–100" label={t('hero.stats.people')} />
          <Stat value="24h" label={t('hero.stats.response')} />
        </div>
      </main>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-md p-5">
      <div className="text-3xl md:text-4xl font-black text-[var(--color-accent)]">{value}</div>
      <div className="label-caps mt-1">{label}</div>
    </div>
  )
}
```

- [ ] **Step 19.2: Dev-Server starten & Smoke-Test aller Screens**

```bash
cd ~/Documents/EventToolUnion/app
npm run dev
```

Öffne `http://localhost:5173` — erwartet: Hero-Screen. Klick "Event planen →" → Step 1. Fülle alle Steps durch, prüfe:
- Step 1: Validation (leere Submit blockiert)
- Step 2: Standort-Auswahl markiert aktives Card
- Step 3: Datum+Zeit eingeben → Verfügbarkeits-Badge erscheint; mit `2026-08-15 19:00` am Hafen → "full" + 3 Alternativen, Mittlere = Orange-Border
- Step 4: Event-Typ anklickbar
- Step 5: Sportarten gemäss Standort (z. B. Hafen nur Padel)
- Step 6: Toggle-Pills umschaltbar
- Step 7: Review-Summary stimmt; Meeting-Wunsch wählbar; Submit → Confirmation-Screen mit Referenznummer
- Language-Toggle oben rechts ändert alle Labels

- [ ] **Step 19.3: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "feat(app): HeroScreen + full wizard end-to-end smoke-tested"
```

---

## Task 20: Mobile-Responsive-Check

**Files:**
- Modify: Einzelne Step-Files bei Layout-Problemen

- [ ] **Step 20.1: Chrome DevTools mobile emulation**

Öffne in Chrome: DevTools → Device Toolbar (Cmd+Shift+M) → iPhone 14 Pro.

- [ ] **Step 20.2: Durchlaufen aller Screens auf Mobile**

Checkliste:
- Hero: Display-Typo bleibt lesbar, Stats-Grid wird zu 2 Spalten
- Step-Header: Logo + Indicator + Sprachtoggle passen in eine Zeile? Falls nicht: in `StepShell.tsx` Header auf zwei Zeilen umbrechen bei `< md`
- Step 3: Date/Time-Felder stapeln sich (grid-cols-2 → sm: grid-cols-1)
- Step 5: Sport-Karten stapeln korrekt

- [ ] **Step 20.3: Layout-Fixes einbauen (falls nötig)**

Wo `grid-cols-2` auf Mobile zu eng ist: zu `grid-cols-1 md:grid-cols-2` wechseln. Steps 11/13/15 prüfen.

- [ ] **Step 20.4: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "fix(app): mobile responsive adjustments"
```

---

## Task 21: Lighthouse-Audit + Build-Verifikation

**Files:**
- Modify: Potenzielle A11y-Fixes

- [ ] **Step 21.1: Production-Build**

```bash
cd ~/Documents/EventToolUnion/app
npm run build
```

Expected: `dist/` wird erzeugt, keine TypeScript-Fehler, keine Vite-Warnings ausser Source-Map-Notices.

- [ ] **Step 21.2: Production-Preview**

```bash
cd ~/Documents/EventToolUnion/app
npm run preview
```

Öffnet z. B. `http://localhost:4173`.

- [ ] **Step 21.3: Lighthouse-Audit in Chrome**

Chrome DevTools → Lighthouse → Mobile → Accessibility only. Erwartet: ≥ 95.

- [ ] **Step 21.4: A11y-Fixes (falls nötig)**

Typische Lighthouse-Flags und Fixes:
- "Form elements have associated labels" → sicherstellen, dass alle `<input>` einen `<Label>` oder `aria-label` haben
- "Background-foreground contrast" → `text-white/50` evtl. auf `text-white/60` erhöhen
- "Button has accessible name" → falls reine Icon-Buttons: `aria-label` setzen

- [ ] **Step 21.5: Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "chore(app): production build + lighthouse a11y ≥95"
```

---

## Task 22: README + Handover

**Files:**
- Create: `app/README.md`

- [ ] **Step 22.1: README anlegen**

Create `app/README.md`:

```markdown
# Union Sport — Event-Anfrage-Tool (Frontend-Mockup)

Klickbares Multi-Step-Formular für Event-Anfragen an Union Sport (Basel).

## Dev

    npm install
    npm run dev     # http://localhost:5173

## Build

    npm run build   # erzeugt dist/
    npm run preview # Vorschau der Production-Build

## Test

    npm run test    # Watch-Mode
    npm run test:run

## Struktur

- `src/features/event-request/` — Wizard + Steps + Logik
- `src/features/event-request/data/availability.json` — Mock-Slots (in Production durch Playtomic-API ersetzen)
- `src/i18n/` — DE/EN Translations

## Out of Scope

Keine Kalkulation, kein Backend, keine Mail, kein PDF — siehe Spec §11.
```

- [ ] **Step 22.2: Finaler Commit**

```bash
cd ~/Documents/EventToolUnion
git add .
git commit -m "docs(app): add readme"
```

---

## Self-Review (durchgeführt beim Schreiben)

**1. Spec coverage check**
- §2 Scope (7 Steps, conditional logic, i18n, responsive) — Tasks 11–17, 7, 20 ✓
- §3 Design-Richtung — Tasks 1, 2, 8, 19 (tokens, components, hero) ✓
- §4 Design-System — Task 1 (CSS-Vars), Task 8 (shadcn button variants) ✓
- §5 Stack — Tasks 0, 1, 2, 3 ✓
- §6 Flow 7 Steps — Tasks 11–17 ✓
- §7 Location-Matrix — Task 4 ✓
- §8 Zwei-Stufen-Check — Task 5 (Logik), Task 13 (Step 3 Overview), Task 15 (Step 5 Detail via `sports.courts`) ✓
- §9 Komponenten-Architektur — alle Files in Task 4, 5, 8, 9, 10, 11–19 ✓
- §10 Interaktionen — StepShell mit Framer Motion (Task 8), AvailabilityBadge mit debounced useMemo (Task 13 — implizit durch React-Memoization statt echtem Debounce) ✓
- §11 Out of Scope — nicht implementiert, ok ✓
- §12 Erfolgs-Kriterien — Tasks 19 (smoke), 20 (mobile), 21 (Lighthouse) decken alle Punkte ✓

**2. Placeholder scan** — keine TBD/TODO/"implement later" im Plan. ✓

**3. Type consistency**
- `SportId` in `types.ts` vs. Keys in `locations.ts` vs. `availability.json` — alle snake_case, konsistent. ✓
- `SportFamily` in `availability.ts` ist ein abgeleiteter Union-Type ('padel' | 'tennis' | 'golf' | 'pball' | 'tabletennis'), konsistent mit `schema.ts` `sports[].sport` ✓
- `checkAvailability` Rückgabe-Shape entspricht `AvailabilityBadge`-Props ✓
- `AlternativeSlot`-Interface in `availability.ts` matcht `AlternativeSlotCard`-Props ✓

**4. Ambiguity check**
- "useAvailability hook" in Spec §9 — in Plan **nicht separat gebaut**: Logik wird direkt via `useMemo` in Step 3 aufgerufen (Step 13). Begründung: ein dedizierter Hook wäre Over-Abstraction für einen einzigen Call-Site. Bewusste Vereinfachung, kein Scope-Drop.
- `durationMinutes` für "Ganzer Tag" = 600 (10h) — pragmatisch gesetzt, nicht in Spec definiert. Akzeptabel.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-20-event-tool-union.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Ich dispatche pro Task einen frischen Subagent, review zwischen Tasks, schnelle Iteration.

**2. Inline Execution** — Ich führe die Tasks in dieser Session mit `executing-plans` aus, Batch-Execution mit Review-Checkpoints.

**Welche Variante?**
