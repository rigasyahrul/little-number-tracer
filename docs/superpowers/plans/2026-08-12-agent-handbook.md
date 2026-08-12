# Agent Handbook Implementation Plan

> **For agentic workers:** Docs-only delivery. No app code changes. Verify against current `src/` facts.

**Goal:** Ship a lean AI-agent handbook under `docs/agents/` with durable memory, and wire it from `AGENTS.md`.

**Architecture:** Short always-loaded `AGENTS.md` entry; on-demand pages in `docs/agents/`; append-style memory with INDEX; refresh or supersede stale architecture notes.

**Tech Stack:** Markdown only. Source of truth for facts: current `src/`, `package.json`, `playwright.config.ts`, `vite.config.ts`, `tailwind.config.js`.

## Global Constraints

- No application behavior changes.
- Facts must match code (no Konva/Dexie-as-current, React 19 not 18-only, etc.).
- Keep `AGENTS.md` short; deep content only under `docs/agents/`.
- Historical plans remain; mark status in `doc-index.md`.

---

### Task 1: Handbook core pages + memory scaffold

**Files:**
- Create: `docs/agents/README.md`
- Create: `docs/agents/codebase-map.md`
- Create: `docs/agents/domain-rules.md`
- Create: `docs/agents/ops-playbook.md`
- Create: `docs/agents/doc-index.md`
- Create: `docs/agents/memory/README.md`
- Create: `docs/agents/memory/INDEX.md`
- Create: optional seed memory if grounded in code facts

**Steps:**
- [ ] Write all pages from verified code facts
- [ ] Self-review: no TBD, paths exist, constants match code
- [ ] Commit docs

### Task 2: Wire AGENTS.md + refresh ARCHITECTURE

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/ARCHITECTURE.md`

**Steps:**
- [ ] Add handbook + memory sections to `AGENTS.md`
- [ ] Correct stale architecture claims; point to handbook
- [ ] Commit

### Task 3: Review, ship, land plane

**Steps:**
- [ ] Coordinator self-review of all new docs
- [ ] Commit any fixes
- [ ] `git pull --rebase`, push, verify up to date with origin
