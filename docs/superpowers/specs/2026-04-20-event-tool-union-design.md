# Design-Spec: Union Sport Event-Anfrage-Tool

**Datum:** 2026-04-20
**Autor:** Yannis Gisler (mit Claude Opus 4.7)
**Status:** Approved – bereit für Implementation-Plan
**Projekt-Ordner:** `~/Documents/EventToolUnion/`

---

## 1. Ziel

Ein klickbares, designstarkes Frontend-Mockup eines mehrstufigen Event-Anfrage-Formulars für **www.union-sport.ch**, das die heute telefonisch/per E-Mail unstrukturiert eingehenden Event-Anfragen (2–3/Tag, Privat + Firmen, Bandbreite 5h-Court bis Ganztagesevent für 60–100 Personen) strukturiert erfasst.

Das Mockup dient als **Demonstrator gegenüber Union Sport**: Proof, dass Form-UX + Verfügbarkeitscheck + Review-Flow in einem einzigen Tool abbildbar sind. Der aktuelle Scope schliesst Backend, Kalkulation, Mail-Versand und PDF-Generierung aus (siehe §11 Out of Scope).

## 2. Scope (confirmed)

**In Scope (Scope-Level B):**
- Komplettes 7-Step-Multi-Step-Formular
- Conditional Logic (Feld-Sichtbarkeit abhängig von Vorantworten)
- Client-seitige Validierung
- Verfügbarkeits-Check gegen Mock-JSON-Datensatz, inkl. Alternativvorschläge bei Konflikt
- Review-Screen + Confirmation-Screen
- Sprach-Toggle DE/EN (Content-Labels)
- Responsive Desktop + Mobile

**Nicht in Scope** (§11): Kalkulation, Backend-Submit, Mail, PDF, CRM-Integration, Playtomic-API.

## 3. Design-Richtung

**"Energy / Sport-Editorial" (Option C, abgenickt)**

- **Dark-first**, Jet Black `#0A0A0A` als Grundfläche
- **Signal Orange `#FF6B1A`** als einzige Akzentfarbe (Union-Sport-Brand)
- **Inter 900 uppercase** für Display-Typo, tight tracking (`letter-spacing: -0.035em`)
- **Inter 400–600** für Body
- **Kreis-Shape** als Logo-DNA + radialer Orange-Glow im Hero
- Bold Off-White (`#FAFAF7`) als Kontrastfläche optional (Review-Screen)
- Körnung/Noise-Textur **nicht** (bleibt clean)

**Motion-Prinzip (Framer Motion):**
- Step-Transitions: horizontaler Slide (400ms, ease-out)
- Feedback-Animationen bei Verfügbarkeits-Check: 200ms Fade + Scale-in
- Keine dekorativen Animationen

## 4. Design-System

| Token | Wert |
|---|---|
| **Color: bg.primary** | `#0A0A0A` |
| **Color: bg.surface** | `rgba(255,255,255,0.04)` |
| **Color: accent** | `#FF6B1A` |
| **Color: text.primary** | `#FFFFFF` |
| **Color: text.secondary** | `rgba(255,255,255,0.6)` |
| **Color: text.muted** | `rgba(255,255,255,0.35)` |
| **Color: success** | `#22C55E` |
| **Color: warning** | `#FB923C` |
| **Color: border.subtle** | `rgba(255,255,255,0.12)` |
| **Font Family** | Inter (var), System-Fallback |
| **Display Weight/Case** | 900, UPPERCASE, `tracking-tight` |
| **Body Weight** | 400/500/600 |
| **Radius: input** | 4px |
| **Radius: card** | 6–8px |
| **Radius: pill** | 999px |
| **Shadow** | `0 30px 60px -20px rgba(0,0,0,0.6)` (Card-Layer) |
| **Container max-width** | 720px (Form), 1200px (Hero) |
| **Grid gutter** | 24px desktop / 16px mobile |

**Logo-Behandlung:** Kreis (14px–28px) in Signal Orange, links neben Wortmarke `UNION SPORT · EVENTS`.

## 5. Tech-Stack

| Layer | Tech | Begründung |
|---|---|---|
| Build/Dev | **Vite** | Schneller HMR, null-config |
| Framework | **React 19 + TypeScript** | Component-Reuse, type-safe State |
| Styling | **Tailwind CSS v4** | Utility-first, konsistent |
| Komponenten | **shadcn/ui** | Accessible Primitives (Radix-basiert), vollständig customisierbar |
| Motion | **Framer Motion** | Step-Transitions, Feedback-Animationen |
| Forms | **react-hook-form + zod** | Declarative Validation, gutes DX bei Conditional Logic |
| Routing | **wouter** oder **React Router v7** | Deep-Linking auf Steps (`/?step=3`) |
| i18n | **react-i18next** oder eigener Context | DE/EN-Toggle |

## 6. Formular-Flow (7 Schritte)

