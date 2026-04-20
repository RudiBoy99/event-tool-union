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
