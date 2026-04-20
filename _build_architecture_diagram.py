#!/usr/bin/env python3
"""
Union Sport Event-Tool — Ein-Seiten Architektur-Diagramm
Technisches visuelles Modell auf A3 landscape.
"""

from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
import math

# ─── Design-Tokens ────────────────────────────────────────────────────────
NAVY = HexColor("#0F1E3D")
NAVY_LIGHT = HexColor("#1F3A6B")
ORANGE = HexColor("#FF6B35")
ORANGE_LIGHT = HexColor("#FFE5D4")
GREEN = HexColor("#06A77D")
GREEN_LIGHT = HexColor("#DFF7EC")
RED = HexColor("#E63946")
PURPLE = HexColor("#7950F2")
PURPLE_LIGHT = HexColor("#ECE5FD")
YELLOW = HexColor("#FFD166")
BLUE_LIGHT = HexColor("#E8F1FB")
GREY_BG = HexColor("#F1F3F5")
GREY_BORDER = HexColor("#CED4DA")
GREY_TEXT = HexColor("#495057")
WHITE = HexColor("#FFFFFF")
BLACK = HexColor("#212529")

OUT = "/Users/yannisgisler/Documents/EventToolUnion/05_visuelles_modell.pdf"


def rbox(c, x, y, w, h, fill, stroke=None, radius=6, sw=1):
    c.saveState()
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
        c.roundRect(x, y, w, h, radius, stroke=1, fill=1)
    else:
        c.roundRect(x, y, w, h, radius, stroke=0, fill=1)
    c.restoreState()


def ctext(c, x, y, w, text, font="Helvetica", size=9, color=BLACK):
    c.setFillColor(color)
    c.setFont(font, size)
    tw = c.stringWidth(text, font, size)
    c.drawString(x + (w - tw) / 2, y, text)


def ltext(c, x, y, text, font="Helvetica", size=9, color=BLACK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, text)


def arrow(c, x1, y1, x2, y2, color=NAVY, width=1.5, dashed=False):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    if dashed:
        c.setDash(3, 2)
    c.line(x1, y1, x2, y2)
    c.setDash()
    angle = math.atan2(y2 - y1, x2 - x1)
    al = 7
    aw = 4
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


