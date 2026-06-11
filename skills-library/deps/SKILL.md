---
name: deps
description: Check and manage project dependencies. Use when checking outdated packages, installing dependencies, or adding new packages.
---

# /deps

Check and manage project dependencies.

## Usage

- `/deps` - Check for outdated dependencies in both frontend and backend
- `/deps install` - Install all dependencies
- `/deps add <package>` - Add a new dependency (specify frontend or backend)

## Steps

### Check outdated:

1. Run `cd frontend && npm outdated` for frontend
2. Run `cd backend && uv pip list --outdated` for backend
3. Summarize what's outdated and severity (major/minor/patch)

### Install:

1. Run `just install` (installs both frontend and backend)
2. Or `just install-frontend` / `just install-backend` individually
3. Report any warnings or errors

### Add package:

- Frontend: `cd frontend && npm install <package>`
- Backend: `cd backend && uv add <package>`

## Notes

- For major version updates, warn about potential breaking changes
- Check package.json and pyproject.toml to understand current version constraints
