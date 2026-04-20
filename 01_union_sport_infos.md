# Union Sport – Informationsgrundlage für Event-Tool

> Zusammenstellung aller relevanten Fakten über Union Sport, die für Planung, Bau und Integration des Event-Tools in die Website www.union-sport.ch benötigt werden. Stand: 2026-04-14.

---

## 1. Unternehmen im Überblick

**Union Sport** ist ein Sport- und Racketsport-Anbieter in der Region Basel mit drei Standorten und breitem Angebot rund um Tennis, Padel, Golf, Pickleball und Tischtennis. Betrieben werden Anlagen mit Indoor- und Outdoor-Courts, Academy-Programmen und regelmässigen Events/Turnieren.

- **Website:** https://www.union-sport.ch
- **E-Mail zentral:** info@union-sport.ch
- **Telefon zentral:** +41 61 413 13 00
- **WhatsApp-Service:** verfügbar
- **Instagram:** @union.sport.basel
- **Telefonische Betreuung:** Mo–Do 11:00–20:30, Fr–So 11:00–17:00

---

## 2. Standorte

### 2.1 Union Sport Münchenstein (Hauptstandort)
- **Adresse:** Reinacherstrasse 66, 4142 Münchenstein
- **Öffnungszeiten Anlage:** Mo–So 06:00–22:30 (Selbstbedienung ausserhalb der Bürozeiten)
- **Areal:** ca. 15'000 m² am Waldrand
- **ÖV:** 400 m Tram 11, 350 m Bus 60
- **Parkplätze:** kostenlos für Kunden
- **Sanitär:** Garderoben, Duschen
- **Gastro:** Bistro mit Getränken und kleinen Speisen (Self-Service)

**Sportinfrastruktur Münchenstein:**
| Sportart | Anzahl | Typ | Preis |
|---|---|---|---|
| Tennis | 2 | Outdoor (Sand) | CHF 30–35 Sommer |
| Tennis | 5 | Indoor (Keramiksand) | CHF 50–60 Winter |
| Padel | 5 | Outdoor Panorama | CHF 36–44 |
| Padel | 1 | Single Court | CHF 36–44 |
| Golf | 3 | Indoor Trackman Simulator | CHF 50/h |
| Golf | 5 | Indoor Driving Range | CHF 25/h |
| Golf | 1 | Indoor Putting Green | – |

### 2.2 Union Padel – Basel Hafen
- **Lage:** Uferstrasse 70, 4057 Basel (Basel Hafen)
- **Courts:** 5 Indoor Padel Courts
- **Regelmässige Formate:**
  - Monday Opencourt (Beginner) 17:00–18:30 · CHF 15 / 90 min
  - Friday „Champions of the Harbour" 19:30–22:00 (Mexicano-Format)
- **Turnierpreis Referenz:** CHF 33 für 2.5 h inkl. 1 Drink + neue Bälle

### 2.3 Union Pickleball – Basel Wolf
- **Adresse:** Halle 4, St. Jakob-Strasse 220, 4052 Basel
- **Ausstattung:** Pickleball-Courts + 4 Indoor-Tischtennistische, Leihausrüstung gratis
- **Partner:** Jambat (Training), Joola (Sponsor), Colorkey, Fitpass, Prozentbuch
- **Buchung:** via Playtomic „Union Pickleball Basel Wolf"
- **Status Events:** Social-Events und Turniere in Planung

---

## 3. Mitgliedschafts- und Preismodelle
- **Benefit-Abos:** benefit25, benefit50, benefit100, benefitgold (25–100 % Rabatt auf individuellen Buchungsanteil, Early Booking bis 3 Wochen im Voraus)
- **Sommer/Winter-Tarife** Tennis (Outdoor/Indoor)
- **Equipment-Rental** an allen Standorten verfügbar

---

## 4. Buchungs- und Technik-Stack (bekannt)
- **Buchungsplattform:** bisher Gotcourts → ab Sommersaison 2025 (April) **Playtomic**
- **Website-Navigation:** Shop · Kontakt & Anfragen · Schulangebote · Events & News · FAQ · Buchungsplattform · Über uns · Galerie · Impressum · AGB · Datenschutz
- **Kommunikation:** E-Mail, Telefon, WhatsApp, Instagram
- **Mehrsprachigkeit:** DE + EN (`/en/`-Pfade vorhanden)

> ⚠️ Offen / zu klären für das Event-Tool: CMS der Website (Wix, Webflow, WordPress …), bestehender Formular-Stack, CRM/Ticketing, Kalender-Anbindungen, wie Playtomic an den Buchungskalender angebunden ist und ob Courts für Events dort geblockt werden können.

---

## 5. Aktuelles Event-Portfolio (öffentlich)
**Wiederkehrende Formate:**
- Open Play (Pickle-Ball) Di + Sa
- Monday Opencourt Padel (Hafen)
- Friday Night Champions of the Harbour (Hafen)

**Turniere:**
- P100 Friday Night · P200 Swisstennis-Padel · P300 Swiss Padel
- Union Mixed Tournament · Beat the Pros · UNION GAMES (Tennis)

**Academy / Camps:**
- Padel Academy, Tennis Training, Golf Training
- Mark Price Signature Camp (Basel)
- Padel Kids Camp

**Spezial-Events:**
- Padel & Pizza
- Coop Gemeindeduell – Open Court
- International Certification (Pickle-Ball)

**Beobachtung:** Private Events, Firmenanlässe, Geburtstage oder Teambuilding werden auf der Website **nicht explizit beworben** – obwohl genau diese Anfragen täglich eintreffen. Hier besteht der grösste Hebel für das Event-Tool.

