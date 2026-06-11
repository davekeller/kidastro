---
name: dev
description: Start the development stack. Use when running the app locally, starting dev mode, or launching the development environment.
---

# /dev

Start the full development stack via Docker Compose.

## Steps

1. Check if Docker is running
2. Check if `.env` exists with `ANTHROPIC_API_KEY` set
3. Check if port 5432 is available (stop local Postgres if needed)
4. Run `just dev` to build and start the full stack (Postgres + backend + frontend + Caddy)
5. Wait for all services to be healthy
6. Report the local URL: http://localhost:3000

## Alternative modes

- `just dev-backend` - Run backend only (outside Docker, for debugging)
- `just dev-frontend` - Run frontend only (outside Docker, for debugging)
- `just dev-local` - Full stack with in-process agent (faster iteration)

## Notes

- The dev server runs in the background via Docker Compose
- Backend hot-reloads on file changes (mounted volumes)
- Frontend hot-reloads via Next.js dev server
- Use `just down` to stop all services
- Use `just logs` to view container logs
