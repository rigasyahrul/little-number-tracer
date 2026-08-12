# Agent Instructions

## Superpowers

This project uses [obra/superpowers](https://github.com/obra/superpowers) skills (also in your Amp User Skills).

**Before creative work** (features, design, behavior changes): load the `brainstorming` skill and follow it — do not implement until a design is approved.

Core workflow skills: `using-superpowers` → `brainstorming` → `writing-plans` → `subagent-driven-development` / `executing-plans` → `verification-before-completion` → `finishing-a-development-branch`.

Also available: `test-driven-development`, `systematic-debugging`, `requesting-code-review`, `using-git-worktrees`.

## Agent handbook & memory

Deep product/code context for agents lives under **`docs/agents/`** (keep this file short).

| Need | Open |
|------|------|
| Handbook index / read order | [`docs/agents/README.md`](docs/agents/README.md) |
| Code map & where-to-change-X | [`docs/agents/codebase-map.md`](docs/agents/codebase-map.md) |
| Invariants (tracing, progress, UX) | [`docs/agents/domain-rules.md`](docs/agents/domain-rules.md) |
| Run / test / debug / pitfalls | [`docs/agents/ops-playbook.md`](docs/agents/ops-playbook.md) |
| Live vs historical docs | [`docs/agents/doc-index.md`](docs/agents/doc-index.md) |
| Cross-session learnings | [`docs/agents/memory/INDEX.md`](docs/agents/memory/INDEX.md) |

**Memory (mandatory habits):**

1. **Read** — Before non-trivial work, skim `docs/agents/memory/INDEX.md` and open relevant entries.
2. **Write** — If you learn something non-obvious that is not already in the live handbook, add a memory file + INDEX line **before landing the plane** (see `docs/agents/memory/README.md`).
3. **Promote** — Stable rules belong in handbook pages; mark the memory `promoted`.
4. **Truth** — When docs and `src/` disagree, fix the docs (or write a memory). Do not treat `docs/PLAN*`, `IMPLEMENTATION-PLAN.md`, or unchecked REQs as live source of truth.

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