---

## 6. Problemstellung (aus Auftraggeber-Input)
- **Volumen:** täglich 2–3 Event-Anfragen von Privat + Firmen
- **Bandbreite:** von 5 h Court-Miete bis Ganztagesevents mit Foodtruck für 60–100 Personen
- **Aktueller Zustand:**
  - Anfragen landen unstrukturiert bei verschiedenen Personen
  - Viel manuelle Mail-/Telefon-Pingpong bis Kundeninteresse geklärt ist
  - Keine einheitliche Erfassung der Eckdaten (Datum, Personen, Dauer, Wunsch-Courts, Gastro, Meeting-Wunsch)
  - Keine automatischen Kosten- und Aufwand-Schätzungen
  - Mitarbeiter verlieren Zeit, Kunde wartet lange auf Angebot
- **Ziel:**
  - Strukturiertes Online-Event-Formular direkt in union-sport.ch
  - Vollständige Datenaufnahme beim ersten Kontakt
  - Automatisierte Vor-Kalkulation & interne Benachrichtigung an den zuständigen Mitarbeiter
  - Weniger Meetings, schnellere Angebote, klarer Workflow

---

## 7. Rohdaten für die Event-Tool-Logik

### 7.1 Event-Typen (Hypothese, im Brainstorming bestätigen)
- Court-Only-Buchung (kurz, 3–8 h, Gruppe)
- Geburtstag / Private Feier
- Firmenanlass (halbtags / ganztags)
- Teambuilding / Sporttag
- Turnier auf Bestellung
- Schulen / Jugendgruppen
- Camp / mehrtägig

### 7.2 Zwingend abzufragende Felder (Entwurf)
- **Kontakt:** Name, Firma, E-Mail, Telefon, Sprache
- **Event:** Wunschdatum(e) + Uhrzeit, Alternativdatum, Dauer
- **Teilnehmer:** Personenzahl, Altersgruppe, Sport-Level
- **Location:** Münchenstein / Basel Hafen / Basel Wolf
- **Sportwahl:** Tennis, Padel, Golf, Pickle-Ball, Tischtennis (Multi-Select + Anzahl Courts)
- **Zusatzleistungen:** Equipment-Leihe, Coach/Trainer, Einführung, Schiri, Bälle
- **Gastro:** Bistro, Getränkepaket, Apéro, Foodtruck, Catering extern
- **Räumlichkeiten:** Eventlounge, Meetingraum, Garderoben exklusiv
- **Budget:** optional Spanne
- **Sonstiges:** Firmenlogo, Branding, Fotograf, Musik, Preise/Pokale
- **Meeting-Wunsch:** Ja/Nein (Call/Vor-Ort), Wunschzeit

### 7.3 Kalkulations-Bausteine (für Auto-Schätzung)
- Court-Preis × Anzahl × Stunden (Saison-/Standort-abhängig)
- Coach-Stundensatz × benötigte Coaches (Faustregel: 1 Coach / 8–12 Teilnehmer)
- Equipment-Paket pro Teilnehmer
- Gastro: F&B pro Kopf (Getränkepauschale, Apéro-Paket, Foodtruck-Fixkosten + pro Kopf)
- Raummiete Eventlounge
- Reinigungs-/Setup-Pauschale
- Rabattlogik für Mitglieder (benefit25/50/100/gold)

### 7.4 Workflow nach Absenden (Vorschlag)
1. Automatische Bestätigungsmail an Kunden
2. Vorkalkulation im PDF/HTML an internes Postfach / Slack / CRM
3. Zuweisung an zuständigen Mitarbeiter (Regel: Standort → Owner)
4. Kalender-Hold (Courts im Playtomic blocken) bis Angebot bestätigt
5. Status-Tracking: Neu → Angebot → Bestätigt → Durchgeführt → Nachfass

---

## 8. Offene Fragen an Yannis / Union Sport
1. Welches CMS/Framework betreibt www.union-sport.ch aktuell?
2. Wer bekommt Event-Anfragen nach Standort? (Zuständigkeiten)
3. Gibt es bereits ein CRM, eine Datenbank oder ein Ticketsystem?
4. Kann/soll das Tool Courts in Playtomic blocken (API vorhanden)?
5. Welche Eventlounges/Meetingräume stehen an welchen Standorten zur Verfügung und was kosten sie?
6. Mit welchen Foodtrucks/Caterern bestehen Partnerschaften? Fixpreise?
7. Gibt es feste Preispakete, die heute schon telefonisch offeriert werden? (Basis für Kalkulationsregeln)
8. Sprache(n) des Tools: nur DE + EN oder zusätzlich FR?
9. DSGVO/revDSG: wo werden Kundendaten gespeichert?
10. Branding: bestehendes Design-System / Styleguide vorhanden?

---

## 9. Quellen
- [Union Sport Website](https://www.union-sport.ch)
- [Union Sport Münchenstein (EN)](https://www.union-sport.ch/en/muenchenstein)
- [Padel Academy](https://www.union-sport.ch/en/padelacademy)
- [Event-Liste](https://www.union-sport.ch/event-list)
- [Basel Wolf Standort](https://www.union-sport.ch/en/pickleball-1)
- [P200 Swisstennis-Padel Turnier](https://www.union-sport.ch/en/event-details/p200-swisstennis-padel-turnier)
- [Padel Kids Camp](https://www.union-sport.ch/event-details/padel-kids-camp)
- [Playtomic – Union Sport Münchenstein](https://playtomic.com/clubs/union-sport-munchenstein)
