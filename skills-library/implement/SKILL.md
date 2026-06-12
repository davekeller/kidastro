---
name: implement
description: Use when you have an approved plan or spec ready to ship and want the full chained workflow — phased implementation with a commit per phase, then a PR, then an honest self-review of that PR, then follow-up commits for any real issues found. Use when the user says "implement and ship," "do the whole thing," "implement + PR + review," or asks you to chain phased commits → PR → self-review → fix loop.
---

# /implement

Chains the existing skills `/phase` → `/pr` → `/review` → fix-loop into one ship-it workflow.

## Usage

- `/implement <description>` — full chain from plan to PR with self-review
- `/implement` (no args) — assumes the current conversation already has an approved plan

## Preconditions

- An approved plan or spec exists (from `/brainstorm` or just discussed in conversation). If not, stop and ask whether to brainstorm first — do not implement an unconfirmed plan.
- Current branch is NOT `main` / `master`. If it is, refuse and ask the user to create a branch first.

## Steps

### 1. Implement the plan in phased commits

Use `/phase` semantics: break the work into small, logically-isolated phases. For EACH phase:

1. Implement just that phase
2. Type-check (`cd frontend && npx tsc --noEmit` for frontend; `just test` for backend) — fix until green
3. Stage only the files changed in this phase
4. Commit with a clear message tied to the phase

Do not bundle multiple phases into one commit. Do not skip the type-check.

### 2. Create the PR

After all phases are committed, run `/pr`:

- Push the branch (`git push -u origin HEAD` if needed)
- Take a screenshot via Playwright if the dev server is reachable AND not behind a login wall; otherwise skip and note in the body that a screenshot is pending
- `gh pr create` with title + summary + test plan
- Capture the PR URL **and the PR number** — both are needed for the next step

### 3. Self-review the PR

Run `/review pr <number>` against the PR you just created:

- `gh pr view <number>` for metadata
- `gh pr diff <number>` for the full diff
- Read with fresh eyes: assume you didn't write it. Look for bugs, leaks, regressions, accessibility gaps, visual inconsistencies vs the spec, padding/style mismatches, store-state lifecycle issues, race conditions

### 4. Post the findings as a PR comment

Use `gh pr comment <number> --body "..."`. Structure findings into three buckets:

- **Real issues — worth fixing.** Things that warrant a follow-up commit on this PR. For each: what + where (file:line) + why it matters + recommended fix.
- **Acceptable carry-overs.** Things you'd flag in a real review but that aren't regressions in this PR (pre-existing patterns, lifted-as-is code). Name them so the user knows you noticed.
- **Nits.** Cosmetic items not worth fixing. List briefly so they're documented but signal you won't act on them.

End with a one-liner stating which findings will become follow-up commits.

### 5. Fix real issues in additional phased commits

For each item in "Real issues":

1. Implement the fix
2. Type-check (or run tests as appropriate) — fix until green
3. Stage only the relevant files
4. Commit with a message that references the finding (e.g. `Addresses self-review finding #1 on PR #<n>`)

Do **not** fix items from the "Acceptable carry-overs" or "Nits" buckets unless the user asks. Scope discipline.

### 6. Push the follow-up commits

`git push` so the PR picks up the fixes. Don't force-push. Don't amend earlier commits.

### 7. Final report

Summarize for the user:

- PR URL + comment URL
- Commits created (initial phases + follow-ups), each as `<sha> <subject>`
- Bucketed findings table (what fixed vs what intentionally not fixed)

## Rules

- NEVER commit or push on `main` / `master` — refuse and ask for a branch.
- NEVER amend already-pushed commits or force-push during the fix loop. Follow-ups are new commits.
- NEVER skip type-check / lint between phases.
- NEVER fix nits or acceptable carry-overs without explicit user ask. Stay in scope.
- NEVER scoop unrelated working-tree changes (e.g. unrelated submodule bumps, untracked package-lock.json) into the PR. Stage only files changed by the planned work.
- If the dev server is up but bounces to a login wall during `/pr`, skip the screenshot — note it in the body, do NOT try to authenticate.
- Each commit message must end with the standard `Co-Authored-By: Claude ...` trailer.
- The self-review in step 3 must be honest. Don't soften findings because you wrote the code. The whole point of the review is to catch what you missed.

## Notes

- This skill is a meta-skill: it orchestrates `/phase`, `/pr`, and `/review`. Read those skills if you're unsure of any sub-step's exact mechanics — don't reinvent them here.
- The work between steps 1 and 2 is the "shipped scope." Steps 5–6 are the "review-driven scope." Keep them as separate commits so reviewers can tell post-review fixes from initial implementation.
- If the self-review surfaces zero real issues, skip steps 5–6 and just report.
