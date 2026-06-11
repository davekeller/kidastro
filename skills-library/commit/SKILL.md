---
name: commit
description: Format code and create a git commit with a well-structured message. Use when committing changes, staging files, or creating commits.
---

# /commit

Fix lint/format/build errors, then create a commit on the current branch.

## Steps

1. **Guard against main.** Run `git branch --show-current`. If on `main` or `master`, refuse and ask the user to create a branch first.

2. **Fix lint and format issues.**
   - `cd frontend && npx eslint --fix 'src/**/*.{ts,tsx}'` — auto-fix ESLint errors
   - `cd frontend && npx prettier --write 'src/**/*.{ts,tsx,css}'` — auto-fix formatting
   - If either tool reports unfixable errors, fix them manually before proceeding

3. **Check TypeScript build.**
   - `cd frontend && npx tsc --noEmit`
   - If there are errors in files you changed, fix them before proceeding
   - Pre-existing errors in untouched files can be ignored

4. **Review changes.**
   - `git status` to see what files have changed
   - `git diff` to understand the changes (including any auto-fix changes from step 2)

5. **Stage and commit.**
   - Stage relevant changes with `git add` (prefer specific files over `git add -A`)
   - Create a commit with a clear, descriptive message:
     - First line: `type: brief summary` (e.g. `feat:`, `fix:`, `refactor:`, `style:`)
     - Blank line
     - Optional: bullet points explaining key changes if needed
     - Always end with: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

6. **Verify.** Run `git status` to confirm the commit succeeded.

## Notes

- Do NOT push after committing unless explicitly asked
- Do NOT commit to `main` or `master` — always use a feature branch
- All checks (lint, format, types) must pass before committing
- If any check fails, fix the issues and re-run
- Keep commit messages concise but informative
- Include auto-fix changes from eslint/prettier in the same commit