| # | Screen | Pflichtfelder | Optional / Conditional |
|---|---|---|---|
| 1 | **Kontakt** | Name, E-Mail, Telefon, Sprache | Firma (optional) |
| 2 | **Standort** | Standort (Radio: Münchenstein / Basel Hafen / Basel Wolf) | – |
| 3 | **Datum + Dauer** | Datum, Startzeit, Dauer | *Verfügbarkeits-Check* |
| 4 | **Event-Typ** | Typ (Geburtstag / Firma / Teambuilding / Turnier / Camp / Schule / Court-Only) | – |
| 5 | **Teilnehmer + Sport + Courts** | Personenzahl, Altersgruppe, Level, Sportart(en), Court-Anzahl | Sportart-Auswahl **conditional zu Standort** (siehe §7) |
| 6 | **Gastro + Räume + Zusatz** | – (alle optional) | Bistro/Foodtruck/Catering · Lounge/Meetingraum · Coach/Equipment/Fotograf/Musik/Pokale |
| 7 | **Review + Meeting + Submit** | Meeting-Wunsch (Call/Vor-Ort/Nein) | Freitext "Sonstiges" |

**Conditional Logic (Stichproben):**
- Step 5: Sportart-Liste = Schnittmenge aus Sportarten des in Step 2 gewählten Standorts
- Step 5: Court-Max = Kapazität des Standorts für die gewählte Sportart (siehe §7)
- Step 6: Detailfragen zu Gastro erscheinen nur, wenn Option angewählt
- Step 7: Review-Zusammenfassung rendert alle vorherigen Antworten read-only mit "Ändern"-Link

## 7. Standort-Matrix (Kapazitäten)

```json
{
  "muenchenstein": {
    "name": "Union Sport Münchenstein",
    "sports": {
      "padel": { "panorama": 5, "single": 1 },
      "tennis": { "indoor": 5, "outdoor": 2 },
      "golfSim": 3,
      "golfRange": 5,
      "puttingGreen": 1
    }
  },
  "hafen": {
    "name": "Union Padel – Basel Hafen",
    "sports": {
      "padel": { "indoor": 5 }
    }
  },
  "wolf": {
    "name": "Union P-Ball – Basel Wolf",
    "sports": {
      "pball": 4,
      "tabletennis": 4
    }
  }
}
```

> Hinweis: "pball" = P-Ball (Sportart-Key); Anzeige-Label im UI ist "Pickle-Ball". Der Key wurde so gewählt, um Hook-Kollisionen mit Python-Serialisierungs-Warnungen zu vermeiden – rein technisch, keine Marken-Relevanz.

Quelle: `01_union_sport_infos.md` + User-Bestätigung (4 P-Ball-Courts) vom 2026-04-20.

## 8. Verfügbarkeits-Check (Mock-Logik)

**Datenquelle:** `src/data/availability.json` — statisches File mit einer Liste belegter Zeitfenster pro Standort.

```json
{
  "muenchenstein": [
    { "date": "2026-08-15", "from": "19:00", "to": "22:00",
      "blockedCourts": { "padel": 6 } }
  ],
  "hafen": [
    { "date": "2026-08-15", "from": "19:00", "to": "22:00",
      "blockedCourts": { "padel": 4 } }
  ]
}
```

**Algorithmus (pseudo):**

```ts
function check(location, date, from, duration, sport, courtsNeeded) {
  const capacity = getCapacity(location, sport)
  const overlapping = availability[location].filter(overlaps(date, from, duration))
  const blocked = sum(overlapping, e => e.blockedCourts[sport] ?? 0)
  const free = capacity - blocked

  if (free >= courtsNeeded) return { status: 'ok', free }
  if (free > 0)              return { status: 'tight', free, alternatives: suggestAlternatives(...) }
  return                         { status: 'full', alternatives: suggestAlternatives(...) }
}
```

**Alternativen-Generator:** Sucht in `availability.json` die nächsten 3 freien Slots innerhalb ±14 Tage um das Wunschdatum, sortiert nach Nähe zum Original-Wunsch. Markiert die beste Option (nächste am Wunschdatum + voll frei) visuell als "Beste Option" (Orange-Border).

**Zwei-Stufen-Check (wichtig):**

- **Step 3 (Overview-Check):** Personenzahl und Sportart sind noch nicht bekannt. Der Check zeigt daher pro Sportart des Standorts, wie viele Courts zum gewünschten Zeitpunkt überhaupt frei sind (z. B. "An Padel sind 6 von 6 Courts frei, an Tennis 5/7, am Golf-Sim 3/3"). `courtsNeeded` im Algorithmus ist in dieser Phase konstant **1** — der Check beantwortet nur: "Ist die Location zu dieser Zeit überhaupt bespielbar?".
- **Step 5 (Bedarfs-Abgleich):** Nach Eingabe von Sportart + Court-Anzahl wird derselbe Algorithmus mit echten Werten erneut aufgerufen. Bei Überbuchung erscheint ein sekundärer Warnhinweis ("Du wünschst 4 Padel-Courts, zu diesem Termin sind nur 2 frei — Datum anpassen?") mit Link zurück zu Step 3.

## 9. Komponenten-Architektur

