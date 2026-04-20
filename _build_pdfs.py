#!/usr/bin/env python3
"""
Union Sport Event-Tool — PDF-Generator
Erstellt zwei PDFs:
  1. Visuelles Modell (Team-Präsentation)
  2. Projekt-Bericht (nächste Schritte & Union-Lieferungen)
"""

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import mm, cm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import date

# ─── Design-Tokens ────────────────────────────────────────────────────────
NAVY = HexColor("#0F1E3D")
NAVY_LIGHT = HexColor("#1F3A6B")
ORANGE = HexColor("#FF6B35")
GREEN = HexColor("#06A77D")
RED = HexColor("#E63946")
GREY_BG = HexColor("#F1F3F5")
GREY_BORDER = HexColor("#CED4DA")
GREY_TEXT = HexColor("#495057")
WHITE = HexColor("#FFFFFF")
BLACK = HexColor("#212529")
YELLOW = HexColor("#FFD166")
BLUE_LIGHT = HexColor("#E8F1FB")
PURPLE = HexColor("#7950F2")

OUT_DIR = "/Users/yannisgisler/Documents/EventToolUnion"
TODAY = date.today().strftime("%d.%m.%Y")


# ─── Helper: gerundete Boxen ──────────────────────────────────────────────
def rounded_box(c, x, y, w, h, fill, stroke=None, radius=8, stroke_width=1):
    c.saveState()
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(stroke_width)
        c.roundRect(x, y, w, h, radius, stroke=1, fill=1)
    else:
        c.roundRect(x, y, w, h, radius, stroke=0, fill=1)
    c.restoreState()


def centered_text(c, x, y, w, text, font="Helvetica", size=10, color=BLACK):
    c.setFillColor(color)
    c.setFont(font, size)
    tw = c.stringWidth(text, font, size)
    c.drawString(x + (w - tw) / 2, y, text)


def left_text(c, x, y, text, font="Helvetica", size=10, color=BLACK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, text)


def wrap_text(c, x, y, text, max_width, font="Helvetica", size=9, color=GREY_TEXT, line_height=11):
    """Simple word-wrap that returns number of lines drawn."""
    c.setFillColor(color)
    c.setFont(font, size)
    words = text.split()
    line = ""
    lines = 0
    for word in words:
        test = (line + " " + word).strip()
        if c.stringWidth(test, font, size) <= max_width:
            line = test
        else:
            c.drawString(x, y - lines * line_height, line)
            line = word
            lines += 1
    if line:
        c.drawString(x, y - lines * line_height, line)
        lines += 1
    return lines


def arrow(c, x1, y1, x2, y2, color=NAVY, width=2):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    # Arrowhead
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    al = 8
    aw = 5
    p1x = x2 - al * math.cos(angle) + aw * math.sin(angle)
    p1y = y2 - al * math.sin(angle) - aw * math.cos(angle)
    p2x = x2 - al * math.cos(angle) - aw * math.sin(angle)
    p2y = y2 - al * math.sin(angle) + aw * math.cos(angle)
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(p1x, p1y)
    p.lineTo(p2x, p2y)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def page_header(c, W, H, title, subtitle, page_num, total_pages):
    # Top navy bar
    c.setFillColor(NAVY)
    c.rect(0, H - 40, W, 40, stroke=0, fill=1)
    # Logo-placeholder (text)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(20, H - 25, "UNION SPORT")
    c.setFont("Helvetica", 9)
    c.drawString(130, H - 25, "· Event-Tool")
    # Page number top right
    c.setFont("Helvetica", 9)
    c.drawRightString(W - 20, H - 25, f"{page_num} / {total_pages}")

    # Title
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(30, H - 75, title)
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 11)
    c.drawString(30, H - 92, subtitle)

    # Separator line
    c.setStrokeColor(GREY_BORDER)
    c.setLineWidth(0.5)
    c.line(30, H - 102, W - 30, H - 102)


def page_footer(c, W, H):
    c.setStrokeColor(GREY_BORDER)
    c.setLineWidth(0.3)
    c.line(30, 30, W - 30, 30)
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 7)
    c.drawString(30, 18, f"Union Sport Event-Tool · {TODAY} · Stand: Brainstorming-Phase abgeschlossen")
    c.drawRightString(W - 30, 18, "www.union-sport.ch")


# ═══════════════════════════════════════════════════════════════════════════
#  PDF 1 — VISUELLES MODELL (Landscape, Team-Präsentation)
# ═══════════════════════════════════════════════════════════════════════════

