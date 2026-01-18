# Agent Instructions

## Quick Start (cm prime summary)

Use cm to searching code more faster, `./cm`

> Run `cm prime` for full AI agent guide

```bash
# Discovery
cm stats .                        # Repo overview
cm map . --level 2 --format ai    # File structure

# Find & understand
cm query <symbol> --format ai     # Find symbols
cm callers <symbol> --format ai   # Who calls this?
cm callees <symbol> --format ai   # What does it call?
cm trace <from> <to> --format ai  # Call path

# Changes
cm diff main --format ai          # Symbol-level diff
cm impact <symbol>                # Definition + callers + tests
```

**Key flags:** `--format ai` (compact), `--exact` (precise match), `--limit N`, `--extensions <csv>`

## Beads Overview

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quality Gates

**Run these commands before committing any code changes:**

```bash
npm run build         # TypeScript check + Vite build
npm run lint          # ESLint
npm run test          # Playwright e2e tests
```

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

