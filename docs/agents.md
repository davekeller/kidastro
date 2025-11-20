# Agent Workflow

This document outlines the workflow for AI agents working on this project.

## Implementation Process

1.  **Execute Plan**: Follow the steps outlined in `implementation_plan.md`.
2.  **No User Acceptance**: Proceed with the implementation without waiting for user acceptance between steps, unless explicitly blocked.

## Phase Completion Checklist

At the end of each phase of the implementation (e.g., after porting components, after styling, after animations), perform the following:

1.  **Test Build**: Run `npm run build` to ensure the application builds successfully.
2.  **Fix Errors**: Resolve any build errors, linting issues, or Prettier formatting errors.
3.  **Commit**: Stage all changes and commit with a meaningful, short, descriptive message.
    *   Example: `git commit -am "dk-feat: port intro section to tailwind"`
4.  **Push**: Push the changes to the current branch.
    *   Command: `git push origin <branch-name>`

## Documentation

-   Keep `task.md` updated as progress is made.
-   Update `walkthrough.md` if significant visual changes or new features are added.