def build_visual_pdf():
    out = f"{OUT_DIR}/05_visuelles_modell.pdf"
    W, H = landscape(A4)  # 842 x 595
    c = canvas.Canvas(out, pagesize=landscape(A4))
    total_pages = 9

    # ─── PAGE 1: COVER ─────────────────────────────────────────────────
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    c.setFillColor(ORANGE)
    c.rect(0, H - 6, W, 6, stroke=0, fill=1)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 42)
    c.drawString(60, H / 2 + 40, "Event-Tool")
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(ORANGE)
    c.drawString(60, H / 2 + 5, "Union Sport · Visuelles Modell")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 14)
    c.drawString(60, H / 2 - 25, "Strukturierte Event-Anfragen statt Mail-Pingpong")
    c.setFont("Helvetica", 11)
    c.setFillColor(GREY_BORDER)
    c.drawString(60, H / 2 - 45, "Interne Präsentation für das Union-Sport-Team")
    c.drawString(60, H / 2 - 60, f"Stand: {TODAY}  ·  Referenz: XNRGY Club Amsterdam")

    # Legende unten
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(60, 60, "Farbcode")
    def legend_dot(x, y, color, label):
        c.setFillColor(color)
        c.circle(x, y, 5, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 9)
        c.drawString(x + 10, y - 3, label)

    legend_dot(60, 40, ORANGE, "Kunde / Frontend")
    legend_dot(180, 40, GREEN, "Backend / Logik")
    legend_dot(300, 40, NAVY_LIGHT, "Mitarbeiter / Team")
    legend_dot(420, 40, YELLOW, "Externe Partner")
    legend_dot(530, 40, RED, "Pain-Point / Heute")
    legend_dot(640, 40, PURPLE, "Tool-Feature")

    c.showPage()

    # ─── PAGE 2: PROBLEM HEUTE ─────────────────────────────────────────
    page_header(c, W, H, "Das Problem heute", "Wie Event-Anfragen aktuell verarbeitet werden", 2, total_pages)

    # Flow: Kunde → 5 Mitarbeiter (chaos) → Ping-Pong → Offerte (3 Tage)
    y = H - 230
    # Kunde
    rounded_box(c, 60, y, 110, 60, ORANGE)
    centered_text(c, 60, y + 35, 110, "Kunde", "Helvetica-Bold", 14, WHITE)
    centered_text(c, 60, y + 18, 110, "schickt Mail", "Helvetica", 9, WHITE)

    arrow(c, 170, y + 30, 210, y + 30, RED, 3)

    # Chaos-Wolke
    c.setFillColor(HexColor("#FFE5E5"))
    c.setStrokeColor(RED)
    c.setLineWidth(1.5)
    c.circle(290, y + 30, 70, stroke=1, fill=1)
    centered_text(c, 220, y + 50, 140, "5+ Mitarbeiter", "Helvetica-Bold", 11, RED)
    centered_text(c, 220, y + 35, 140, "durcheinander", "Helvetica", 9, RED)
    centered_text(c, 220, y + 20, 140, "Wer antwortet?", "Helvetica-Oblique", 9, RED)

    arrow(c, 360, y + 30, 400, y + 30, RED, 3)

    # Ping-Pong
    rounded_box(c, 400, y, 140, 60, GREY_BG, GREY_BORDER)
    centered_text(c, 400, y + 38, 140, "Mail-Pingpong", "Helvetica-Bold", 12, NAVY)
    centered_text(c, 400, y + 22, 140, "8-15 Mails", "Helvetica", 10, GREY_TEXT)
    centered_text(c, 400, y + 8, 140, "bis alles geklärt", "Helvetica", 9, GREY_TEXT)

    arrow(c, 540, y + 30, 580, y + 30, RED, 3)

    # Offerte
    rounded_box(c, 580, y, 140, 60, NAVY_LIGHT)
    centered_text(c, 580, y + 38, 140, "Offerte", "Helvetica-Bold", 12, WHITE)
    centered_text(c, 580, y + 22, 140, "nach 3 Tagen", "Helvetica", 10, WHITE)
    centered_text(c, 580, y + 8, 140, "Kunde ist abgekühlt", "Helvetica-Oblique", 8, GREY_BORDER)

    # Pain-Points List
    left_text(c, 60, H - 330, "Die Schmerzen", "Helvetica-Bold", 14, NAVY)
    pains = [
        "Anfragen landen bei verschiedenen Personen — keine einheitliche Inbox",
        "Keine strukturierte Erfassung — 8-15 Rückfragen pro Anfrage",
        "Keine automatische Kostenschätzung — jeder kalkuliert manuell",
        "Antwortzeit 3+ Tage — Kunde kühlt ab, bucht woanders",
        "Kein Überblick, welche Anfrage welchen Status hat",
        "Das Union-Sport-Team verliert täglich 2-3 Stunden mit Admin-Arbeit",
    ]
    for i, p in enumerate(pains):
        c.setFillColor(RED)
        c.circle(75, H - 360 - i * 18, 3, stroke=0, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 10)
        c.drawString(85, H - 363 - i * 18, p)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 3: DIE LÖSUNG ────────────────────────────────────────────
    page_header(c, W, H, "Die Lösung morgen", "So wird es mit dem Event-Tool ablaufen", 3, total_pages)

    y = H - 230
    # Kunde
    rounded_box(c, 60, y, 110, 60, ORANGE)
    centered_text(c, 60, y + 35, 110, "Kunde", "Helvetica-Bold", 14, WHITE)
    centered_text(c, 60, y + 18, 110, "nutzt Event-Tool", "Helvetica", 9, WHITE)

    arrow(c, 170, y + 30, 210, y + 30, GREEN, 3)

    # Tool
    rounded_box(c, 210, y - 10, 160, 80, PURPLE)
    centered_text(c, 210, y + 50, 160, "Event-Tool", "Helvetica-Bold", 14, WHITE)
    centered_text(c, 210, y + 32, 160, "7 Sektionen · Conditional", "Helvetica", 9, WHITE)
    centered_text(c, 210, y + 18, 160, "DE/EN · Empfehlungs-", "Helvetica", 9, WHITE)
    centered_text(c, 210, y + 4, 160, "Modus pro Sektion", "Helvetica", 9, WHITE)

    arrow(c, 370, y + 30, 410, y + 30, GREEN, 3)

    # 1 zentrales Postfach
    rounded_box(c, 410, y, 150, 60, GREEN)
    centered_text(c, 410, y + 38, 150, "1 zentrale Inbox", "Helvetica-Bold", 12, WHITE)
    centered_text(c, 410, y + 22, 150, "events@union-sport.ch", "Helvetica", 9, WHITE)
    centered_text(c, 410, y + 8, 150, "mit PDF + Kalkulation", "Helvetica", 8, WHITE)

    arrow(c, 560, y + 30, 600, y + 30, GREEN, 3)

    # Offerte 24h
    rounded_box(c, 600, y, 150, 60, NAVY_LIGHT)
    centered_text(c, 600, y + 38, 150, "Offerte", "Helvetica-Bold", 12, WHITE)
    centered_text(c, 600, y + 22, 150, "innert 24h", "Helvetica", 10, WHITE)
    centered_text(c, 600, y + 8, 150, "Kunde ist noch heiss", "Helvetica-Oblique", 8, YELLOW)

    # Gains
    left_text(c, 60, H - 340, "Die Gewinne", "Helvetica-Bold", 14, GREEN)
    gains = [
        "100 % aller Infos beim ersten Kontakt — kein Pingpong mehr",
        "Automatische interne Kosten-Schätzung im Mail an Mitarbeiter",
        "Zentrale Inbox — jede Anfrage wird gesehen, nichts geht verloren",
        "Kunde bekommt Preis-Orientierung via ab-CHF-Anker (wie XNRGY)",
        "Empfehlt-uns-was-Passendes-Option bewahrt beratende Rolle",
        "3 Landing-Pages (Firma / Privat / Schule) mit zielgruppen-spezifischem Content",
        "Antwortzeit unter 24 Stunden — Kunde bleibt engagiert",
    ]
    for i, g in enumerate(gains):
        c.setFillColor(GREEN)
        c.circle(75, H - 370 - i * 18, 3, stroke=0, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 10)
        c.drawString(85, H - 373 - i * 18, g)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 4: DIE 3 EINSTIEGSTÜREN ──────────────────────────────────
    page_header(c, W, H, "Drei Einstiegstüren", "Pro Zielgruppe eine dedizierte Landing-Page", 4, total_pages)

    # Hub
    rounded_box(c, 321, H - 200, 200, 50, NAVY)
    centered_text(c, 321, H - 175, 200, "union-sport.ch", "Helvetica-Bold", 14, WHITE)
    centered_text(c, 321, H - 190, 200, "Event-Bereich", "Helvetica", 10, ORANGE)

    # 3 Landing-Pages
    titles = [
        ("Firmenevent", "/events/firmenevent", "20-100 P. · Teambuilding, Kickoff, Kundenanlass", ORANGE),
        ("Privatevent", "/events/privatevent", "10-30 P. · Geburtstage, Feiern, Feste", GREEN),
        ("Schulevent", "/events/schulevent", "flexibel · Sporttag, Projektwoche", PURPLE),
    ]
    for i, (t, url, desc, col) in enumerate(titles):
        x = 90 + i * 230
        y = H - 370
        rounded_box(c, x, y, 200, 130, col)
        centered_text(c, x, y + 100, 200, t, "Helvetica-Bold", 18, WHITE)
        centered_text(c, x, y + 80, 200, url, "Courier", 10, YELLOW)
        # Description
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 9)
        lines = [desc[:35], desc[35:] if len(desc) > 35 else ""]
        for j, l in enumerate(lines):
            if l:
                tw = c.stringWidth(l, "Helvetica", 9)
                c.drawString(x + (200 - tw) / 2, y + 55 - j * 14, l)

        # Arrow from hub
        arrow(c, 420, H - 200, x + 100, y + 130, NAVY, 1.5)

    left_text(c, 60, H - 420, "Was teilen die 3 Pages?", "Helvetica-Bold", 12, NAVY)
    left_text(c, 60, H - 440, "· Dieselbe Form-Komponente (7 Sektionen, Conditional Logic)", "Helvetica", 10, GREY_TEXT)
    left_text(c, 60, H - 455, "· Dieselbe Partner-Datenbank (Vito, Acento, Luen, Gelateria, DJ)", "Helvetica", 10, GREY_TEXT)
    left_text(c, 60, H - 470, "· Denselben Backend-Flow (Kalk-Engine → 2 PDFs → 2 Mails)", "Helvetica", 10, GREY_TEXT)

    left_text(c, 460, H - 420, "Was unterscheidet sie?", "Helvetica-Bold", 12, NAVY)
    left_text(c, 460, H - 440, "· Eigene Hero-Headline + Sub-Text", "Helvetica", 10, GREY_TEXT)
    left_text(c, 460, H - 455, "· Vorausgefüllter Event-Typ", "Helvetica", 10, GREY_TEXT)
    left_text(c, 460, H - 470, "· Zielgruppen-spezifische Beispiele & Defaults", "Helvetica", 10, GREY_TEXT)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 5: FORMULAR-SEKTIONEN ────────────────────────────────────
    page_header(c, W, H, "Das Formular", "7 Sektionen, XNRGY-Stil, keine Live-Gesamtsumme", 5, total_pages)

    # 7 Sektionen horizontal
    sections = [
        ("1", "Event-Basics", "Datum · Zeit · Dauer"),
        ("2", "Location & Sport", "Standort → Sport → Courts"),
        ("3", "Personen & Level", "Anzahl · Alter · Level"),
        ("4", "Sport-Extras", "Coaching · Equipment · Turnier"),
        ("5", "Verpflegung", "Apéro · Foodtruck (Partner)"),
        ("6", "Räume & Specials", "Lounge · DJ · Preise · Gutscheine"),
        ("7", "Kontakt", "Name · Firma · Meeting"),
    ]
    box_w = 100
    gap = 10
    start_x = (W - (box_w * 7 + gap * 6)) / 2
    y = H - 230

    for i, (num, title, sub) in enumerate(sections):
        x = start_x + i * (box_w + gap)
        color = [ORANGE, NAVY_LIGHT, GREEN, PURPLE, YELLOW, RED, NAVY][i]
        text_color = WHITE if color != YELLOW else NAVY
        rounded_box(c, x, y, box_w, 90, color)
        # Number badge
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.circle(x + 15, y + 75, 10, stroke=0, fill=1)
        c.setFillColor(color if color != YELLOW else YELLOW)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(x + 15, y + 72, num)
        # Title
        c.setFillColor(text_color)
        c.setFont("Helvetica-Bold", 10)
        tw = c.stringWidth(title, "Helvetica-Bold", 10)
        if tw > box_w - 10:
            c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(x + box_w / 2, y + 45, title)
        # Subtitle wrapped
        c.setFont("Helvetica", 7)
        words = sub.split(" · ")
        for j, w_ in enumerate(words):
            c.drawCentredString(x + box_w / 2, y + 28 - j * 9, w_)

        # Arrow
        if i < 6:
            arrow(c, x + box_w + 1, y + 45, x + box_w + gap - 1, y + 45, NAVY, 1.5)

    # Empfehlungs-Toggle Highlight
    for i in [1, 3, 5]:  # Sections 2, 4, 6 have "Empfehlt uns"
        x = start_x + i * (box_w + gap)
        c.setFillColor(YELLOW)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(x + box_w / 2, y - 10, "★ Empfehlt uns")

    # Asymmetrisches Preismodell
    y = H - 370
    left_text(c, 60, y, "Das Asymmetrische Preismodell", "Helvetica-Bold", 13, NAVY)

    rounded_box(c, 60, y - 110, 360, 90, BLUE_LIGHT, NAVY)
    centered_text(c, 60, y - 35, 360, "Was der KUNDE sieht", "Helvetica-Bold", 11, NAVY)
    left_text(c, 80, y - 55, "· «ab CHF 2/Racket, ab CHF 35/h Turnierorg." , "Helvetica", 9, GREY_TEXT)
    left_text(c, 80, y - 70, "· «ab CHF 22 p.p. Vito Pizzeria Foodtruck\"", "Helvetica", 9, GREY_TEXT)
    left_text(c, 80, y - 85, "· Pro Sektion: «Empfehlt uns was Passendes\"", "Helvetica", 9, GREY_TEXT)
    left_text(c, 80, y - 100, "· KEINE Gesamtsumme, KEINE Offerte im Tool", "Helvetica-Bold", 9, RED)

    rounded_box(c, 440, y - 110, 360, 90, HexColor("#FFE5D4"), ORANGE)
    centered_text(c, 440, y - 35, 360, "Was der MITARBEITER automatisch im Mail bekommt", "Helvetica-Bold", 11, ORANGE)
    left_text(c, 460, y - 55, "· Komplette Kunden-Anfrage als PDF", "Helvetica", 9, GREY_TEXT)
    left_text(c, 460, y - 70, "· Interne Kalkulation mit Einzelpreisen + Zwischensummen", "Helvetica", 9, GREY_TEXT)
    left_text(c, 460, y - 85, "· Marge-Puffer-Hinweis (+15-25 %)", "Helvetica", 9, GREY_TEXT)
    left_text(c, 460, y - 100, "· «Nicht sicher\"-Felder rot markiert = Beratungs-Hotspots", "Helvetica-Bold", 9, RED)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 6: BACKEND-FLOW ──────────────────────────────────────────
    page_header(c, W, H, "Was passiert nach dem Absenden", "End-to-End Datenfluss in 8 Sekunden", 6, total_pages)

    steps = [
        ("1", "Submit", "Kunde klickt\nAnfrage senden", ORANGE),
        ("2", "Validate", "Server-seitige\nPflichtfeld-Check", NAVY_LIGHT),
        ("3", "Save", "Submission in\nWix-Collection", GREEN),
        ("4", "Calculate", "Kalk-Engine\nerrechnet Total", PURPLE),
        ("5", "PDF 1", "Kunden-\nZusammenfassung", YELLOW),
        ("6", "PDF 2", "Interne\nKalkulation", YELLOW),
        ("7", "Mail 1", "an Kunden:\nThank-You + PDF1", GREEN),
        ("8", "Mail 2", "an Team:\nPDF1 + PDF2", NAVY),
    ]
    box_w = 90
    gap = 12
    start_x = (W - (box_w * 8 + gap * 7)) / 2
    y = H - 270

    for i, (num, title, sub, color) in enumerate(steps):
        x = start_x + i * (box_w + gap)
        text_col = WHITE if color != YELLOW else NAVY
        rounded_box(c, x, y, box_w, 100, color)
        c.setFillColor(text_col)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(x + box_w / 2, y + 65, num)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(x + box_w / 2, y + 40, title)
        c.setFont("Helvetica", 7)
        lines = sub.split("\n")
        for j, l in enumerate(lines):
            c.drawCentredString(x + box_w / 2, y + 22 - j * 9, l)
        if i < 7:
            arrow(c, x + box_w + 1, y + 50, x + box_w + gap - 1, y + 50, NAVY, 1.5)

    # Caption
    centered_text(c, 0, H - 300, W, "Dauer: ca. 5-10 Sekunden — komplett automatisch", "Helvetica-Oblique", 10, GREY_TEXT)

    # Vorher-Nachher
    y = H - 400
    rounded_box(c, 100, y, 280, 80, HexColor("#FFE5E5"), RED)
    centered_text(c, 100, y + 55, 280, "HEUTE", "Helvetica-Bold", 14, RED)
    centered_text(c, 100, y + 35, 280, "8-15 Mails · 3+ Tage", "Helvetica", 11, GREY_TEXT)
    centered_text(c, 100, y + 18, 280, "kein System, alles manuell", "Helvetica-Oblique", 9, GREY_TEXT)

    arrow(c, 390, y + 40, 460, y + 40, NAVY, 4)

    rounded_box(c, 470, y, 280, 80, HexColor("#DFF7EC"), GREEN)
    centered_text(c, 470, y + 55, 280, "MORGEN", "Helvetica-Bold", 14, GREEN)
    centered_text(c, 470, y + 35, 280, "1 Formular · 5-10 Sekunden", "Helvetica", 11, GREY_TEXT)
    centered_text(c, 470, y + 18, 280, "Offerte in <24h, vollautomatisch", "Helvetica-Oblique", 9, GREY_TEXT)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 7: PARTNER-ÖKOSYSTEM ─────────────────────────────────────
    page_header(c, W, H, "Partner-Ökosystem", "Foodtrucks, Snacks, DJ — in Abklärung", 7, total_pages)

    # Center: Union Sport
    cx, cy = W / 2, H / 2 - 50
    c.setFillColor(NAVY)
    c.circle(cx, cy, 60, stroke=0, fill=1)
    centered_text(c, cx - 60, cy + 5, 120, "Union", "Helvetica-Bold", 16, WHITE)
    centered_text(c, cx - 60, cy - 15, 120, "Sport", "Helvetica-Bold", 16, ORANGE)

    # Partners in circle around
    import math
    partners = [
        ("Vito Pizzeria", "Italienisch", YELLOW, "pending"),
        ("Acento Argentina", "Südamerikanisch", ORANGE, "pending"),
        ("Gelateria di Berna", "Dessert-Truck", HexColor("#FFD6E8"), "pending"),
        ("Luen Bakery", "Apéro + Snacks", HexColor("#D4A373"), "pending"),
        ("DJ Partner", "Musik", PURPLE, "in Gesprächen"),
    ]
    for i, (name, cat, color, status) in enumerate(partners):
        angle = math.pi / 2 - i * (2 * math.pi / 5)
        px = cx + math.cos(angle) * 180
        py = cy + math.sin(angle) * 140
        rounded_box(c, px - 75, py - 30, 150, 60, color)
        text_col = NAVY if color in [YELLOW, HexColor("#FFD6E8"), HexColor("#D4A373")] else WHITE
        centered_text(c, px - 75, py + 10, 150, name, "Helvetica-Bold", 10, text_col)
        centered_text(c, px - 75, py - 2, 150, cat, "Helvetica", 8, text_col)
        centered_text(c, px - 75, py - 15, 150, f"[{status}]", "Helvetica-Oblique", 7, text_col)
        # Line to center
        c.setStrokeColor(GREY_BORDER)
        c.setDash(2, 3)
        c.setLineWidth(1)
        c.line(px, py, cx + math.cos(angle) * 60, cy + math.sin(angle) * 60)
        c.setDash()

    left_text(c, 60, 100, "Im Tool erscheinen Partner erst, wenn ihr Status auf «active\" gesetzt ist", "Helvetica-Bold", 10, NAVY)
    left_text(c, 60, 82, "Für den Launch reicht 1 bestätigter Partner pro Kategorie. Alle anderen bleiben «in Abklärung\".", "Helvetica", 9, GREY_TEXT)
    left_text(c, 60, 66, "Admin-Dashboard: Partner in Wix Studio per Klick freischalten — kein Entwickler nötig.", "Helvetica", 9, GREY_TEXT)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 8: TIMELINE ──────────────────────────────────────────────
    page_header(c, W, H, "Timeline", "6-8 Wochen bis Launch, 4 Phasen + Beta + Go-Live", 8, total_pages)

    phases = [
        ("Phase 1", "Foundation", "Woche 1-2", NAVY_LIGHT, ["Wix Studio Setup", "Data Collections", "Partner-Daten", "Design-System", "i18n"]),
        ("Phase 2", "Form UI", "Woche 3-4", PURPLE, ["7-Sektionen bauen", "Conditional Logic", "3 Landing-Pages", "Mobile-First"]),
        ("Phase 3", "Backend", "Woche 5", GREEN, ["Submission Endpoint", "PDF-Generator", "Mail-Versand", "Captcha"]),
        ("Phase 3B", "Preise", "Woche 6", ORANGE, ["Preislisten (UNION liefert)", "Kalk-Engine", "PDF 2 mit Zahlen"]),
        ("Beta", "Test", "Woche 7", YELLOW, ["Test-Kunden", "Feedback", "Bugfixes", "Polish"]),
        ("LAUNCH", "Go-Live", "Woche 8", RED, ["Production Deploy", "Team-Kick-off", "Social-Post"]),
    ]

    bar_h = 42
    bar_gap = 10
    y_start = H - 160
    label_w = 140
    timeline_w = 560

    for i, (phase, name, week, color, tasks) in enumerate(phases):
        y = y_start - i * (bar_h + bar_gap)
        # Phase label
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(60, y + 25, phase)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 9)
        c.drawString(60, y + 12, name)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(60, y - 1, week)

        # Bar
        pw = [80, 80, 40, 40, 40, 30][i]
        px_start = {"Woche 1-2": 0, "Woche 3-4": 80, "Woche 5": 160, "Woche 6": 200, "Woche 7": 240, "Woche 8": 280}[week]
        px = 200 + px_start * (timeline_w / 320)
        actual_w = pw * (timeline_w / 320)
        rounded_box(c, px, y, actual_w, bar_h, color)

        # Tasks inside bar
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica", 7)
        for j, t in enumerate(tasks[:3]):
            c.drawString(px + 6, y + bar_h - 11 - j * 9, f"· {t}")

    # Timeline axis
    c.setStrokeColor(GREY_BORDER)
    c.setLineWidth(0.5)
    c.line(200, y_start - 6 * (bar_h + bar_gap) - 5, 200 + timeline_w, y_start - 6 * (bar_h + bar_gap) - 5)
    for i in range(9):
        x = 200 + i * (timeline_w / 8)
        c.line(x, y_start - 6 * (bar_h + bar_gap) - 5, x, y_start - 6 * (bar_h + bar_gap) - 10)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        c.drawCentredString(x, y_start - 6 * (bar_h + bar_gap) - 22, f"W{i}" if i > 0 else "Start")

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 9: ERFOLGS-KRITERIEN ─────────────────────────────────────
    page_header(c, W, H, "Erfolgs-Kriterien", "Woran wir nach 30 Tagen messen, ob's funktioniert", 9, total_pages)

    metrics = [
        ("≥ 40", "Anfragen / Monat", "via Tool (Mail/Tel bleibt parallel)", GREEN),
        ("≥ 80 %", "Komplettheits-Rate", "Anfragen mit allen Infos beim ersten Kontakt", ORANGE),
        ("≥ 50 %", "weniger Rückfrage-Mails", "als vor dem Launch", PURPLE),
        ("< 24 h", "Antwortzeit", "vom Submit bis zur Offerte", NAVY_LIGHT),
        ("< 5 min", "Form-Durchlauf-Zeit", "die der Kunde im Schnitt braucht", YELLOW),
        ("0", "verlorene Anfragen", "dank zentraler Inbox", RED),
    ]
    box_w = 230
    box_h = 100
    gap = 20
    cols = 3
    rows = 2
    start_x = (W - (box_w * cols + gap * (cols - 1))) / 2
    start_y = H - 180

    for i, (num, title, sub, color) in enumerate(metrics):
        col = i % cols
        row = i // cols
        x = start_x + col * (box_w + gap)
        y = start_y - row * (box_h + gap) - box_h
        rounded_box(c, x, y, box_w, box_h, color)
        text_col = WHITE if color != YELLOW else NAVY
        c.setFillColor(text_col)
        c.setFont("Helvetica-Bold", 32)
        c.drawCentredString(x + box_w / 2, y + 60, num)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(x + box_w / 2, y + 35, title)
        c.setFont("Helvetica", 8)
        c.drawCentredString(x + box_w / 2, y + 18, sub)

    # Closing
    centered_text(c, 0, 90, W, "Das Tool ist erfolgreich,", "Helvetica", 14, GREY_TEXT)
    centered_text(c, 0, 72, W, "wenn euer Team WENIGER Admin-Arbeit hat", "Helvetica-Bold", 14, NAVY)
    centered_text(c, 0, 54, W, "und MEHR Zeit für die Events selbst.", "Helvetica-Bold", 14, ORANGE)

    page_footer(c, W, H)
    c.showPage()

    c.save()
    print(f"✅ Visuelles Modell gespeichert: {out}")


