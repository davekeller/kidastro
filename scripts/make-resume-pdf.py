#!/usr/bin/env python3
"""Generate public/dave-keller-resume.pdf from the resume page content.

The content below mirrors components/resume/resumeData.ts and Header.tsx —
update both together, then rerun:

    python3 -m pip install reportlab pillow
    python3 scripts/make-resume-pdf.py
"""

import io
from pathlib import Path

from PIL import Image as PILImage, ImageDraw, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable, HRFlowable, Image, KeepTogether, Paragraph,
    SimpleDocTemplate, Spacer, Table, TableStyle,
)

REPO = Path(__file__).resolve().parent.parent
AVATAR_SRC = REPO / "public" / "imgs" / "dave.jpg"
OUT = REPO / "public" / "dave-keller-resume.pdf"

# Emphasis weight for the primary contact link. reportlab's built-in Helvetica
# ships only Regular and Bold, so embed Helvetica Neue Medium (a true semibold
# step) when the macOS system font is present; fall back to Bold elsewhere so
# the script still runs on machines without it (e.g. CI).
EMPHASIS_FONT = "Helvetica-Bold"
try:
    pdfmetrics.registerFont(
        TTFont("HelveticaNeue-Medium", "/System/Library/Fonts/HelveticaNeue.ttc", subfontIndex=10)
    )
    EMPHASIS_FONT = "HelveticaNeue-Medium"
except Exception:
    pass

# ---- Style rules -----------------------------------------------------------

INK = HexColor("#1a1a1a")     # body text
GRAY = HexColor("#555555")    # secondary text (roles, contact)
LIGHT = HexColor("#999999")   # section titles
RULE = HexColor("#dddddd")    # horizontal rules

BODY = 9.5                    # body font size
SMALL = 9                     # contact, dates, section titles
LEADING = 13                  # line height for all body text
GAP = 4                       # space after a body paragraph
TOP_GAP = 7                   # space after highlights/skills bullets
JOB_GAP = 13                  # space before each job entry (frame uses max(prev spaceAfter, this), not sum)
SECTION_GAP = 12              # space before each section title

MARGIN = 0.75 * inch
CONTENT_W = letter[0] - 2 * MARGIN - 12  # frame pads 6pt per side
DATES_W = 2.4 * inch
AVATAR_W = 0.72 * inch

NBSP = " "  # non-breaking space; load-bearing in pretty()

def style(name, **kw):
    base = dict(fontName="Helvetica", fontSize=BODY, leading=LEADING, textColor=INK)
    return ParagraphStyle(name, **{**base, **kw})

styles = {
    "name": style("name", fontName="Helvetica-Bold", fontSize=22, leading=26),
    "subtitle": style("subtitle", fontSize=10.5, leading=14, textColor=GRAY),
    "contact": style("contact", fontSize=SMALL, textColor=GRAY, alignment=TA_RIGHT),
    "body": style("body", spaceAfter=GAP),
    "keywords": style("keywords", fontSize=9, leading=12, spaceAfter=GAP),
    "bullet": style("bullet", spaceAfter=GAP, leftIndent=12),
    "topbullet": style("topbullet", spaceAfter=TOP_GAP, leftIndent=12),
    "jobhead": style("jobhead", fontName="Helvetica-Bold", fontSize=10.5, leading=14),
    "jobdates": style("jobdates", fontSize=SMALL, leading=14, textColor=GRAY, alignment=TA_RIGHT),
    "jobrole": style("jobrole", fontName="Helvetica-Oblique", textColor=GRAY, spaceAfter=2),
}

FLUSH = [
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]

# ---- Building blocks -------------------------------------------------------

class SectionTitle(Flowable):
    """Uppercase label with uniform letter-spacing (0.2em, like the site)."""

    def __init__(self, text):
        super().__init__()
        self.text = text.upper()

    def wrap(self, availWidth, availHeight):
        return (availWidth, SMALL + 3)

    def draw(self):
        t = self.canv.beginText(0, 3)
        t.setFont("Helvetica-Bold", SMALL)
        t.setFillColor(LIGHT)
        t.setCharSpace(SMALL * 0.2)
        t.textOut(self.text)
        self.canv.drawText(t)


def pretty(text):
    """Glue the trailing words with non-breaking spaces so a paragraph's last
    line never ends up as a single short orphan word (like CSS text-pretty)."""
    words = text.split(" ")
    if len(words) < 4:
        return text
    glued = words.pop()
    for _ in range(2):  # glue at most 2 extra words
        if len(glued) >= 12 or len(words) < 2:
            break
        glued = words.pop() + NBSP + glued
    return " ".join(words + [glued])


def section(title):
    return [
        Spacer(1, SECTION_GAP),
        SectionTitle(title),
        Spacer(1, GAP),
        HRFlowable(width="100%", thickness=0.5, color=RULE, spaceAfter=6),
    ]


