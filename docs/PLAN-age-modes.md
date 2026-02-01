# Plan - Age Modes (3-4 years vs 5 years)

## Goal
Add a selectable age mode with two options:
- 3-4 years: thicker tracing guide line (2x stroke width).
- 5 years: current behavior (no change).

## Decisions (confirmed)

| Area | Decision |
|---|---|
| Persistence | Global localStorage — survives reloads, one setting for all numbers |
| Default mode | 3-4 years |
| Stroke width | 2x for 3-4 years; 1x (current) for 5 years |
| Completion threshold | 0.99 for both modes — no change |
| PATH_TOLERANCE | No change |
| Scope | Tracing only (stroke width is the only behavioral difference) |
| Mode indicator | Toggle shows selected mode + a small contextual label badge on the canvas |

## Implementation (completed)

### Files created
- `src/stores/ageModeStore.ts` — Zustand store backed by localStorage. Exports `AgeMode` type and `useAgeModeStore`. Initializes synchronously from localStorage; no hydration step needed.

### Files modified
- `src/components/NumberPath/NumberPath.tsx` — Added `ageMode` prop. Computes `strokeMultiplier` (2 for `'3-4'`, 1 for `'5'`). Applied to both the gray background stroke and the dotted guide strokes.
- `src/components/TracingScreen.tsx` — Imports `useAgeModeStore`. Renders a segmented toggle (`renderAgeModeToggle`): landscape at `absolute top-4 left-4`, portrait below the title. A small semi-transparent badge inside the canvas bottom-right shows the active mode during gameplay.

### What was NOT changed
- `useTracing.ts` — completion threshold and PATH_TOLERANCE remain unchanged for both modes.
- `App.tsx` — no hydration needed (localStorage is synchronous).

## Definition of Done
- [x] User can switch between 3-4 and 5 years modes.
- [x] 5 years mode matches current appearance/behavior.
- [x] 3-4 years mode shows a visibly thicker path (2x guide + background strokes).
- [x] Mode toggle placement works in landscape (top-left) and portrait (below title) without overlap with clear button.
- [x] Active mode persists across reloads via localStorage.
- [x] Contextual mode label visible on canvas during gameplay.