def build():
    W, H = landscape(A3)  # 1191 x 842
    c = canvas.Canvas(OUT, pagesize=landscape(A3))

    # ═══════════════════════════════════════════════════════════════════════
    # HEADER BAR
    # ═══════════════════════════════════════════════════════════════════════
    c.setFillColor(NAVY)
    c.rect(0, H - 45, W, 45, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.rect(0, H - 50, W, 5, stroke=0, fill=1)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(25, H - 28, "UNION SPORT")
    c.setFont("Helvetica", 12)
    c.setFillColor(ORANGE)
    c.drawString(150, H - 28, "Event-Tool Architektur")
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(310, H - 28, "End-to-End System-Modell auf einer Seite")
    c.setFont("Helvetica", 9)
    c.drawRightString(W - 25, H - 22, "Wix Studio + React/TypeScript")
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 25, H - 35, "Stand: 14.04.2026")

    # ═══════════════════════════════════════════════════════════════════════
    # LAYER 1: CUSTOMER FRONTEND (Top)
    # ═══════════════════════════════════════════════════════════════════════
    layer_y = H - 95
    # Layer label
    c.setFillColor(GREY_BG)
    c.rect(10, layer_y - 265, 30, 260, stroke=0, fill=1)
    c.saveState()
    c.translate(25, layer_y - 135)
    c.rotate(90)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(0, 0, "FRONTEND  ·  Kunden-Seite")
    c.restoreState()

    # --- 3 Landing Pages ---
    lp_y = layer_y - 55
    landing_pages = [
        ("Firmenevent", "/events/firmenevent", "20-100 P.\nTeambuilding, Kickoff", ORANGE),
        ("Privatevent", "/events/privatevent", "10-30 P.\nGeburtstage, Feiern", GREEN),
        ("Schulevent", "/events/schulevent", "flexibel\nSporttag, Projektwoche", PURPLE),
    ]
    lp_w = 155
    lp_h = 65
    lp_gap = 15
    lp_start_x = 60
    for i, (title, url, desc, color) in enumerate(landing_pages):
        x = lp_start_x + i * (lp_w + lp_gap)
        rbox(c, x, lp_y, lp_w, lp_h, color, radius=6)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 10, lp_y + lp_h - 18, title)
        c.setFont("Courier", 8)
        c.drawString(x + 10, lp_y + lp_h - 30, url)
        c.setFont("Helvetica", 7)
        lines = desc.split("\n")
        for j, l in enumerate(lines):
            c.drawString(x + 10, lp_y + lp_h - 44 - j * 9, l)

    # Shared label
    ltext(c, lp_start_x, lp_y - 12, "3 dedizierte Landing-Pages — eigener Hero + Defaults pro Zielgruppe",
          "Helvetica-Oblique", 7, GREY_TEXT)

    # Arrow down to Form Component
    mid_x = lp_start_x + (lp_w * 3 + lp_gap * 2) / 2
    arrow(c, mid_x, lp_y - 20, mid_x, lp_y - 35, NAVY, 2)

    # --- Shared Form Component ---
    form_y = lp_y - 175
    form_w = lp_w * 3 + lp_gap * 2
    form_h = 130
    rbox(c, lp_start_x, form_y, form_w, form_h, BLUE_LIGHT, NAVY, radius=8, sw=1.5)

    # Form header
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(lp_start_x + 10, form_y + form_h - 18, "Shared Form Component")
    c.setFont("Helvetica", 8)
    c.setFillColor(GREY_TEXT)
    c.drawString(lp_start_x + 160, form_y + form_h - 18, "React · TypeScript · Wix Site Widget")
    c.drawRightString(lp_start_x + form_w - 10, form_y + form_h - 18, "DE / EN")

    # 7 sections as mini boxes
    sections = [
        ("1", "Basics"),
        ("2", "Location\n& Sport"),
        ("3", "Personen\n& Level"),
        ("4", "Sport-\nExtras"),
        ("5", "Verpflegung\n& Truck"),
        ("6", "Räume &\nSpecials"),
        ("7", "Kontakt"),
    ]
    sec_colors = [ORANGE, NAVY_LIGHT, GREEN, PURPLE, YELLOW, RED, NAVY]
    sw = (form_w - 30) / 7 - 5
    sy = form_y + 30
    for i, (num, title) in enumerate(sections):
        sx = lp_start_x + 15 + i * (sw + 5)
        color = sec_colors[i]
        rbox(c, sx, sy, sw, 75, color, radius=4)
        text_col = WHITE if color != YELLOW else NAVY
        c.setFillColor(text_col)
        c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(sx + sw / 2, sy + 55, num)
        c.setFont("Helvetica-Bold", 7)
        lines = title.split("\n")
        for j, l in enumerate(lines):
            c.drawCentredString(sx + sw / 2, sy + 35 - j * 9, l)

        # Star badge for sections with "Empfehlt uns" (2, 4, 6 = idx 1, 3, 5)
        if i in [1, 3, 5]:
            c.setFillColor(YELLOW)
            c.circle(sx + sw - 8, sy + 68, 5, stroke=0, fill=1)
            c.setFillColor(NAVY)
            c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(sx + sw - 8, sy + 65, "★")

    # Form-feature caption
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(lp_start_x + 10, form_y + 8,
                 "Conditional Logic  ·  Mobile-First  ·  localStorage  ·  Empfehlungs-Toggle (★)  ·  ab CHF-Anker  ·  kein Live-Total")

    # Arrow from form → submit
    submit_y = form_y - 40
    arrow(c, mid_x, form_y - 5, mid_x, submit_y + 15, NAVY_LIGHT, 2.5)

    # Submit button label on arrow
    c.setFillColor(NAVY_LIGHT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(mid_x + 8, form_y - 22, "POST /submitEventRequest")
    c.setFont("Helvetica", 7)
    c.setFillColor(GREY_TEXT)
    c.drawString(mid_x + 8, form_y - 32, "JSON payload")

    # ═══════════════════════════════════════════════════════════════════════
    # LAYER 2: BACKEND (Middle)
    # ═══════════════════════════════════════════════════════════════════════
    be_y = 340
    # Layer label
    c.setFillColor(GREEN_LIGHT)
    c.rect(10, be_y - 5, 30, 210, stroke=0, fill=1)
    c.saveState()
    c.translate(25, be_y + 100)
    c.rotate(90)
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(0, 0, "BACKEND  ·  Wix Velo / Service Plugin")
    c.restoreState()

    # Backend big container
    be_x = 55
    be_w = 720
    be_h = 200
    rbox(c, be_x, be_y, be_w, be_h, GREEN_LIGHT, GREEN, radius=8, sw=1.5)

    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(be_x + 10, be_y + be_h - 18, "Backend Endpoints & Services")
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 8)
    c.drawString(be_x + 200, be_y + be_h - 18, "— Runs on Wix Studio infrastructure")

    # 4 backend services
    services = [
        ("submitEventRequest", "Endpoint",
         "1. Validate payload\n2. Save to Submissions\n3. Trigger pipeline\n4. Return {ok, id}",
         NAVY_LIGHT),
        ("Calculation Engine", "Service Plugin",
         "Lädt PriceConfig\nIteriert über items\nBaut CostBreakdown\n+ Marge-Hinweis",
         PURPLE),
        ("PDF Generator", "External API",
         "PDFmonkey / DocRaptor\nTemplate 1: Kunde\nTemplate 2: Intern\n→ 2 PDF-URLs",
         ORANGE),
        ("Mail Dispatcher", "Triggered Email",
         "Mail 1 → Kunde\n  + Kunden-PDF\nMail 2 → Team\n  + beide PDFs",
         RED),
    ]
    svc_w = (be_w - 60) / 4 - 10
    svc_h = 140
    svc_y = be_y + 20
    for i, (title, subtitle, desc, color) in enumerate(services):
        svc_x = be_x + 30 + i * (svc_w + 13)
        rbox(c, svc_x, svc_y, svc_w, svc_h, WHITE, color, radius=6, sw=1.5)
        # Header
        rbox(c, svc_x, svc_y + svc_h - 30, svc_w, 30, color, radius=6)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(svc_x + svc_w / 2, svc_y + svc_h - 15, title)
        c.setFont("Helvetica-Oblique", 7)
        c.drawCentredString(svc_x + svc_w / 2, svc_y + svc_h - 25, subtitle)
        # Body
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 7)
        lines = desc.split("\n")
        for j, l in enumerate(lines):
            c.drawString(svc_x + 8, svc_y + svc_h - 45 - j * 11, l)

        # Step number badge
        c.setFillColor(NAVY)
        c.circle(svc_x + 10, svc_y + svc_h - 8, 8, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(svc_x + 10, svc_y + svc_h - 11, str(i + 1))

        # Chain arrow to next
        if i < 3:
            arrow(c, svc_x + svc_w + 2, svc_y + svc_h / 2 + 5, svc_x + svc_w + 11, svc_y + svc_h / 2 + 5, GREEN, 1.5)

    # Submit arrow from form to backend
    arrow(c, mid_x, submit_y + 15, be_x + svc_w / 2 + 30, be_y + be_h, NAVY_LIGHT, 2)

    # ═══════════════════════════════════════════════════════════════════════
    # LAYER 3: DATA LAYER (Bottom)
    # ═══════════════════════════════════════════════════════════════════════
    dl_y = 110
    # Layer label
    c.setFillColor(PURPLE_LIGHT)
    c.rect(10, dl_y - 5, 30, 130, stroke=0, fill=1)
    c.saveState()
    c.translate(25, dl_y + 60)
    c.rotate(90)
    c.setFillColor(PURPLE)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(0, 0, "DATA  ·  Wix Data Collections")
    c.restoreState()

    collections = [
        ("Partners", "Collection",
         "id · name · category\nlogo · priceAnchor\nstatus · descriptionDe\ndescriptionEn · sortOrder",
         "pending / active / paused"),
        ("PriceConfig", "Collection (JSON)",
         "courts · coaching\nequipment · tournament\nfood · rooms · prizes",
         "Versionierung via Wix History"),
        ("Submissions", "Collection",
         "id · createdAt · payload\neventType · location\ncustomerPdfUrl · internalPdfUrl\ninternalTotal · status",
         "Historie + Inbox-Ansicht"),
    ]
    col_w = 220
    col_h = 115
    col_gap = 25
    col_start_x = 55
    for i, (title, subtitle, fields, note) in enumerate(collections):
        cx = col_start_x + i * (col_w + col_gap)
        rbox(c, cx, dl_y, col_w, col_h, WHITE, PURPLE, radius=6, sw=1.5)
        rbox(c, cx, dl_y + col_h - 28, col_w, 28, PURPLE, radius=6)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(cx + 10, dl_y + col_h - 14, title)
        c.setFont("Helvetica-Oblique", 7)
        c.drawString(cx + 10, dl_y + col_h - 24, subtitle)
        # Fields
        c.setFillColor(NAVY)
        c.setFont("Courier", 7)
        lines = fields.split("\n")
        for j, l in enumerate(lines):
            c.drawString(cx + 10, dl_y + col_h - 42 - j * 10, l)
        # Note
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica-Oblique", 6)
        c.drawString(cx + 10, dl_y + 8, note)

    # Arrows from backend to collections
    for i in range(3):
        src_x = be_x + 30 + (i + 1) * (svc_w + 13) - (svc_w + 13) / 2
        dst_x = col_start_x + i * (col_w + col_gap) + col_w / 2
        arrow(c, src_x, svc_y, dst_x, dl_y + col_h, PURPLE, 1, dashed=True)

    # ═══════════════════════════════════════════════════════════════════════
    # RIGHT COLUMN: ADMIN + OUTPUTS + EXTERNAL
    # ═══════════════════════════════════════════════════════════════════════
    rc_x = 800
    rc_w = 370

    # --- Admin Panel (top right) ---
    adm_y = lp_y - 20
    adm_h = 180
    rbox(c, rc_x, adm_y - adm_h, rc_w, adm_h + 20, ORANGE_LIGHT, ORANGE, radius=8, sw=1.5)
    rbox(c, rc_x, adm_y, rc_w, 22, ORANGE, radius=8)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(rc_x + 10, adm_y + 7, "ADMIN  ·  Wix Dashboard Page")
    c.setFont("Helvetica-Oblique", 8)
    c.drawRightString(rc_x + rc_w - 10, adm_y + 7, "Nur Union-Sport Team")

    # Admin features
    features = [
        ("Partner-Manager", "Partner anlegen / editieren, Logo upload, Status toggle", "Vito · Acento · Luen · Gelateria · DJ"),
        ("Preis-Editor", "PriceConfig JSON pflegen, Versionierung", "Courts · Coaching · Equipment · F&B · Räume"),
        ("Submissions Inbox", "Event-Anfragen sichten, Status aktualisieren", "Neu → Bearbeitet → Offerte → Bestätigt → Done"),
    ]
    fy = adm_y - 20
    for title, desc, tags in features:
        rbox(c, rc_x + 12, fy - 45, rc_w - 24, 42, WHITE, ORANGE, radius=4)
        c.setFillColor(ORANGE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(rc_x + 20, fy - 12, title)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 7)
        c.drawString(rc_x + 20, fy - 23, desc)
        c.setFillColor(NAVY)
        c.setFont("Courier", 6)
        c.drawString(rc_x + 20, fy - 34, tags)
        fy -= 50

    # Arrows from admin to data (dashed = read/write)
    arrow(c, rc_x + 20, adm_y - adm_h, col_start_x + col_w / 2, dl_y + col_h, ORANGE, 1, dashed=True)
    arrow(c, rc_x + rc_w / 2, adm_y - adm_h, col_start_x + col_w + col_gap + col_w / 2, dl_y + col_h, ORANGE, 1, dashed=True)
    arrow(c, rc_x + rc_w - 20, adm_y - adm_h, col_start_x + 2 * (col_w + col_gap) + col_w / 2, dl_y + col_h, ORANGE, 1, dashed=True)

    # --- Outputs (Email destinations) ---
    out_y = be_y + 60
    out_w = rc_w
    out_h = 150

    # Customer email
    rbox(c, rc_x, out_y, out_w, 65, BLUE_LIGHT, NAVY_LIGHT, radius=6, sw=1.5)
    c.setFillColor(NAVY_LIGHT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(rc_x + 12, out_y + 48, "→  Kunde  (Mail 1)")
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 7)
    c.drawString(rc_x + 12, out_y + 36, "Thank-You-Mail mit:")
    c.setFillColor(NAVY)
    c.setFont("Helvetica", 7)
    c.drawString(rc_x + 20, out_y + 24, "·  Kunden-PDF (Zusammenfassung)")
    c.drawString(rc_x + 20, out_y + 14, "·  Hinweis: Antwort innert 24h")
    c.drawString(rc_x + 20, out_y + 4, "·  DE oder EN (je nach Sprachwahl)")

    # Team email
    rbox(c, rc_x, out_y - 80, out_w, 75, ORANGE_LIGHT, ORANGE, radius=6, sw=1.5)
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(rc_x + 12, out_y - 12, "→  events@union-sport.ch  (Mail 2)")
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 7)
    c.drawString(rc_x + 12, out_y - 24, "Interne Triage-Mail mit:")
    c.setFillColor(NAVY)
    c.setFont("Helvetica", 7)
    c.drawString(rc_x + 20, out_y - 36, "·  Kunden-PDF (wie oben)")
    c.drawString(rc_x + 20, out_y - 46, "·  Interne Kalkulation-PDF mit Totalen")
    c.drawString(rc_x + 20, out_y - 56, "·  Marge-Puffer-Hinweis (+15-25 %)")
    c.drawString(rc_x + 20, out_y - 66, "·  Nicht-sicher-Felder rot markiert")

    # Arrows from Mail Dispatcher to outputs
    mail_svc_x = be_x + 30 + 3 * (svc_w + 13) + svc_w / 2
    arrow(c, mail_svc_x + svc_w / 2, svc_y + svc_h - 15, rc_x, out_y + 30, RED, 2)
    arrow(c, mail_svc_x + svc_w / 2, svc_y + svc_h - 40, rc_x, out_y - 45, RED, 2)

    # ═══════════════════════════════════════════════════════════════════════
    # BOTTOM: LEGEND + SCOPE NOTES
    # ═══════════════════════════════════════════════════════════════════════
    # Legend
    lg_y = 55
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(55, lg_y, "Legende")

    legend_items = [
        (ORANGE, "Kunde / Frontend"),
        (GREEN, "Backend / Services"),
        (PURPLE, "Daten-Layer"),
        (NAVY_LIGHT, "System / Flow"),
        (RED, "Mail-Output"),
        (YELLOW, "★ Empfehlungs-Toggle"),
    ]
    lx = 105
    for color, label in legend_items:
        c.setFillColor(color)
        c.rect(lx, lg_y - 3, 10, 10, stroke=0, fill=1)
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 7)
        c.drawString(lx + 13, lg_y, label)
        lx += 130

    # Arrow legend
    c.setFillColor(NAVY)
    c.setLineWidth(1.5)
    c.line(55, 38, 80, 38)
    arrow(c, 75, 38, 85, 38, NAVY, 1.5)
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 7)
    c.drawString(92, 35, "Datenfluss (synchron)")

    c.setStrokeColor(PURPLE)
    c.setDash(3, 2)
    c.setLineWidth(1)
    c.line(220, 38, 250, 38)
    c.setDash()
    arrow(c, 245, 38, 255, 38, PURPLE, 1)
    c.drawString(262, 35, "DB read/write")

    c.setStrokeColor(ORANGE)
    c.setDash(3, 2)
    c.line(370, 38, 400, 38)
    c.setDash()
    arrow(c, 395, 38, 405, 38, ORANGE, 1)
    c.drawString(412, 35, "Admin edit")

    # Badge: "star = Empfehlungs-Toggle"
    c.setFillColor(YELLOW)
    c.circle(520, 38, 5, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(520, 35, "★")
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 7)
    c.drawString(530, 35, "Empfehlt-uns-Option")

    # Scope note bottom right
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(740, 50, "Ausser-Scope v1: Playtomic-Integration, Online-Payment, Multi-Day, Cal.com, FR")
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(740, 38, "Phased Build: P1 Foundation · P2 Form/UI · P3 Backend · P3B PriceConfig · Beta · Launch")
    c.setFont("Helvetica-Oblique", 7)
    c.drawString(740, 26, "Tech-Stack: Wix Studio · Wix CLI · React · TypeScript · Git · Staging/Prod")

    # Footer bar
    c.setFillColor(NAVY)
    c.rect(0, 0, W, 15, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 7)
    c.drawString(25, 5, "Union Sport Event-Tool · Architektur-Diagramm · Intern")
    c.drawRightString(W - 25, 5, "www.union-sport.ch  ·  events@union-sport.ch")

    c.showPage()
    c.save()
    print(f"Architektur-Diagramm gespeichert: {OUT}")


if __name__ == "__main__":
    build()
