---
name: fix
description: Fix linting and formatting issues automatically. Use when fixing lint errors, formatting code, or cleaning up code style.
---

# /fix

Fix linting and formatting issues automatically.

## Steps

1. Run `cd frontend && npm run lint -- --fix` to auto-fix frontend linting issues
2. Run `cd frontend && npx tsc --noEmit` to check for TypeScript errors
3. Check `git diff` to see what was changed
4. Report what was fixed

## Notes

- If lint --fix can't resolve an issue, provide specific guidance on how to resolve it manually
- For backend Python: run `cd backend && uv run ruff check --fix src/` if ruff is available
- Do NOT commit changes unless asked