def bullets(items, style_name="bullet"):
    return [Paragraph(pretty(item), styles[style_name], bulletText="+") for item in items]


def job(company, dates, location, role, summary, job_bullets):
    head = Table(
        [[Paragraph(company, styles["jobhead"]), Paragraph(dates, styles["jobdates"])]],
        colWidths=[CONTENT_W - DATES_W, DATES_W],
        style=TableStyle(FLUSH), hAlign="LEFT",
        spaceBefore=JOB_GAP,  # unlike a Spacer, dropped at the top of a page
    )
    return [KeepTogether([
        head,
        Paragraph(f"{role} &middot; {location}", styles["jobrole"]),
        Paragraph(pretty(summary), styles["body"]),
        *bullets(job_bullets),
    ])]


def circle_avatar():
    """Circle-cropped copy of the site avatar on white, as an in-memory JPEG.

    216px = 300 DPI at the rendered 0.72in; JPEG passes through to the PDF
    untouched where a PNG would be flate-recompressed to ~365KB.
    Grayscale so the PDF prints cleanly without color (and saves a few KB).
    The mask is drawn at 4x and downsampled for an antialiased edge.
    """
    size = 216
    src = ImageOps.fit(PILImage.open(AVATAR_SRC).convert("L"), (size, size), PILImage.LANCZOS)
    mask = PILImage.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4, size * 4), fill=255)
    out = PILImage.new("L", (size, size), 255)
    out.paste(src, (0, 0), mask.resize((size, size), PILImage.LANCZOS))
    buf = io.BytesIO()
    out.save(buf, "JPEG", quality=85)
    buf.seek(0)
    return buf


# ---- Content (mirrors components/resume/resumeData.ts + Header.tsx) --------

TITLE = "design engineer / lead product designer"
CONTACT = (
    '512.595.6213&nbsp;&nbsp;|&nbsp;&nbsp;'
    '<a href="https://www.linkedin.com/in/dkells/">linkedin/dkells</a><br/>'
    '<a href="mailto:davekeller@me.com">davekeller@me.com</a><br/>'
    f'<font name="{EMPHASIS_FONT}"><a href="https://kidastro.com">kidastro.com</a></font>'
)

highlights = [
    "15+ years leading design on dev/product teams at early-seed startups, often 0 to 1, with experience across industries — AI, data science, entertainment, messaging, ecommerce, fintech and more",
    "Strategic product thinker, Figma expert, and front-end dev (HTML/CSS, Tailwind, Claude Code). Experienced in validating ideas with design sprints, prototyping end-to-end flows, and refining production UIs in code",
    "Fluent in agile/sprint workflows and in building process for product teams. Helped create a 'Shape Up' process that organized a ~45-developer company into four product teams, building cross-functionally and shipping consistently on a staggered cadence",
    "Shipped 40+ products across web, iOS, and Android — including a #1 Paid iPhone app and a platform that grossed $33M in year one. Co-founded a 20-person agency and a messaging app that raised $3M",
]

skills = [
    "Expert in Figma &amp; design systems — multi-platform component libraries, prototyping, hand-off",
    "Designing in front-end (prototypes to production) with Claude Code, Cursor and Tailwind",
    "Comfortable writing HTML / CSS / JS and working in React / Next.js / Tailwind CSS / TypeScript",
    "Fluent in GitHub — push/pull, branches, and PRs; Linear, Trello and Notion for sprint planning and docs",
]

# Keyword-dense tech line — exact tokens for ATS/keyword scans. Mirrors the
# `tools` array in components/resume/resumeData.ts (update together).
tools = (
    "Figma &middot; React &middot; Next.js &middot; TypeScript &middot; JavaScript &middot; HTML &middot; CSS &middot; "
    "Tailwind CSS &middot; Framer Motion &middot; design systems &middot; component libraries &middot; prototyping &middot; "
    "wireframing &middot; responsive design &middot; interaction design &middot; motion design &middot; "
    "front-end development &middot; UI/UX design &middot; product design &middot; Git &middot; GitHub &middot; "
    "Claude Code &middot; Cursor &middot; Linear &middot; Notion &middot; iOS &middot; Android &middot; Agile &middot; "
    "Shape Up &middot; design sprints"
)

