# kidastro.com — copy voice & positioning

The reference for all copy on the site (folio, resume, hidden pages). When writing or editing copy, match this.

## Positioning

Dave Keller is a **product designer / design engineer / inventor**, targeting the upper end of senior design — Principal / Staff / Lead Product Designer and Design Engineer roles.

The through-line: a designer who does the strategy and the craft for hard, technical products (AI, data science, fintech, and more) **and ships the front-end himself**, now AI-accelerated (Claude Code, Cursor). The 0→1 / founder track record is proof of autonomy, not the headline. He's open to work.

## Voice — how it should sound

- **Short and concrete.** Two short sentences per idea, max. Cut filler. A specific number or noun beats an adjective.
- **Personable and human.** First person and warm on the folio ("Hi, I'm Dave", "thanks for poking around", "hit me up"). A little wry is welcome.
- **Lowercase headlines.** e.g. "so nice to meet you", the resume tagline.
- **Resume = tight fragments.** Impersonal (no "I"), one clean idea per bullet. Two-sentence bullets are fine when they earn it.
- **Slashes for combos.** "product designer / design engineer / inventor", "HTML/CSS", "product/dev teams", "agile/sprint".
- **Outcomes and proof.** Lead with real results (#1 Paid iPhone app, $33M in year one, $3M raised, 0→1). Show, don't tell.
- **Honest.** Present-tense "designs and ships code" is fair — he codes daily with Claude Code and has a production front-end history. Never overstate scope.

## Don't

- No buzzwords / boilerplate: "passionate", "results-driven", "proven track record", "delightful experiences", "wearing many hats", "leverage", "synergy".
- Avoid "expert" and "principal-level" as **self-applied labels**. Let the work and the Director of Product title carry seniority. ("principal-level" was removed from the resume tagline for this reason — keep it out of headline/title copy.)
- No triplet cadence ("designs it, codes it, ships it").
- No em-dash stuffing — one per sentence, tops.
- No JD keyword-stuffing ("compress execution", "make model risk legible").

## Reference copy (approved — use as the benchmark)

**Folio hero**

> so nice to meet you
>
> Hi, I'm Dave — a product designer and design engineer. For 15+ years I've made hard, technical things feel simple, most recently AI and quantum platforms for Fortune 500 science teams.
>
> I don't just hand off a mockup. I design it and ship the front-end too — React, Next.js, Tailwind — now with Claude Code and Cursor in the loop. Thanks for poking around.

**Resume tagline:** product designer / design engineer / inventor

**Resume highlights** (the voice benchmark)

> - 15+ years leading design on dev/product teams at early-seed startups, often 0 to 1, with experience across industries — AI, data science, entertainment, messaging, ecommerce, fintech and more
> - Strategic product thinker, Figma expert, and front-end dev (HTML/CSS, Tailwind, Claude Code). Experienced in validating ideas with design sprints, prototyping end-to-end flows, and refining production UIs in code
> - Fluent in agile/sprint workflows and in building process for product teams. Helped create a 'Shape Up' process that organized a ~45-developer company into four product teams, building cross-functionally and shipping consistently on a staggered cadence
> - Shipped 40+ products across web, iOS, and Android — including a #1 Paid iPhone app and a platform that grossed $33M in year one. Co-founded a 20-person agency and a messaging app that raised $3M

## Where copy lives

- **Folio hero:** `components/Intro.tsx`
- **Folio projects:** `components/{Quotapath,Rodio,Bnbfinder,Rocket,Timebomb,Dancefight}.tsx`
- **Accomplishments / Footer:** `components/{Accomplishments,Footer}.tsx`
- **Resume:** `components/resume/Header.tsx` + `components/resume/resumeData.ts`
- **Hidden skills page:** `components/skills/SkillsView.tsx` + `skillsData.ts`
- **Metadata:** `app/layout.tsx` (home), `app/resume/page.tsx` (resume)
