# Agent Handbook Design

**Date:** 2026-08-12  
**Status:** Approved  
**Audience:** AI coding agents working in this repository

## Problem

Agents landing in this repo reverse-engineer product and code context every session. Existing docs help humans and capture history, but:

- `AGENTS.md` is workflow-only (skills, cm, beads, quality gates).
- `docs/ARCHITECTURE.md` is stale (Konva/Dexie options, React 18, missing modules).
- Plans under `docs/` are historical, not a live map.
- Nothing persists session learnings for the next agent.

## Goals

1. Give AI agents a fast, accurate path into the codebase without reverse-engineering.
2. Keep the always-loaded surface small (`AGENTS.md`).
3. Put deeper context in on-demand pages under `docs/agents/`.
4. Separate **live** docs from **historical** plans.
5. Provide durable **agent memory** so discoveries survive across sessions.

## Non-goals

- Rewriting parent/educator product marketing in `README.md`.
- Auto-generating docs from code (no new tooling this round).
- Turning BDD specs into living test docs.
- Changing application behavior.

## Approach

**Lean hub (Approach 1):** `AGENTS.md` remains the short entry point. Deep content lives in `docs/agents/` and is opened on demand. Agent memory is a first-class subdirectory with read/write rules.

## Layout

```
AGENTS.md                          # short entry — links out + memory duties
docs/agents/
  README.md                        # handbook index + how to use
  codebase-map.md                  # screens, modules, where-to-change-X
  domain-rules.md                  # invariants agents must not break
  ops-playbook.md                  # run / test / debug / PWA / pitfalls
  doc-index.md                     # live vs historical for rest of docs/
  memory/
    README.md                      # how memory works (read/write rules)
    INDEX.md                       # catalog of memories (one-line each)
    YYYY-MM-DD-<slug>.md           # individual learnings
```

Also:

- Refresh `docs/ARCHITECTURE.md` to match code and point agents to `docs/agents/`.
- Leave `docs/PLAN-*`, `IMPLEMENTATION-PLAN.md`, etc. as historical; list in `doc-index.md`.

## Agent memory

**Purpose:** When an agent learns something non-obvious, write it down so the next agent starts smarter.

**Rules:**

1. **Read first** — Before non-trivial work, skim `docs/agents/memory/INDEX.md`; open relevant memories.
2. **Write when you learn** — Non-obvious discoveries not already in live docs get a memory file + INDEX line in the same session (before landing the plane).
3. **Belongs in memory:** gotchas, invariants, failed approaches, flake notes, root-cause writeups, repo-specific preferences.
4. **Does not belong:** generic framework knowledge, temporary WIP, secrets, duplicates of stable facts that belong in handbook pages.
5. **Promotion:** Stable rules move into `domain-rules.md` / `codebase-map.md` / `ops-playbook.md`; memory marked `status: promoted`.
6. **Format:** title, date, status, tags, related paths, context, learning, evidence, do/don't.
7. **INDEX.md:** one line per memory, newest first.

## Page content (summary)

| Page | Content |
|------|---------|
| `README.md` | Purpose, read order, memory pointer, link to `AGENTS.md` |
| `codebase-map.md` | Views, module table, data flow, where-to-change-X (from current `src/`) |
| `domain-rules.md` | Path format, tracing thresholds, progress model, UX invariants |
| `ops-playbook.md` | Scripts, gates, Playwright, PWA/version, DebugPanel, pitfalls |
| `doc-index.md` | Status table for all `docs/` paths |
| `memory/*` | Rules + empty or seeded INDEX |

## `AGENTS.md` changes (additive)

- Link to `docs/agents/` handbook.
- Memory: read INDEX at start; write learnings before session end.
- Do not treat historical plans as source of truth.

## Maintenance

- Behavior/layout/invariant changes → update the relevant live handbook page in the same change.
- Session learning → memory (or promote if stable).
- Historical plans stay; never source of truth.
- `AGENTS.md` stays short.

## Success criteria

- New agent can orient from `AGENTS.md` → `docs/agents/README.md` without reading all of `src/`.
- Tracing/progress invariants are documented with file paths and constants matching code.
- Memory read/write rules are enforceable from `AGENTS.md`.
- Stale claims in architecture docs are corrected or clearly superseded.
- No application code behavior changes.
