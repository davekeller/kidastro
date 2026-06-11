---
name: main
description: Use when syncing the current branch with the latest changes from main, running the full test suite, and fixing any resulting build or test failures.
---

# /main

Merge the latest from `main` into the current branch, then validate the build and all tests pass — fixing any issues that arise.

## Steps

1. **Check for uncommitted changes**
   - Run `git status`
   - If there are uncommitted changes, commit them first using the `/commit` skill before proceeding

2. **Fetch and merge from main**
   - Run `git fetch origin main`
   - Run `git merge origin/main`
   - If the merge is clean, proceed to step 3
   - If there are conflicts, see Conflict Resolution below

3. **Install any new dependencies**
   - Run `just install`

4. **Run the build**
   - Run `cd frontend && npx tsc --noEmit`
   - If build fails, diagnose and fix each error before proceeding

5. **Run all tests**
   - Run `just test`
   - If tests fail, diagnose and fix each failure before proceeding
   - Re-run tests after each fix to confirm they pass

6. **Commit the merge**
   - Stage and commit:
     ```
     git add -A && git commit -m "merge: sync from main

     Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
     ```

7. **Report the result**
   - State what changed: files merged, conflicts resolved, errors fixed
   - Confirm build passes and all tests pass with counts

## Conflict Resolution

- **Our branch deleted a file, main modified it** → keep deleted (`git rm <file>`)
- **Both branches modified a file** → keep our branch's intent while incorporating genuinely new additions from main
- **Both branches added the same feature differently** → prefer our branch's version unless main's is clearly better

## Notes

- Do NOT push after merging unless explicitly asked
- If the merge produces zero conflicts and zero errors, still run build and tests to confirm
