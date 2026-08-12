# Agent Handbook

On-demand documentation for AI coding agents working in **Little Number Tracer**.

Human-facing product overview lives in the root [`README.md`](../../README.md).  
Always-loaded workflow rules live in [`AGENTS.md`](../../AGENTS.md).

## Read order (new session)

1. **[`AGENTS.md`](../../AGENTS.md)** — skills workflow, `cm`, beads, quality gates, landing the plane  
2. **This index** — pick the pages you need  
3. **[`memory/INDEX.md`](./memory/INDEX.md)** — skim before non-trivial work; open relevant memories  
4. Open only what the task needs:

| If you need… | Open |
|--------------|------|
| Where code lives / where to change X | [`codebase-map.md`](./codebase-map.md) |
| Invariants you must not break | [`domain-rules.md`](./domain-rules.md) |
| Run, test, debug, PWA, pitfalls | [`ops-playbook.md`](./ops-playbook.md) |
| Whether another `docs/` file is live or historical | [`doc-index.md`](./doc-index.md) |
| How to record a learning for the next agent | [`memory/README.md`](./memory/README.md) |

## Product one-liner

Tablet-friendly React PWA for children (~ages 3–6) to learn writing digits **0–9** by tracing. Local-only progress (IndexedDB). No accounts, no backend.

## Source of truth

| Kind | Truth |
|------|--------|
| Behavior & structure | Current `src/` |
| Agent workflow | `AGENTS.md` |
| Stable agent-oriented facts | `docs/agents/*` (this handbook) |
| Session learnings | `docs/agents/memory/` |
| Historical plans / old REQs | `docs/*` marked historical in [`doc-index.md`](./doc-index.md) — **not** live truth |

When handbook and code disagree, **fix the handbook** (or file a memory) — do not “fix” code to match stale docs.

## Maintenance (agents)

- Change behavior, layout, or invariants → update the matching handbook page in the **same** change.
- Learn something non-obvious → write a **memory** (see [`memory/README.md`](./memory/README.md)) before landing the plane.
- Promote stable memories into handbook pages; mark the memory `promoted`.
