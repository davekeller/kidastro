# Test and Push Workflow

When the user requests to "test and push", follow these steps:

## 1. Test the Build
- Run the build command: `npm run build` or `yarn build`
- Monitor for any build errors, TypeScript errors, or warnings

## 2. Fix All Errors
- Fix any build errors that occur
- Fix any linter errors (ESLint)
- Fix any formatter errors (Prettier)
- Ensure the build completes successfully

## 3. Commit Changes
- Create a short, specific commit message that describes what was changed
- Follow conventional commit format when appropriate (e.g., "fix:", "feat:", "style:")
- Use the standard commit workflow with co-author attribution

## 4. Branch Management
- **NEVER push directly to main branch**
- Check current branch with `git branch --show-current`
- If on main:
  - Create a new feature branch with a descriptive name
  - Example: `git checkout -b fix/component-updates` or `git checkout -b feature/new-layout`
- If already on a feature branch, use that branch

## 5. Push Changes
- Push to the feature branch with: `git push -u origin <branch-name>`
- Provide the user with the branch name and next steps
- Remind them they can create a PR when ready

## Important Notes
- Always run the full build before committing
- Never skip error fixing - all errors must be resolved
- Never use `--no-verify` or skip hooks
- Never force push unless explicitly requested
- Always create descriptive branch names based on the changes made
