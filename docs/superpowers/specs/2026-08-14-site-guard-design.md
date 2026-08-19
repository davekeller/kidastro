# Site guard — design

**Date:** 2026-08-14
**Status:** draft

## Why

kidastro.com is a portfolio, and recruiters read it. Four pages carry that
weight:

- `/` — the folio home
- `/resume`
- `/case-studies/for-slalom`
- `/case-studies/strangeworks`

plus the two resume downloads, `dave-keller-resume.pdf` and
`dave-keller-resume.docx`, because a dead download link reads the same as a
dead page.

Today nothing stands between a typo and production. There is no test script,
no test runner, and no check on a pull request. Every push to `main` deploys
to GitHub Pages within a couple of minutes. The site is also assembled from
three repos — `kidastro`, `kidastro-themes` and `kidastro-songs` — so a deploy
can break without a single commit landing here.

The failure that motivated this is PR #61, "Stop a stale or frame-starved load
from rendering a blank page". Both of its triggers served **HTTP 200 with a
blank page**: every scroll-in section ships at inline `opacity:0`, so a load
that lost its stylesheet, or never got an animation frame, painted nothing at
all. An uptime ping would have called that site healthy. That single fact
sets the shape of everything below — the guard has to open a browser and
assert that content is *visibly painted*, not that a request succeeded.

## What it is

One Playwright suite, two workflows, one skill.

### The suite

`e2e/recruiter-pages.spec.ts`, driven off a single `PROTECTED` list so adding
a page is a one-line change. Per page, in a real browser:

| Assertion | Failure it catches |
| --- | --- |
| `<title>` matches | wrong page served, routing regression |
| `<h1>` visible — non-zero opacity **and** non-zero box | the #61 blank page |
| no `.motion-reveal` left at computed `opacity: 0` | entrance animation never armed |
| `<html data-motion-ready>` present | the #61 guard itself regressed |
| computed styles differ from UA defaults | stylesheet 404'd, unstyled page |
| zero console errors | client-side crash |
| zero failed responses | `/_next/static/` 404s, broken images |
| every internal link resolves at its exact URL | dead nav; static export 404s on a trailing slash |

Screenshots are captured as artifacts to look at. They are **never diffed** —
the site is under active redesign, so pixel baselines would fail on intended
changes far more often than on regressions, and a check that cries wolf gets
ignored.

A second spec asserts the resume downloads return 200 with the right content
type and a non-trivial body.

The suite runs in two modes off one environment variable:

- `SITE_BASE_URL` unset — build the site and serve `out/` locally. This is the
  PR gate.
- `SITE_BASE_URL=https://kidastro.com` — check the live site. This is the
  post-deploy verify.

### The PR gate

`.github/workflows/guard.yml`, on `pull_request`. Build, serve `out/`, run the
suite. A red check means the branch does not merge.

### The post-deploy verify

Runs on `workflow_run` after "Deploy to GitHub Pages" succeeds, against real
`kidastro.com`. GitHub Pages serves HTML with `cache-control: max-age=600`, so
the check retries over roughly two minutes before failing, rather than
reporting a cache artifact as an outage.

On failure it opens **one** GitHub issue — updating the existing open issue
rather than filing duplicates — naming the page, the assertion that failed,
the console and network errors, with screenshots attached to the run.

### The skill

`.claude/skills/site-check/SKILL.md`, invoked as `/site-check`. Runs the suite
locally against either a local build or the live site and reports what a
recruiter would actually see. The workflows are the half that never forgets;
this is the half you can ask a question.

## What this deliberately does not do

**It cannot reproduce #61's real-world trigger.** That bug bit a browser
holding ten-minute-stale HTML that pointed at asset filenames the deploy had
already replaced. The post-deploy check runs from a GitHub runner with a cold
cache and will never see that state. Pretending otherwise would be the
dangerous kind of green tick.

So the stale-asset case is tested where it can be tested honestly: as a
simulated scenario in the PR-gate suite, serving stale HTML whose
`/_next/static/` assets 404 and asserting the recovery script reloads once and
the page ends up rendered. The live check's job is narrower and stated
plainly — outages, bad deploys, and pages that break for a first-time visitor.

**No pixel baselines**, for the reason given above.

**No auto-revert.** An agent force-moving `main` on a check that might be
flaky is a bigger risk than a few minutes of a broken page.

## Cost

Zero. `kidastro` is a public repository, so GitHub Actions minutes are free on
it — the cost pressure that shaped CI on myguitarday does not apply here.
Playwright is a free dev dependency. Nothing in this design reads an API key
or makes a model call; the `/site-check` skill runs on the Max subscription
like any other session.

## Enforcement

`main` has no branch protection today, so a red check would be advisory. A
ruleset requiring the guard check to pass before merge turns it into an actual
gate. Direct pushes to `main` stay allowed.
