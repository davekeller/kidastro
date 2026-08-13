# kidastro.com — copy voice & positioning

The reference for all copy on the site (folio, resume, hidden pages). When writing or editing copy, match this. Keep it current — when the site copy changes, update the reference examples below.

## Positioning

Dave Keller is a **product designer / design engineer / inventor**, targeting the upper end of senior design — Principal / Staff / Lead Product Designer and Design Engineer roles.

The through-line: a designer who does the strategy and the craft for hard, technical products (AI, data science, fintech, and more) **and ships the front-end himself**, now AI-accelerated (Claude Code, Cursor). The 0→1 / founder track record is proof of autonomy, not the headline. He's open to work.

## Voice — how it should sound

- **Short and concrete.** Two short sentences per idea, max. Cut filler. A specific number or noun beats an adjective.
- **Personable and human.** First person and warm on the folio ("Hi, I'm Dave", "thanks for poking around", "hit me up"). A little wry is welcome.
- **Lowercase headlines.** e.g. "so nice to meet you", the resume tagline.
- **Resume = tight fragments.** Impersonal (no "I"), one clean idea per bullet. Two-sentence bullets are fine when they earn it.
- **Slashes for combos, "&" for job titles.** Combos take a slash: "product designer / design engineer / inventor", "HTML/CSS", "product/dev teams", "agile/sprint". A *title* — anything that names a role someone held — takes an ampersand: "Principal Product Designer & Design Engineer", "Co-Founder & Product Designer". Every resume title row uses "&"; middots and slashes were retired from them on 2026-08-13.
- **Outcomes and proof.** Lead with real results (#1 Paid iPhone app, $33M in year one, $3M raised, 0→1). Show, don't tell.
- **Honest.** Present-tense "designs and ships code" is fair — he codes daily with Claude Code and has a production front-end history. Never overstate scope.

## Don't

- No buzzwords / boilerplate: "passionate", "results-driven", "proven track record", "delightful experiences", "wearing many hats", "leverage", "synergy".
- Avoid "expert" and "principal-level" as **self-applied labels**. Let the work and the job title carry seniority. ("principal-level" was removed from the resume tagline for this reason — keep it out of headline/title copy.)
- **"Principal" attaches to the job, "lead" floats free.** "Principal" is a ladder rung — it only means something relative to a company, so it belongs on the Strangeworks role (where it *is* the title) and on the resume header directly above it. Site-wide metadata and SEO titles use "lead product designer" instead: unattached to an employer, "principal" reads as a self-applied level claim, while "lead" reads as a description of what he does. Keywords arrays are the exception — carry principal / lead / staff there, since that's matching, not positioning.
- No triplet cadence ("designs it, codes it, ships it").
- No em-dash stuffing — one per sentence, tops.
- No JD keyword-stuffing ("compress execution", "make model risk legible").
- No ASCII emoticons (`:)`, `:P`). The site is meticulously designed; an emoticon
  is the one undesigned element on the page, and `:P` reads young for the roles
  being targeted. Get the humor from the words.
- Don't *open* on the past. "I was writing front-end code before AI" as the first
  thing read is defensive. Placed mid-sentence, after the positioning has landed,
  it's earned context — it frames agentic coding as continuity rather than a
  recent conversion, which is the point. That's the shape the resume summary and
  the folio hero use now. The rule is about position, not the fact.

## Writing the "who I am" description

This description exists in several places (folio hero, Strangeworks card, resume
summary, metadata). The **folio hero is canonical** — the others should follow
its shape, at their own length.

1. **Label stack — three items, no more.** "a strategic product thinker, Figma
   expert, and pixel-perfect front-end/design engineer." A fourth label dilutes
   the other three; fold extra adjectives into a noun instead ("pixel-perfect"
   modifies the engineer rather than standing on its own).
2. **State tenure plainly.** "I've been leading design at early-stage startups
   for over a decade." Don't editorialize the years — "I've developed a
   superpower:" was cut for exactly this reason.
3. **Present tense, forward-facing.** "I was writing front-end code before AI —
   now primarily designing in the browser with Claude Code, Codex, and Tailwind."
   Agentic coding is momentum and method — never an identity ("agentic
   designer"). The pre-AI clause is allowed to set up the present, never to
   defend it; the sentence still has to land on current practice.
4. **Tools, then outcome — one verb each.** Claude Code, Codex, and Tailwind are
   the how; "validating functional prototypes and shipping production code" is
   the what. Prototypes get *validated*, code gets *shipped*. Don't collapse two
   different activities under one verb.
5. **Close on something measurable.** "in days, not weeks." The last thing read
   should be provable, not adjectival.
6. **A dry closer is allowed on the folio** (not the resume): "Now scroll. I'll
   wait." Two beats, no punctuation art.

**Slash compounds:** write "front-end/design engineer", not "design/front-end
engineer". It keeps the contiguous string "design engineer" — the exact title
being targeted, so recruiter and ATS phrase matching hits it — and puts it in
the emphatic final position. The preceding labels already establish
designer-first, so leading the compound with "front-end" costs nothing.

**Length and wrapping (hero only):** two paragraphs, two balanced lines each, at
`max-w-[960px]` with `text-balance` inside a `max-w-[1010px]` wrapper. Roughly
25–33 words per paragraph holds two lines; past ~40 it breaks to three and the
rhythm goes. Below ~863px of viewport it returns to three lines, which is
correct.

## Reference copy (approved — use as the benchmark)

**Folio hero**

> so nice to meet you
>
> Hi, I'm Dave — a strategic product thinker, Figma expert, and pixel-perfect front-end/design engineer. I've been leading design at early-stage startups for over a decade.
>
> I was writing front-end code before AI — now primarily designing in the browser with Claude Code, Codex, and Tailwind, validating functional prototypes and shipping production code in days, not weeks. Now scroll. I'll wait.

**Resume summary** (the page only — the PDF and DOCX go straight from the header
into Highlights)

> Strategic product thinker, Figma expert, and front-end/design engineer. I was writing front-end code before AI — now primarily designing in the browser with Claude Code, Codex and Tailwind — validating functional prototypes and shipping production code in days, not weeks.

**Resume header tagline:** principal product designer & design engineer
(Mirrored in `components/resume/Header.tsx`, `scripts/make-resume-pdf.py`, and
`scripts/make-resume-docx.js` — update all three together.)

**Site metadata title:** Dave Keller — Lead Product Designer & Design Engineer

**Resume highlights** (the voice benchmark)

> - 15+ years leading design at early-stage startups — from 0 → 1 through 2.0 and GTM. Across AI, data science, entertainment, messaging, ecommerce, and fintech.
> - A pixel-perfect designer who ships in code. Sweating the visual details — prototyping end-to-end flows and refining high-fidelity production UIs directly in front-end code.
> - Design systems architect and process builder. Architected multi-platform design systems. Built a product process that organized a ~45-developer company into 4 cross-functional teams shipping on a steady cadence.
> - Track record. 40+ products across web, iOS, and Android — including a #1 Paid iPhone app and a 0 → 1 platform that grossed $33M in year one.
> - Founder & client services. Co-founded a 20-person design/dev agency and a $3M-funded messaging app. The agency became a concepting and prototyping shop for Warner Bros. — with work for Ellen, DreamWorks, and The Economist along the way.

Note the shape each bullet shares: a short label sentence, then the detail.

**Resume skills & tools**

> - Expert in Figma & design systems — multi-platform component libraries, prototyping, hand-off
> - Experienced designing in the front-end (prototypes to production) with Claude Code, Cursor, and Tailwind
> - Comfortable writing HTML / CSS / JS and working in React / Next.js / Tailwind CSS / TypeScript
> - Fluent in GitHub — push/pull, branches, and PRs; Linear, Trello, and Notion for sprint planning and docs

Each bullet opens on an adjective — Expert / Experienced / Comfortable / Fluent.
Serial commas throughout; the resume uses them everywhere.

## Where copy lives

- **Folio hero:** `components/Intro.tsx`
- **Folio projects:** `components/{Quotapath,Rodio,Bnbfinder,Rocket,Timebomb,Dancefight}.tsx`
- **Accomplishments / Footer:** `components/{Accomplishments,Footer}.tsx`
- **Resume:** `components/resume/Header.tsx` + `components/resume/resumeData.ts`
- **Hidden skills page:** `components/skills/SkillsView.tsx` + `skillsData.ts`
- **Mission Control (secret nav):** `components/mission-control/MissionControl.tsx` for the
  header and telemetry strip; per-destination titles and blurbs in
  `components/mission-control/destinations.ts`
- **Metadata:** `app/layout.tsx` (home), `app/resume/page.tsx` (resume)
