# Tracing coordinate spaces

- **Date:** 2026-08-12
- **Status:** active
- **Tags:** tracing, coords, svg, canvas
- **Related:** `src/data/numberDefinitions.ts`, `src/utils/svgPathSampler.ts`, `src/hooks/useTracing.ts`, `src/components/TracingScreen.tsx`, `src/components/TracingCanvas/TracingCanvas.tsx`

## Context

Orienting agents for handbook authoring and future tracing bugs.

## Learning

Three spaces are in play; mixing them is the main class of tracing bugs:

1. **SVG defs:** path strings in `numberDefinitions` use **0–100** coordinates.
2. **Detection:** `sampleSvgPathPoints` returns points in **0–1** (`x/100`, `y/100`). `useTracing` compares user points in that space with `PATH_TOLERANCE = 0.03`.
3. **Drawing:** `TracingCanvas` works in **CSS pixels** (with DPR-backed backing store). `TracingScreen` normalizes pointer points by canvas width/height before calling `handleStrokeChange`.

Completion defaults to **99%** coverage (`DEFAULT_COMPLETION_THRESHOLD = 0.99`).

## Evidence

- Comment + paths in `numberDefinitions.ts` (0–100 space).
- `svgPathSampler.ts` pushes `{ x: p.x / 100, y: p.y / 100 }`.
- `TracingScreen` maps points through width/height before `handleStrokeChange`.
- Constants at top of `useTracing.ts`.

## Do / Don't

- **Do:** Normalize pointer coordinates to 0–1 before coverage logic.
- **Do:** Edit glyph geometry in 0–100 SVG space and re-run alignment e2e.
- **Don't:** Feed raw pixel coordinates into `useTracing`.
- **Don't:** Compare 0–100 path samples directly to 0–1 user points.
