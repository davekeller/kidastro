---
name: sync-branch
description: Fetch and merge changes from another branch into the current branch. Use when syncing with main, merging branches, or pulling remote changes.
---

# /sync-branch

Fetch and merge changes from another branch into the current branch.

## Usage

`/sync-branch <branch-name>`

If no branch name is provided, prompt the user to specify one.

## Steps

1. Run `git status` to check for uncommitted changes
2. If there are uncommitted changes, warn the user and ask if they want to proceed
3. Fetch the specified branch: `git fetch origin <branch-name>`
4. Merge the branch: `git merge origin/<branch-name>`
5. If there are merge conflicts:
   - List the conflicting files
   - Ask the user how they want to resolve them
6. Report the result (files changed, merge status)

## Notes

- Always fetch before merging to get latest changes
- Common branches to sync from: `main`
- If the user says "sync from main", use `main` as the branch name
