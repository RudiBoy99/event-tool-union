# Skill 2: `form-builder` — Anleitung & Einsatz für Union Sport

> Installation: `~/.agents/skills/form-builder/SKILL.md` (5 KB, claude-office-skills)
> Security: Safe · 0 alerts · Low Risk
> 515+ Installs (einer der meistverwendeten Skills)

---

## 1. Was der Skill ist
Ein **Template-Skill** für den Bau interaktiver, mehrstufiger Formulare mit **conditional logic**. Technisches Fundament: `docassemble` — eine Open-Source-Plattform für „guided interviews", die aus Formularantworten Dokumente generiert (PDF, DOCX, HTML). Ursprünglich aus dem Legal-Tech-Umfeld (Mandanten-Intake, Vertrags-Generierung).

**Kurz:** Du beschreibst in Prosa, was das Formular können soll — der Skill spuckt YAML aus, das in docassemble direkt läuft.

## 2. Was drin ist — Baukasten

### 2.1 Interview-Struktur (YAML)
Jeder „Screen" ist ein YAML-Block mit `question`, `fields`, `choices`. Bausteine werden mit `---` getrennt, Reihenfolge ist flexibel (docassemble berechnet die Abhängigkeiten automatisch aus den Variablen).

### 2.2 Feldtypen (alle vorhanden)
```yaml
- Text:            Name: name
- Email:           Email: email        (datatype: email)
- Integer:         Age: age            (datatype: integer)
- Currency:        Amount: amount      (datatype: currency)
- Datum:           Start: start_date   (datatype: date)
- Ja/Nein:         Agree: agrees       (datatype: yesno)
- Radio:           Color choices: [Red, Blue, Green]
- Multi-Select:    Options (datatype: checkboxes) + choices
- Datei-Upload:    Upload: document    (datatype: file)
```

### 2.3 Conditional Logic (KERN-FEATURE)
```yaml
if: client_type == "Business"
question: Firmenname?
fields:
  - Company: company_name
  - EIN: ein
```
→ Screen wird **nur angezeigt, wenn die Bedingung greift**. Verzweigungen beliebig verschachtelbar.

### 2.4 Dokument-Generierung
```yaml
attachment:
  name: Angebot
  filename: offer
  content: |
    # Angebot für ${ client_name }
    Gesamtbetrag: ${ currency(amount) }
    Datum: ${ today() }
```
→ Generiert am Ende automatisch Markdown/PDF/DOCX mit den Formularwerten.

### 2.5 Built-in MCP-Tools (laut Metadata)
- `create_docx` — neue Word-Datei erzeugen
- `fill_docx_template` — bestehende DOCX-Vorlage befüllen
(Benötigt `office-mcp`-Server; für uns vorerst nicht zwingend.)

## 3. Wie der Skill „funktioniert"
- Claude liest die `SKILL.md` on-demand, wenn du Begriffe wie „Formular", „Fragebogen", „Intake", „Multi-Step Form" verwendest.
- Claude generiert **docassemble-YAML** basierend auf deiner Beschreibung.
- YAML kann in einer docassemble-Instanz (Docker, Heroku, self-hosted) deployed werden.
- **Achtung:** Der Skill produziert NICHT direkt HTML/JS/React-Code für unsere Website — er produziert nur das Interview-YAML.

## 4. Was davon für Union Sport **direkt verwendbar** ist

✅ **Conditional-Logic-Muster**: Das Konzept „wenn Event-Typ = Firmenanlass, dann frage Logo/Branding; wenn = Geburtstag, dann frage Kuchen/Deko" ist **exakt** das, was wir brauchen. Unabhängig vom Zielstack übernehmen wir die Logik 1:1.

✅ **Feldtyp-Repertoire**: Vollständige Liste aller sinnvollen Feldtypen — gute Referenz beim Formular-Design.

✅ **Struktur des Interviews**: Denken in „Screens mit je einer klaren Frage" ist die richtige UX für mehrstufige Anfragen (viel besser als ein 40-Feld-Wust).

✅ **Dokument-Generierung**: Das Muster „Formular → Template-Variable → PDF" lässt sich übernehmen. Wir können am Ende automatisch ein **Angebots-PDF** für den Kunden + einen **internen Event-Brief** für den Mitarbeiter erzeugen.

## 5. Was für Union Sport **nicht passt** (und warum)

⚠️ **docassemble als Tech-Stack**: Python-basiert, eigener Server-Stack (Docker, PostgreSQL, Redis), eigenes Templating. Für eine **KMU-Website** (vermutlich Wix/Webflow/WordPress) ist das **massiv überdimensioniert** und nicht direkt integrierbar. docassemble ist ein ganzes System, keine Widget-Lib.

⚠️ **Legal-Tech-Ausrichtung**: Die Beispiele drehen sich um Mandanten-Intake und Verträge. Für einen Sportbetrieb müssen wir Konzepte übertragen.

⚠️ **Keine JS-/React-/Webflow-Snippets**: Der Skill gibt uns kein copy-pastefähiges Frontend-Code-Snippet. Die Umsetzung im CMS bleibt bei uns.

## 6. Konkreter Einsatz im Projekt

### Strategie: **Logik übernehmen, Stack wählen wir selbst**
Wir nutzen den Skill als **Modellierungs-Tool**: Erst beschreiben wir das Formular vollständig in docassemble-YAML (sauberer Blueprint), dann übersetzen wir das in den tatsächlichen Stack der Website.

### Optionen für die Umsetzung im Frontend (später zu entscheiden)
| Stack | Aufwand | Bemerkung |
|---|---|---|
| **Typeform / Tally / Fillout eingebettet** | Niedrig | Schnell, hübsch, conditional logic, Webhooks. Beste Quick-Win-Option. |
| **Cal.com Event-Type + custom questions** | Mittel | Kombiniert Booking + Formular. |
| **Custom React-Formular** | Hoch | Volle Kontrolle, direkt auf union-sport.ch. |
| **docassemble embed** | Sehr hoch | Nur wenn wir einen eigenen Server aufsetzen — nicht empfohlen. |

### Workflow im Projekt
| Projekt-Schritt | Wie wir den Skill nutzen |
|---|---|
| **Formular-Blueprint schreiben** | Claude + Skill erzeugen das komplette YAML mit allen Screens + Conditional Logic (reine Dokumentation). |
| **Feldvalidierung planen** | Die docassemble-Feldtypen als Referenz-Set. |
| **Kunden-Angebots-PDF** | Attachment-Template als Vorlage für unser Angebot. |
| **Mitarbeiter-Briefing generieren** | Zweites Attachment-Template (interne Event-Zusammenfassung). |
| **Übersetzung in finalen Stack** | Manuell — Skill deckt das nicht ab. |

## 7. Fazit
**Starker Skill für die Modellierungsphase**, aber **kein Shortcut zur fertigen Website-Integration**. Der Hauptwert für uns: Er zwingt uns, das Formular **strukturiert, conditional und vollständig** zu denken, bevor wir einen einzigen HTML-Tag schreiben.

**Empfehlung:** Skill im nächsten Brainstorming nutzen, um den **Event-Anfrage-Flow als YAML-Blueprint** zu erzeugen. Das YAML ist dann die **Quelle der Wahrheit**, aus der wir den finalen Stack (vermutlich Typeform/Tally + Webhook, oder Custom-React im Website-CMS) ableiten.

**Aufwand-Einschätzung:** ~45-60 Minuten für einen sauberen YAML-Blueprint des kompletten Event-Formulars (Kontakt → Event-Typ → Sport → Gastro → Zusatz → Meeting → Bestätigung).
