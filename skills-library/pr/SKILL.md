---
name: pr
description: Create a pull request with a standard template. Use when creating PRs, opening pull requests, or submitting code for review.
---

# /pr

Create a pull request with a screenshot and summary of changes.

## Steps

1. **Check for uncommitted changes.** Run `git status`. If there are uncommitted changes, run `/commit` first.

2. **Push the branch.** Check if the branch is ahead of origin. If so, push with `git push -u origin HEAD`.

3. **Take a screenshot.** Use Playwright to capture the current state of the app:
   - Navigate to the relevant page (usually `http://localhost:3000`)
   - Take a screenshot and save to a temp file
   - Upload the image to the PR (or note the path for manual attachment)

4. **Analyze all changes.** Run `git log main..HEAD --oneline` and `git diff main...HEAD --stat` to understand the full scope of changes across all commits in the branch.

5. **Create the PR.** Use `gh pr create` with this format:

```
gh pr create --title "Brief descriptive title" --body "$(cat <<'EOF'
> screenshot goes here — drag-and-drop or paste after PR is created

## Summary

- [2-4 bullet points: what changed and why]

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

6. **Return the PR URL** so the user can add the screenshot.

## Screenshot Workflow

If the dev server is running (`localhost:3000`), use Playwright to take a screenshot:
1. Navigate to the page most affected by the changes
2. Wait for content to load
3. Take a full-page or viewport screenshot
4. Mention the screenshot path so the user can drag it into the PR

If the dev server is NOT running, skip the screenshot and remind the user to add one manually.

## Notes

- Analyze ALL commits in the branch, not just the latest one
- Title should be under 70 characters, concise but descriptive
- Summary bullets should explain the "why" not just the "what"
- Base branch defaults to `main`
- Always remind the user to attach the screenshot if it couldn't be auto-uploaded
