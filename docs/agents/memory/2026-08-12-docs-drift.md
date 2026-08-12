# Historical docs drift

- **Date:** 2026-08-12
- **Status:** active
- **Tags:** docs, architecture
- **Related:** `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/agents/doc-index.md`, `package.json`, `src/`

## Context

Building the agent handbook; compared old docs to the shipped app.

## Learning

Several docs describe **options or early plans**, not the current stack:

- Drawing is **HTML5 Canvas + Pointer Events**, not React Konva.
- Persistence is **`idb` + IndexedDB**, not Dexie.
- UI is **React 19** (package.json), not “React 18 only.”
- Modules such as `NumberPickerSidebar`, `DebugPanel`, `UpdateBanner`, `useVersionCheck`, and SVG path sampling are real and were missing from the old architecture list.
- `lottie-react` is in `package.json` but **not imported** anywhere under `src/`; celebrations are emoji/CSS.
- `docs/COLOR-PALETTE.md` hex values can differ from `tailwind.config.js` — runtime styling follows Tailwind.

Use `docs/agents/*` + `src/` as truth. Treat plans under `docs/PLAN*` and `IMPLEMENTATION-PLAN.md` as historical.

## Evidence

- `package.json` dependencies and versions.
- `src/components/TracingCanvas`, `src/stores/progressStore.ts` imports.
- Handbook `doc-index.md` status table.

## Do / Don't

- **Do:** Prefer `docs/agents/codebase-map.md` for navigation.
- **Do:** Update handbook when you change stack or layout.
- **Don't:** Reintroduce Konva/Dexie “because architecture.md said so.”
- **Don't:** Delete historical plans; mark them historical in `doc-index.md`.
