# Documentation Index

Status of docs in this repo for **agents**. Prefer **live** sources; treat **historical** as context only.

| Path | Status | Use for |
|------|--------|---------|
| [`AGENTS.md`](../../AGENTS.md) | **Live** | Workflow, skills, cm, beads, gates, landing plane, memory duties |
| [`README.md`](../../README.md) | **Live** (human) | Product overview, setup for humans |
| [`docs/agents/README.md`](./README.md) | **Live** | Agent handbook index |
| [`docs/agents/codebase-map.md`](./codebase-map.md) | **Live** | Structure, data flow, where-to-change-X |
| [`docs/agents/domain-rules.md`](./domain-rules.md) | **Live** | Invariants, thresholds, progress model |
| [`docs/agents/ops-playbook.md`](./ops-playbook.md) | **Live** | Commands, tests, PWA, pitfalls |
| [`docs/agents/memory/`](./memory/) | **Live** | Cross-session agent learnings |
| [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) | **Live (summary)** | High-level stack/ADRs; detailed nav → agent handbook |
| [`docs/COLOR-PALETTE.md`](../COLOR-PALETTE.md) | **Reference** | Design intent; **runtime truth = `tailwind.config.js`** |
| [`docs/REQ.md`](../REQ.md) | **Historical / product intent** | Original requirements; not a completion tracker |
| [`docs/specs/*.feature`](../specs/) | **Historical / product intent** | BDD-style features; not wired as automated suite entry |
| [`docs/IMPLEMENTATION-PLAN.md`](../IMPLEMENTATION-PLAN.md) | **Historical** | Original milestone plan |
| [`docs/PLAN-fix-point-alignment.md`](../PLAN-fix-point-alignment.md) | **Historical** | Past work plan |
| [`docs/PLAN-playwright-testing.md`](../PLAN-playwright-testing.md) | **Historical** | Past testing plan |
| [`docs/plan-trace-all-numbers.md`](../plan-trace-all-numbers.md) | **Historical** | Past plan |
| [`docs/TEST_DEBUG_REPORT.md`](../TEST_DEBUG_REPORT.md) | **Historical** | Past debug notes |
| [`docs/superpowers/specs/`](../superpowers/specs/) | **Process** | Approved design specs (superpowers) |
| [`docs/superpowers/plans/`](../superpowers/plans/) | **Process** | Implementation plans (superpowers) |

## Rules of engagement

1. **Code wins** over any doc when they conflict — then fix the doc or write a memory.
2. Do not delete historical plans solely for neatness; mark them here if status changes.
3. New stable agent knowledge goes in the handbook or memory — not as a new root-level mystery markdown file.