# ═══════════════════════════════════════════════════════════════════════════
#  PDF 2 — PROJEKT-BERICHT (Portrait, Dokument)
# ═══════════════════════════════════════════════════════════════════════════

def build_report_pdf():
    out = f"{OUT_DIR}/06_projekt_bericht.pdf"
    W, H = A4  # 595 x 842
    c = canvas.Canvas(out, pagesize=A4)
    total_pages = 8

    # ─── PAGE 1: COVER ─────────────────────────────────────────────────
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.rect(0, H - 8, W, 8, stroke=0, fill=1)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(50, H / 2 + 50, "Projekt-")
    c.drawString(50, H / 2 + 10, "Bericht")
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, H / 2 - 25, "Event-Tool Union Sport")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 12)
    c.drawString(50, H / 2 - 50, "Nächste Schritte & Union-Lieferungen")

    c.setFillColor(GREY_BORDER)
    c.setFont("Helvetica", 10)
    c.drawString(50, 130, "Empfänger: Yannis Gisler · Union Sport")
    c.drawString(50, 113, f"Erstellt: {TODAY}")
    c.drawString(50, 96, "Stand: Brainstorming-Phase abgeschlossen")
    c.drawString(50, 79, "Nächster Schritt: Implementierungs-Plan (writing-plans)")

    c.showPage()

    # ─── PAGE 2: EXECUTIVE SUMMARY ─────────────────────────────────────
    page_header(c, W, H, "Executive Summary", "Was, Wann, Warum", 2, total_pages)

    y = H - 140
    left_text(c, 40, y, "Was wird gebaut", "Helvetica-Bold", 13, NAVY)
    text = ("Ein strukturiertes, modernes Event-Anfrage-Tool für union-sport.ch, das täglich 2-3 heterogene "
            "Event-Anfragen (Private + Firmen, 5h-Court bis Ganztag mit Foodtruck) strukturiert erfasst, "
            "intern kalkuliert und das Pingpong per Mail eliminiert. Gebaut auf Wix Studio mit React/TypeScript, "
            "basierend auf 3 zielgruppen-spezifischen Landing-Pages, einem modularen 7-Sektionen-Formular "
            "und asymmetrischem Preismodell (Kunde sieht «ab CHF\"-Anker, Mitarbeiter bekommt Vollkalkulation).")
    lines_drawn = wrap_text(c, 40, y - 20, text, W - 80, size=10, line_height=14)
    y -= 20 + lines_drawn * 14 + 15

    left_text(c, 40, y, "Warum jetzt", "Helvetica-Bold", 13, NAVY)
    text = ("Kein einziger führender europäischer Padel-Club (Padium London, XNRGY Amsterdam, Padelta Schweiz, "
            "Rocket Padel UK) hat heute ein solches Tool. Union Sport hat die Chance, der erste Club zu sein, "
            "der strukturierte Event-Erfassung bietet — und sich damit vom «Mail-Pingpong-Modell\" der Konkurrenz "
            "differenziert. Die Marktlücke ist real und international bestätigt.")
    lines_drawn = wrap_text(c, 40, y - 20, text, W - 80, size=10, line_height=14)
    y -= 20 + lines_drawn * 14 + 15

    left_text(c, 40, y, "Wann", "Helvetica-Bold", 13, NAVY)
    text = "Go-Live in Woche 8 (ca. 6-8 Wochen ab Start). 4 Build-Phasen + Beta-Phase (Woche 7) + Launch (Woche 8)."
    lines_drawn = wrap_text(c, 40, y - 20, text, W - 80, size=10, line_height=14)
    y -= 20 + lines_drawn * 14 + 15

    left_text(c, 40, y, "Wer liefert was", "Helvetica-Bold", 13, NAVY)
    text = ("Ich (Claude) baue das gesamte Tool (Frontend, Backend, PDFs, Mails, Admin-Panel). "
            "Union Sport liefert: Preislisten, Partner-Bestätigungen, Texte, DSGVO-Text, Logos, Zugriffe. "
            "Details auf den nächsten Seiten.")
    wrap_text(c, 40, y - 20, text, W - 80, size=10, line_height=14)

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 3: ENTSCHEIDUNGEN ───────────────────────────────────────
    page_header(c, W, H, "Getroffene Entscheidungen", "13 Punkte, die im Brainstorming gelockt wurden", 3, total_pages)

    decisions = [
        ("Tool-Stil", "XNRGY-alike, keine Live-Gesamtsumme, «ab CHF\"-Anker pro Modul"),
        ("Entry-Point", "3 Landing-Pages (Firmenevent · Privatevent · Schulevent)"),
        ("Scope", "Alle 3 Standorte, alle 5 Sportarten, keine Multi-Day, keine Multi-Location"),
        ("Form-Struktur", "7 Sektionen (Basics → Location/Sport → Personen → Extras → F&B → Räume → Kontakt)"),
        ("Philosophie", "Interesse-Erfassung statt Buchung. «Empfehlt uns\"-Option in Sektionen 2, 4, 6"),
        ("Partner", "Vito Pizzeria · Acento Argentina · Luen Bakery · Gelateria di Berna · DJ (TBD) — mit Logo"),
        ("Preismodell", "Asymmetrisch: Kunde = Anker / Mitarbeiter = Vollkalkulation intern"),
        ("Build-Phasen", "Phase 1 Tool · Phase 2 Preislisten · Phase 3 Kalk-Engine"),
        ("Interner Flow", "Zentrales Postfach events@union-sport.ch mit 2 PDFs pro Anfrage"),
        ("Tech-Stack", "Wix Studio + Wix CLI (React/TypeScript, lokal codiert, Git, Staging, Prod)"),
        ("Sprachen", "Deutsch + Englisch in v1 (kein Französisch)"),
        ("Confirmation", "Professionelle Thank-You-Mail mit Kunden-PDF als Anhang"),
        ("Timeline", "6-8 Wochen bis Launch (4 Phasen + Beta-Woche + Launch-Woche)"),
    ]

    y = H - 135
    for i, (title, desc) in enumerate(decisions):
        # Number
        c.setFillColor(NAVY)
        c.circle(50, y + 3, 9, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(50, y, str(i + 1))
        # Title
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(68, y + 3, title)
        # Desc
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 9)
        c.drawString(160, y + 3, desc)
        y -= 22

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 4+5: WAS UNION LIEFERN MUSS ──────────────────────────────
    page_header(c, W, H, "Was Union Sport liefern muss", "12 Deliverables mit Deadlines und Kritikalität", 4, total_pages)

    deliverables = [
        ("1", "Preisliste komplett", "Ende W5", "HOCH",
         "Courts (Tennis/Padel/Golf/Pickle/TT), Coaching, Equipment, Turnierleitung, Räume, Sachpreise, Gutscheine. Als Excel/CSV.",
         RED),
        ("2", "Partner-Bestätigungen", "Ende W7", "MITTEL",
         "Mindestens 2 bestätigte Foodtrucks (Vito / Acento / Gelateria / Luen). Launch funktioniert auch mit Platzhaltern.",
         ORANGE),
        ("3", "Partner-Preise", "mit Bestätigung", "MITTEL",
         "CHF pro Person pro Foodtruck. Für Kunden-Anker im Tool.",
         ORANGE),
        ("4", "Partner-Logos", "mit Bestätigung", "MITTEL",
         "SVG oder PNG, min. 512 px, transparent background.",
         ORANGE),
        ("5", "DJ-Partner", "bis Launch", "NIEDRIG",
         "Name, Preis, Logo. Kann als «in Abklärung\" starten, Launch nicht blockierend.",
         YELLOW),
        ("6", "Landing-Page-Texte DE", "Woche 3", "HOCH",
         "Hero-Headline, Sub-Text, ~150-250 Wörter Intro pro Landing-Page (Firma, Privat, Schule).",
         RED),
        ("7", "Englische Übersetzungen", "Woche 6", "HOCH",
         "Texte aus Punkt 6 + Formular-Labels + Mail-Templates auf EN. Muttersprachler-Check empfohlen.",
         RED),
        ("8", "Brand-Assets", "Woche 1", "MITTEL",
         "Union-Sport-Logo, Favicon, Schriftarten (falls eigen), Farb-Codes der Marke.",
         ORANGE),
        ("9", "Wix Studio Zugriff", "Woche 1", "HOCH",
         "Editor- und Dev-Rolle für mich (Yannis kann Einladung verschicken). Ohne das kann ich nicht anfangen.",
         RED),
        ("10", "Mail-Adresse", "Woche 4", "HOCH",
         "events@union-sport.ch muss existieren (oder erstellt werden). Testmail muss ankommen.",
         RED),
        ("11", "Team-Mitglieder-Liste", "Woche 4", "MITTEL",
         "Wer im Union-Sport-Team braucht Lese-Zugriff auf die Submissions-Inbox?",
         ORANGE),
        ("12", "DSGVO / AGB-Text", "Woche 5", "HOCH",
         "Rechtlich geprüfter Text für die Checkbox im Formular. Wichtig wegen revDSG (Schweiz).",
         RED),
    ]

    y = H - 135
    for i, (num, title, deadline, crit, desc, color) in enumerate(deliverables[:6]):
        # Left column: Number + Color
        rounded_box(c, 40, y - 30, 30, 35, color)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(55, y - 13, num)

        # Title row
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(80, y - 5, title)
        # Deadline pill
        c.setFillColor(GREY_BG)
        c.setStrokeColor(GREY_BORDER)
        c.setLineWidth(0.5)
        c.roundRect(W - 180, y - 12, 60, 15, 3, stroke=1, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        c.drawCentredString(W - 150, y - 8, deadline)
        # Criticality
        c.setFillColor(color)
        c.roundRect(W - 110, y - 12, 70, 15, 3, stroke=0, fill=1)
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(W - 75, y - 8, crit)
        # Description
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        wrap_text(c, 80, y - 22, desc, W - 120, size=8, line_height=10)

        y -= 55

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 5: CONTINUED DELIVERABLES ────────────────────────────────
    page_header(c, W, H, "Was Union Sport liefern muss (Fortsetzung)", "Deliverables 7-12", 5, total_pages)

    y = H - 135
    for i, (num, title, deadline, crit, desc, color) in enumerate(deliverables[6:]):
        rounded_box(c, 40, y - 30, 30, 35, color)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(55, y - 13, num)

        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(80, y - 5, title)

        c.setFillColor(GREY_BG)
        c.setStrokeColor(GREY_BORDER)
        c.setLineWidth(0.5)
        c.roundRect(W - 180, y - 12, 60, 15, 3, stroke=1, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        c.drawCentredString(W - 150, y - 8, deadline)

        c.setFillColor(color)
        c.roundRect(W - 110, y - 12, 70, 15, 3, stroke=0, fill=1)
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(W - 75, y - 8, crit)

        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        wrap_text(c, 80, y - 22, desc, W - 120, size=8, line_height=10)

        y -= 55

    # Legend
    y -= 10
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, "Kritikalitäts-Legende")
    y -= 15

    for label, color, desc in [
        ("HOCH", RED, "Ohne diesen Input blockt der Build oder der Launch"),
        ("MITTEL", ORANGE, "Kann mit Platzhalter starten, muss aber vor Launch kommen"),
        ("NIEDRIG", YELLOW, "Nice-to-have, kein Launch-Blocker"),
    ]:
        c.setFillColor(color)
        c.roundRect(40, y - 8, 50, 12, 3, stroke=0, fill=1)
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(65, y - 4, label)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        c.drawString(100, y - 4, desc)
        y -= 15

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 6: NÄCHSTE SCHRITTE ──────────────────────────────────────
    page_header(c, W, H, "Nächste Schritte", "Was passiert als Nächstes", 6, total_pages)

    y = H - 140

    steps = [
        ("A", "JETZT", "Spec finalisieren + User-Review",
         "Die komplette Spec wird als Markdown-Datei ins Projekt-Verzeichnis geschrieben. Du liest sie durch und gibst entweder OK oder verlangst Änderungen.",
         GREEN),
        ("B", "DANACH", "Implementierungs-Plan erstellen",
         "Ich wechsle zum superpowers:writing-plans Skill, der den Build in konkrete, testbare Arbeitsschritte zerlegt (Task-Liste mit Verifikations-Checkpunkten).",
         PURPLE),
        ("C", "WOCHE 1", "Union-Setup",
         "Du lädst mich in Wix Studio ein, erstellst events@union-sport.ch, lieferst Brand-Assets und die DE-Texte für die Landing-Pages.",
         ORANGE),
        ("D", "WOCHE 1-2", "Build-Start (Phase 1)",
         "Ich lege das Projekt lokal an (Git-Repo, Wix CLI, TypeScript), baue die Data Collections, trage Partner als «pending\" ein, setze das Design-System auf.",
         NAVY_LIGHT),
        ("E", "WOCHE 3-4", "Form UI + 3 Landing-Pages",
         "7 Sektionen mit Conditional Logic, «Empfehlt uns\"-Toggles, mobile-first. 3 Landing-Pages mit eurem Content.",
         NAVY_LIGHT),
        ("F", "WOCHE 5", "Backend + PDFs",
         "Submission-Endpoint, PDF-Generator-Setup, Mail-Versand, Captcha. Ab hier fliessen Testanfragen ins Postfach.",
         NAVY_LIGHT),
        ("G", "WOCHE 6", "Preislisten integrieren",
         "Du lieferst die Preislisten. Ich baue die Kalkulations-Engine und das zweite (interne) PDF mit echten Zahlen.",
         RED),
        ("H", "WOCHE 7", "Beta-Phase",
         "Staging-URL an 3-5 Testkunden oder interne Mitarbeiter. Feedback sammeln, Bugs fixen, Copy-Check.",
         YELLOW),
        ("I", "WOCHE 8", "LAUNCH",
         "Partner auf «active\" schalten, Production-Deploy, internen Kickoff mit dem Union-Sport-Team.",
         ORANGE),
    ]

    for letter, when, title, desc, color in steps:
        rounded_box(c, 40, y - 35, 30, 40, color)
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(55, y - 12, letter)
        c.setFont("Helvetica", 7)
        c.drawCentredString(55, y - 25, when)

        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(80, y - 5, title)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 8)
        wrap_text(c, 80, y - 18, desc, W - 120, size=8, line_height=10)

        y -= 58

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 7: RISIKEN ───────────────────────────────────────────────
    page_header(c, W, H, "Risiken & Mitigations", "Was schief gehen könnte und wie wir's abfangen", 7, total_pages)

    risks = [
        ("Preislisten kommen zu spät", "Phase 3B verzögert sich, Launch rutscht",
         "Du lieferst Preis-Anker bereits in Woche 3 (ungefähre Richtwerte), finale Preise in Woche 6.", ORANGE),
        ("Partner bestätigen nicht rechtzeitig", "Launch mit leerer Partner-Liste",
         "Launch funktioniert auch mit 0 bestätigten Partnern — Platzhalter «weitere Partner in Abklärung\" und Freitext-Fallback.", GREEN),
        ("Wix Studio Mail-Limits", "Interne Mail kommt nicht an",
         "Fallback: SendGrid-Free-Tier (100 Mails/Tag kostenlos) als zweiten Mail-Provider einbauen.", GREEN),
        ("PDF-API-Kosten explodieren", "Monatliche Kosten steigen",
         "PDFmonkey Free-Tier (50 PDFs/Mt.) reicht für Start. Upgrade nur, wenn ihr >40 Anfragen/Monat bekommt.", YELLOW),
        ("DSGVO / revDSG", "Rechtliche Probleme mit Datenspeicherung",
         "Wix ist DSGVO-konform. Ihr braucht einen geprüften DSGVO-Text. Wichtig: keine Daten ausserhalb EU/CH speichern.", RED),
        ("UX-Fehler erst beim Launch bemerkt", "Hohe Abbruch-Rate, wenige Anfragen",
         "Beta-Woche mit 3-5 echten Testanfragen vor dem Launch. Mindestens ein interner Mitarbeiter macht einen End-to-End-Testfall.", GREEN),
        ("Kunden-Akzeptanz gering", "Bestandskunden mailen weiter statt Tool zu nutzen",
         "Prominent auf Website verlinken (Homepage-Banner, Menü), im Kontakt-Flow erwähnen, Social-Post beim Launch.", YELLOW),
    ]

    y = H - 150
    for title, impact, mitigation, color in risks:
        c.setFillColor(color)
        c.circle(50, y, 7, stroke=0, fill=1)
        c.setFillColor(WHITE if color != YELLOW else NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(50, y - 3, "!")

        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(68, y + 2, title)
        c.setFillColor(RED)
        c.setFont("Helvetica-Oblique", 8)
        c.drawString(68, y - 9, f"→ Impact: {impact}")
        c.setFillColor(GREEN)
        c.setFont("Helvetica", 8)
        wrap_text(c, 68, y - 20, f"→ Mitigation: {mitigation}", W - 110, size=8, line_height=10)
        y -= 60

    page_footer(c, W, H)
    c.showPage()

    # ─── PAGE 8: SIGNOFF ───────────────────────────────────────────────
    page_header(c, W, H, "Sign-Off & Freigabe", "Dein OK für den nächsten Schritt", 8, total_pages)

    y = H - 150

    left_text(c, 40, y, "Was du jetzt entscheiden musst", "Helvetica-Bold", 14, NAVY)
    y -= 25

    items = [
        "Ist das visuelle Modell (PDF 1) so wie du es dem Team präsentieren willst?",
        "Ist die Liste der Union-Lieferungen (Seiten 4-5 dieses Berichts) vollständig und realistisch?",
        "Gibt es Blocker, an die wir nicht gedacht haben? (z. B. Urlaub, Abteilungskonflikte, Budget-Freigaben)",
        "Können wir die Spec-Datei schreiben und zum Implementierungs-Plan wechseln?",
    ]
    for item in items:
        c.setFillColor(ORANGE)
        c.rect(50, y - 3, 10, 10, stroke=0, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 10)
        c.drawString(70, y, item)
        y -= 22

    y -= 20
    rounded_box(c, 40, y - 80, W - 80, 80, BLUE_LIGHT, NAVY)
    left_text(c, 55, y - 20, "Nach deinem OK passiert folgendes:", "Helvetica-Bold", 11, NAVY)
    left_text(c, 55, y - 38, "1. Ich schreibe die finale Spec als Markdown ins Projekt-Verzeichnis", "Helvetica", 9, GREY_TEXT)
    left_text(c, 55, y - 52, "2. Wir wechseln zum superpowers:writing-plans Skill", "Helvetica", 9, GREY_TEXT)
    left_text(c, 55, y - 66, "3. Der Skill zerlegt die Spec in eine konkrete, testbare Task-Liste (Implementierungs-Plan)", "Helvetica", 9, GREY_TEXT)

    # Signature block
    y = 180
    c.setStrokeColor(GREY_BORDER)
    c.setLineWidth(0.5)
    c.line(40, y, 250, y)
    c.line(340, y, W - 40, y)
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 9)
    c.drawString(40, y - 15, "Yannis Gisler · Union Sport")
    c.drawString(40, y - 28, "Datum / Unterschrift")
    c.drawString(340, y - 15, "Claude · Build-Partner")
    c.drawString(340, y - 28, "Datum / Freigabe")

    # Contact
    y = 90
    rounded_box(c, 40, y - 30, W - 80, 35, NAVY)
    centered_text(c, 40, y - 10, W - 80, "Bei Fragen: dieses Dokument gemeinsam durchgehen — nichts unentschieden lassen.",
                  "Helvetica-Oblique", 9, WHITE)
    centered_text(c, 40, y - 25, W - 80, "Das Gesamt-Projekt steht oder fällt mit klaren Deliverables in Woche 1-6.",
                  "Helvetica-Bold", 10, ORANGE)

    page_footer(c, W, H)
    c.showPage()

    c.save()
    print(f"✅ Projekt-Bericht gespeichert: {out}")


# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    build_visual_pdf()
    build_report_pdf()
    print("\n🎉 Beide PDFs sind erstellt!")
    print("   1. /Users/yannisgisler/Documents/EventToolUnion/05_visuelles_modell.pdf")
    print("   2. /Users/yannisgisler/Documents/EventToolUnion/06_projekt_bericht.pdf")
