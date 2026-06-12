---
name: review
description: Review code changes and provide feedback. Use when reviewing code, checking for bugs, or analyzing pull requests.
---

# /review

Review code changes and provide feedback.

## Usage

- `/review` - Review uncommitted changes
- `/review <file>` - Review a specific file
- `/review pr <number>` - Review a pull request

## Steps

### For uncommitted changes:

1. Run `git diff` to see all changes
2. Analyze the changes for:
   - Potential bugs or logic errors
   - Security concerns
   - Performance issues
   - Code style and readability
   - Missing error handling
3. Provide constructive feedback with specific line references

### For pull requests:

1. Use `gh pr view <number>` to get PR details
2. Use `gh pr diff <number>` to see the changes
3. Review all commits and changes
4. Provide summary of findings

## Notes

- Be specific about issues found
- Suggest improvements, not just problems
- Note what looks good, not just what needs work
