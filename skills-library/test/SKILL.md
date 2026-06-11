---
name: test
description: Run the project's test suite and report results. Use when running tests, checking test coverage, or debugging test failures.
---

# /test

Run the project's test suite and report results.

## Steps

1. Run backend tests: `cd backend && uv run pytest tests/ -v`
2. Run frontend type check: `cd frontend && npx tsc --noEmit`
3. Report results clearly:
   - Number of tests passed/failed
   - Summary of any failures with file and line numbers
   - Suggestions for fixing failures if obvious

## Usage

- `/test` - Run all tests
- `/test backend` - Run only backend tests
- `/test frontend` - Run only frontend type check
- `/test <path>` - Run specific test file

## Notes

- Backend uses pytest-asyncio with `asyncio_mode = "auto"`
- For failing tests, read the relevant test file to understand what's being tested
- Offer to help fix failing tests if requested
