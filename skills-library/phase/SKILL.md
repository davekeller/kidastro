---
name: phase
description: Plan and implement a task in phases. Each phase includes implementation, testing, fixing, and committing. Use when tackling multi-step features, bug fixes, or refactors that benefit from incremental progress.
---

# /phase

Plan and implement a task in phased steps with test-fix-commit cycles.

## Usage

- `/phase <description of what to implement>` - Plan and execute in phases
- `/phase plan <description>` - Only generate the plan, don't execute

## Steps

### 1. Analyze and Plan

1. Read and understand the task requirements thoroughly
2. Identify all files that need to change
3. Break the work into small, independently testable phases
4. Each phase should be a logical unit that can be built, tested, and committed on its own
5. Present the phased plan to the user before starting:
   - Phase name and description
   - Files to modify
   - What "done" looks like for that phase
6. Wait for user approval before proceeding

### 2. Execute Each Phase

For each phase, follow this cycle strictly:

#### a. Implement
- Make the code changes for this phase only
- Keep changes minimal and focused

#### b. Test
- Run `cd frontend && npx tsc --noEmit` for frontend changes
- Run `just test` for backend changes
- If build fails, fix before proceeding

#### c. Fix
- If any step fails, fix the issues
- Re-run the failing checks until they pass
- Do not move on until all checks are green

#### d. Commit
- Only commit if on a feature branch (NOT main or master)
- Check the current branch with `git branch --show-current`
- If on main/master, warn the user and do NOT commit
- Stage only the files changed in this phase
- Write a clear commit message describing the phase's changes

#### e. Report
- Summarize what was done in this phase
- Note any issues encountered and how they were resolved
- Confirm readiness to proceed to the next phase

### 3. Push (if on a branch)

After all phases are complete:
- Verify you are NOT on main/master
- Push to the remote branch with `git push`
- If a PR exists for this branch, note the PR URL

## Rules

- NEVER push to main or master
- NEVER commit on main or master -- warn the user and stop
- Always check branch before committing or pushing
- Each phase must pass all checks before committing
- Keep phases small enough that a single commit is easy to review