jobs = [
    ("Strangeworks", "Oct 2023 – Present", "Remote / Austin, TX",
     "Design Engineer / Director of Product &middot; promoted from Senior Product Designer (Apr 2024)",
     "Lead product strategy and design at this data-science consulting company, building a suite of tools, apps, and optimization interfaces for Fortune 500 science teams running AI and quantum/HPC compute.",
     [
         "Promoted to Director of Product in 6 months. Researched internal processes and designed the vision for our workflow app Aura — hands-on from business strategy to production code",
         "Embedded with engineering, leadership, and the science team to prototype and ship across our compute platform, the Aura workflow app, docs, and multiple marketing sites",
         "Designed an AI-assisted app for data-science problem formulation and computation on HPC/quantum, plus dozens of client apps for optimization problems like staff scheduling and fleet vehicle routing",
     ]),
    ("QuotaPath", "Jan 2022 – Oct 2023", "Hybrid / Austin, TX",
     "Senior Product UX/UI Designer",
     "Led design across multiple product teams at this Series B SaaS platform for sales commission planning and tracking.",
     [
         "Shipped platform features monthly, from comp modeling and onboarding to sandbox and payout workflows",
         "Designed and launched the Compensation Hub, a commission library and modeling tool that drove $1.5M+ in new pipeline in a year",
         "Co-created the Shape Up process across 4 cross-functional teams and mentored the designers running it",
     ]),
    ("OneAssembly", "Feb 2021 – Jan 2022", "Austin, TX",
     "Product UX/UI Design Lead &middot; Front-End Developer",
     "Designed and built this B2B device auction platform from idea to launch in a year, grossing $3M+ in the first beta month and $33M+ in year one.",
     [
         "Took the product from whiteboard to production launch on a 3-person dev team",
         "Designed most of it directly in code (React, Tailwind), plus the brand, marketing site, and go-to-market",
     ]),
    ("BnbFinder (now Savvy.com)", "May 2019 – Feb 2021", "Austin, TX",
     "Product UX/UI Design Lead &middot; Front-End Developer",
     "Designed and built this travel listings platform to 8K subscribers (4K+ paid) in under a year on a 3-person team.",
     [
         "Built the consumer, owner, and admin apps in Elixir and React/Next.js on a custom Tailwind framework",
         "Shipped responsive front-ends across all three surfaces, demoing to stakeholders every two weeks",
     ]),
    ("Phobio : Rodio", "Jan 2018 – May 2019", "Austin, TX",
     "Product UX/UI Design Lead",
     "Designed Rodio, a retail workforce communication platform. Partnered with Fortune-100 Kronos and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.",
     [
         "Built Rodio's multi-platform design system (master, web, iOS, Android) and led a team of 20 to 20K+ paid users",
         "Designed and pitched the demo that closed the Kronos and Form.com contracts and led to acquisition",
     ]),
    ("Timebomb", "Sep 2015 – Dec 2017", "Austin, TX",
     "Co-Founder &middot; Product UX/UI Design Lead",
     "Co-founded and designed this conditional messaging app (iOS and Android). Raised $3M from angels including Katy Perry and Warner Bros., with a marketing partnership from Ellen.",
     [
         "Led a product team of 10 from concept to launch and 20K+ users",
         "Designed the pitch decks behind the $3M raise",
     ]),
    ("Made by Rocket", "Aug 2009 – Nov 2017", "Austin, TX",
     "Co-Founder &middot; Product Designer &middot; Front-End Developer",
     "Co-founded and grew this agency to 20 people across 30+ projects, including a #1 Paid iPhone app and work for Ellen, Need for Speed, DreamWorks, and The Economist. Became an ideation and prototyping lab for Warner Bros.",
     [
         "Designed and shipped A Beautiful Mess, a photo editor that hit #1 Paid on the App Store and held top-100 for over a year",
         "Designed and prototyped apps for 30+ clients, from Ellen and DreamWorks to early-stage startups",
     ]),
]

interests = (
    "Guitar and vocals in a rock/metal band &middot; Recording and mixing in Logic Pro &middot; "
    "Indoor soccer and racquetball &middot; Mountain biking and endurance sports &middot; "
    "International travel (fluent in Spanish) &middot; Adventures with my kids"
)

# ---- Build -----------------------------------------------------------------

doc = SimpleDocTemplate(
    str(OUT), pagesize=letter,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=0.65 * inch, bottomMargin=0.65 * inch,
    title="Dave Keller — Resume", author="Dave Keller",
)

header = Table(
    [[
        Image(circle_avatar(), width=AVATAR_W, height=AVATAR_W),
        [
            Paragraph("Dave Keller", styles["name"]),
            Spacer(1, 3),
            Paragraph(TITLE, styles["subtitle"]),
        ],
        Paragraph(CONTACT, styles["contact"]),
    ]],
    colWidths=[1.0 * inch, CONTENT_W - 1.0 * inch - DATES_W, DATES_W],
    style=TableStyle(FLUSH + [("VALIGN", (0, 0), (-1, -1), "MIDDLE")]),
    hAlign="LEFT",
)

story = [
    header,
    Spacer(1, GAP),
    *section("Highlights"),
    *bullets(highlights, style_name="topbullet"),
    *section("Skills"),
    *bullets(skills, style_name="topbullet"),
    *section("Experience"),
]
for j in jobs:
    story += job(*j)
story.append(KeepTogether(section("Interests") + [Paragraph(pretty(interests), styles["body"])]))
story.append(KeepTogether(section("Tools & Technologies") + [Paragraph(pretty(tools), styles["keywords"])]))

doc.build(story)
print("wrote", OUT.relative_to(REPO))
