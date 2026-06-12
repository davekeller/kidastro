---
name: build
description: Run the project build and report any errors. Use when building, compiling, or checking for build errors.
---

# /build

Run the project build and report any errors.

## Steps

1. Run `cd frontend && npx tsc --noEmit` for TypeScript type checking
2. Run `cd frontend && npm run build` for a full production build
3. If successful, report build completed
4. If errors occur:
   - Parse the error messages
   - Identify the files and line numbers with issues
   - Provide clear explanation of each error
   - Suggest fixes for common issues (type errors, missing imports, etc.)

## Notes

- For TypeScript errors, read the relevant file to understand context
- Offer to fix errors if they're straightforward
- If there are many errors, prioritize and group them by type
- Backend Python errors: run `cd backend && uv run python -m py_compile src/workflows_prototype/main.py` for a quick syntax check
