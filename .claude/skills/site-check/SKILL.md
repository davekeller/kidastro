---
name: site-check
description: Check that the pages recruiters read on kidastro.com still work — /, /resume, and both case studies, plus the resume downloads. Use when Dave asks "is the site up", "did I break anything", "check the site", "is the resume page okay", before merging a change that touches those pages, or after a deploy he wants confirmed. Also use when a Live site check issue has been filed and he wants to know what it means.
---

# Is the site broken?

kidastro.com is a portfolio. The question is never "did the server respond" —
it is "would a recruiter opening this right now see a working page". Those are
different questions, and PR #61 is why: that bug served **HTTP 200 and painted
nothing**. Any check that stops at a status code would have called it healthy.

## The two runs

Check the live site — what recruiters see this minute:

```bash
npm run guard:live
```

Check a local branch before it can ship:

```bash
npm run guard
```

`npm run guard` builds the site first and serves `out/` the way GitHub Pages
serves it. Add `GUARD_SKIP_BUILD=1` to reuse an existing build while iterating,
and `GUARD_PORT=…` if 4321 is taken.

Both need Node 22 on PATH (`/Users/dk/.nvm/versions/node/v22.14.0/bin`) and
Chromium installed (`npx playwright install chromium`).

## Read the split, not the colour

A live run reports something like `11 passed, 6 skipped`. **That is correct and
healthy.** Six specs simulate conditions a live site cannot be put into — a
build with JavaScript disabled, a stale load whose stylesheet 404s — so they
skip against `SITE_BASE_URL` and run only against a local build.

What is *not* healthy is a local run reporting skips. `npm run guard` should be
17 passed, 0 skipped. If specs skipped there, the thing you wanted tested did
not run, and the run proves nothing.

## What it checks, and what it cannot

Per protected page: the title, that the `<h1>` is **visibly painted** (effective
opacity, not the element's own — opacity composites, so an `<h1>` reads 1 while
the wrapper above it sits at 0), that the stylesheet actually applied, that no
section is stranded invisible after scrolling, that there are no console errors
or failed same-origin requests, and that every internal link resolves at its
exact URL. Screenshots are attached to look at. They are never diffed — the site
is under active redesign, and a check that fails on intended changes gets
ignored.

**The live run cannot reproduce PR #61's real trigger.** That was a browser
holding ten-minute-stale HTML pointing at asset filenames the deploy had already
replaced. A CI runner with a cold cache never reaches that state. The simulated
version lives in `e2e/blank-page-guard.spec.ts` and runs against a local build.
Say so rather than implying the live green tick covers it.

## Adding a page

Edit `e2e/protected.ts`. Add a page only if a broken version of it would cost
Dave a job — the list is short on purpose. A guard nobody trusts because it
covers everything is worth less than a short one that is always right.

There is a check that fails when a case study is linked from the home page but
missing from that list, so new case studies cannot ship unguarded by accident.

## When a failure comes in

The **Live site check** workflow files one GitHub issue (and comments on it
rather than opening duplicates), then closes it automatically when the site
recovers. To read a failure:

1. Run `npm run guard:live` yourself first — confirm it still fails, and is not
   an artifact of the deploy having been mid-propagation.
2. `node scripts/guard-summary.mjs guard-results.json` prints the same summary
   the issue body uses.
3. Download the run's `live-check-failure` artifact for screenshots and traces.

Report what a recruiter would see, in those terms — "the resume page loads blank
for anyone who hasn't visited before" beats "assertion failed on line 86".

## Costs nothing

The repo is public, so Actions minutes are free on it. Nothing here reads an
API key or makes a model call. Do not add a `schedule:` trigger to the live
check without asking Dave — a cron that wakes up and does billable work is his
decision, not a workflow's.
