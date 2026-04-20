# Skill 1: `event-planner` — Anleitung & Einsatz für Union Sport

> Installation: `~/.agents/skills/event-planner/SKILL.md` (14.8 KB, travisjneuman/.claude)
> Security: Safe · 0 alerts · Low Risk

---

## 1. Was der Skill ist
Ein **Framework-Skill**: kein ausführbarer Code, sondern eine strukturierte Markdown-Wissensbasis, die Claude beim Planen, Durchführen und Auswerten von Events durchliest und als Checkliste anwendet. Ursprünglich gebaut für klassische Grossevents (Konferenzen, Galas, Firmen-Offsites). Wird automatisch aktiv, sobald Claude merkt, dass du „Event planen", „Budget", „Vendor", „Run Sheet" etc. im Kontext hast.

## 2. Was drin ist — 9 Bausteine

| # | Baustein | Inhalt (Kurz) |
|---|---|---|
| 1 | **Event-Planning-Timeline** | Checklisten von „12+ Monate vor" bis „Tag davor". Fokus auf Grossveranstaltungen. |
| 2 | **Budget-Template** | Kategorie-Tabelle mit Richt-Prozentwerten (Venue 20-30 %, Catering 25-35 %, AV 10-15 % …), plus Revenue-Tracking. |
| 3 | **Venue-Selection-Matrix** | Gewichtete Vergleichs-Matrix (Kapazität, Location, AV, Catering, Parking …). |
| 4 | **Vendor-Management-Tracker** | Tabelle Lieferant/Service/Kontakt/Vertrag/Anzahlung/Status + Vertrags-Essentials. |
| 5 | **Day-of-Run-Sheet-Template** | Minutengenauer Tagesablauf mit Owner-Spalte. |
| 6 | **Attendee-Management** | Pflicht-/Optional-Felder für Registration, Kommunikations-Timeline (Registrierung → Post-Event). |
| 7 | **Promotion-Timeline** | Marketing-Phasen von Announcement bis Post-Event. |
| 8 | **AV- & Tech-Checkliste** | Equipment-Liste + Hybrid-Ergänzungen. |
| 9 | **Catering-Guide** | Pro-Kopf-Schätzwerte, Dietary-Verteilung (70 % Standard, 10-15 % vegetarisch …). |
| 10 | **Post-Event-Evaluation** | Survey-Template, Success-Metriken (NPS, Attendance Rate, Cost/Attendee), Debrief-Agenda. |

## 3. Wie der Skill technisch „funktioniert"
- Reiner **Knowledge-Skill**, kein Code, keine API. Nur eine `SKILL.md`.
- Claude lädt den Inhalt on-demand in den Kontext, wenn der Skill-Trigger matcht („event planning", „conference", „gala", „corporate event").
- Keine Config, keine Abhängigkeiten, keine externen Services.
- Updates: `npx skills check` / `npx skills update`.
- Nutzbar in allen Skill-kompatiblen Tools (Claude Code, Copilot, Amp, Codex …).

## 4. Was davon für Union Sport **direkt verwendbar** ist

✅ **Baustein 2 – Budget-Template**: Wir übernehmen die Kategorien-Struktur 1:1 als Grundlage der automatisierten Kosten-Kalkulation im Event-Tool (Venue = Court-Miete, Catering = Bistro/Foodtruck, AV = Musik/Beamer, Personal = Coaches, Contingency = Puffer). Die Prozentwerte sind ein **Plausibilitätscheck**, kein Preisraster.

✅ **Baustein 5 – Run Sheet**: Perfekt als **interne Ablaufplan-Vorlage**, die das Tool automatisch aus den Formulareingaben des Kunden generiert (Check-In, Einführung, Courts, Apéro, Foodtruck, Abbau). Owner-Spalte = Mitarbeiter von Union Sport.

✅ **Baustein 6 – Attendee-Management-Felder**: Gute Basis-Checkliste für die Registrations-Felder im Event-Formular.

✅ **Baustein 9 – Catering-Verteilung**: Dietary-Distribution (10-15 % veggie, 5-8 % vegan, 5-8 % glutenfrei …) ist **Gold wert** für die Foodtruck-Vorbestellung. Übernehmen wir als Standardverteilung in der Kalkulation.

✅ **Baustein 10 – Post-Event-Evaluation**: Survey-Template + NPS-Tracking. Wir bauen das direkt in den Workflow nach dem Event ein (automatische Mail mit Feedback-Link).

## 5. Was für Union Sport **nicht passt** (und warum)

❌ **Baustein 1 – Timeline („12+ Monate vor")**: Union-Sport-Events sind 1–12 Wochen Lead-Time, nicht 12 Monate. Die Timeline müssen wir **vollständig auf unseren Rhythmus schrumpfen** (z. B. „4 Wochen vor / 2 Wochen vor / 3 Tage vor / Tag davor").

❌ **Baustein 3 – Venue-Selection-Matrix**: Irrelevant — unsere Venue ist fix (Münchenstein / Hafen / Basel Wolf).

❌ **Baustein 4 – Vendor-Management**: Overkill für unsere Grösse. Wir haben keine 10 externen Lieferanten, sondern 1–2 (Foodtruck, ggf. Fotograf). Reduzieren auf „Foodtruck ja/nein + Kontakt".

❌ **Baustein 7 – Promotion-Timeline**: Wir vermarkten keine Einzelevents — wir **bekommen Anfragen rein**. Lead-Funnel statt Kampagne.

❌ **Baustein 8 – AV-Checkliste**: Nicht relevant. Beamer/Mikros/Streaming sind kein Union-Sport-Standard.

## 6. Konkreter Einsatz im Projekt
| Projekt-Schritt | Wie wir den Skill nutzen |
|---|---|
| **Formular-Felder definieren** | Baustein 6 als Startpunkt, erweitert um unsere Sport-/Court-Felder. |
| **Kosten-Kalkulation bauen** | Baustein 2 als Kategorie-Skelett; Prozente als Sanity-Check. |
| **Foodtruck-Vorbestellung** | Baustein 9 (Dietary-Distribution) als Defaults. |
| **Internen Ablauf-Plan für Mitarbeiter generieren** | Baustein 5 als Template — Tool füllt Zeiten & Owner automatisch. |
| **Nach-Event-Feedback** | Baustein 10 Survey + Metriken als Grundlage für Evaluation. |

## 7. Fazit
**Nützlich als Checklisten-Gerüst**, aber klar überdimensioniert für den KMU-Sportplatz-Use-Case. Wir **picken die 4-5 passenden Bausteine** (Budget, Run Sheet, Felder, Catering, Post-Event) und **ignorieren den Rest**. Kein „Copy-Paste" — sondern „als Inspiration lesen, dann spezifisch machen".

**Aufwand-Einschätzung:** ~30 Minuten, um die relevanten Teile in unsere Planung zu übernehmen.