```
src/
├── App.tsx                     — Root, routing, i18n provider
├── features/
│   └── event-request/
│       ├── EventRequestWizard.tsx         — Container, State-Machine
│       ├── steps/
│       │   ├── ContactStep.tsx
│       │   ├── LocationStep.tsx
│       │   ├── DateDurationStep.tsx       — inkl. AvailabilityBadge
│       │   ├── EventTypeStep.tsx
│       │   ├── AttendeesSportStep.tsx
│       │   ├── ExtrasStep.tsx
│       │   └── ReviewSubmitStep.tsx
│       ├── components/
│       │   ├── StepShell.tsx              — shared layout (topbar, step indicator, nav)
│       │   ├── AvailabilityBadge.tsx      — success/tight/full states
│       │   ├── AlternativeSlotCard.tsx
│       │   ├── StepIndicator.tsx
│       │   └── LanguageToggle.tsx
│       ├── schema.ts                       — zod schema, types
│       ├── hooks/
│       │   ├── useEventRequestForm.ts     — react-hook-form setup
│       │   └── useAvailability.ts         — mock availability logic
│       └── data/
│           ├── locations.ts                — Standort-Matrix
│           └── availability.json           — Mock-Slots
├── components/ui/              — shadcn/ui primitives (button, input, etc.)
├── lib/
│   └── utils.ts                — cn() helper etc.
└── styles/
    └── globals.css             — Tailwind + design tokens as CSS vars
```

**State-Ownership:** Ein einziges `react-hook-form`-Formular lebt in `EventRequestWizard` und wird via `FormProvider` an alle Steps weitergereicht. Navigation (aktueller Step) ist URL-Query-Parameter (`?step=3`) → Deep-Linking, Browser-Back funktioniert.

## 10. Interaktions-Spezifika

- **Keyboard-Support:** Enter = Weiter, Esc = Abbrechen-Confirm, Shift+Tab = Zurück
- **Validation:** Inline on blur + on submit, Fehler in Rot (`#EF4444`) unter Feld
- **Step-Transition:** 400ms horizontal slide (Framer Motion), Prefetch nächster Step erfolgt eager
- **Verfügbarkeits-Badge:** erscheint ca. 600ms nach letztem Input-Change (debounce)
- **Alternativ-Klick:** setzt Datum/Zeit/Dauer, zeigt Success-Badge, Nutzer muss Weiter aktiv klicken (kein Auto-Advance)
- **Confirmation-Screen:** "Danke! Referenznummer #ES-2026-0417", CTA "Zur Übersicht" / "Noch eine Anfrage senden"

## 11. Out of Scope (explizit)

- **Backend / API**: kein Submit nach irgendwo, Formular-Daten landen in `console.log`
- **Kalkulation / Preise**: keine Live-Summen, kein Rabatt-Engine
- **Mail-Versand**: keine Bestätigungs- oder interne Benachrichtigungs-Mail
- **PDF-Generierung**: kein Angebot-PDF, kein internes Briefing-PDF
- **CRM / Ticketing**: keine Integration
- **Playtomic-API**: nur Mock-JSON, kein echter Kalender-Block
- **Admin-Dashboard**: Mitarbeiter-Seite nicht Teil dieses Mockups
- **Echte Court-Block-Logik**: nur Mock-Overlap, keine echte Reservierungs-Semantik

## 12. Erfolgs-Kriterien

- [ ] Alle 7 Steps vollständig klickbar, in beiden Sprachen (DE/EN)
- [ ] Conditional Logic aus §6 funktioniert korrekt
- [ ] Verfügbarkeits-Check zeigt alle drei States (ok / tight / full) mit passenden Alternativen
- [ ] Responsive auf Mobile (≤640px) und Desktop (≥1024px) ohne Layout-Brüche
- [ ] Lighthouse Accessibility ≥ 95
- [ ] `npm run dev` + localhost erreichbar; `npm run build` produziert statisches `dist/`
- [ ] Alle sichtbaren Labels konsistent im Design-System (§4)
- [ ] User kann Prototyp Union Sport zeigen und Reaktion einholen

## 13. Offene Punkte (nicht blockierend)

- Echte Bilder (Unsplash-Platzhalter oder echte Union-Sport-Fotos)? → Default: Unsplash mit passenden Sport-Shots
- Custom-Font-Hosting (Inter via Fontsource vs. Google Fonts)? → Default: Fontsource (lokal gebündelt)
- `.superpowers/` zu `.gitignore` hinzufügen, sobald Projekt git-initialisiert wird

## 14. Referenzen

- `01_union_sport_infos.md` — Fakten, Preise, Standorte
- `02_skill_event_planner.md` — Event-Planner-Skill-Evaluation (Bausteine 2, 5, 6, 9, 10 übernommen)
- `03_skill_form_builder.md` — Form-Builder-Skill-Evaluation (Conditional-Logic-Muster übernommen, docassemble-Stack verworfen)
- `.superpowers/brainstorm/8604-1776678727/content/design-mockup-full.html` — Visual-Mockup (abgenickt 2026-04-20)
