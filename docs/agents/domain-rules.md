# Domain Rules

Invariants for Little Number Tracer. **Do not break these without an explicit product decision and handbook update.**

## Product invariants

1. **Digits 0–9 only** — gallery and definitions cover ten digits; `getNumberDefinition` throws outside 0–9.
2. **Local-only data** — no backend, no accounts, no cloud sync. Progress lives in the browser (IndexedDB).
3. **Positive reinforcement** — celebrate success; do not add punitive scoring UX, fail-shame, or competitive leaderboards for kids.
4. **Touch-first** — large targets; tracing uses Pointer Events with `touch-action: none` on the canvas.
5. **Offline-capable PWA** — service worker + static assets; app should remain usable offline after first load.

## Number definitions

**File:** `src/data/numberDefinitions.ts`  
**Types:** `src/types/tracing.ts`

- Each digit is a `NumberDefinition`: `digit`, `startPoint`, `svgPath` (full glyph), `strokes[]`.
- Each `Stroke` has `id`, `svgPath`, optional precomputed `points`.
- **SVG path coordinates are in normalized 0–100 space** (not pixels, not 0–1).
- Detection points are **not** hand-authored by default: `sampleSvgPathPoints(stroke.svgPath)` generates them at runtime so dots and hit-testing stay aligned.
- Sampler output is converted to **0–1** (`x/100`, `y/100`) for comparison with normalized user points.
- Multi-stroke digits exist in data (e.g. **4** has two strokes). Coverage in `useTracing` aggregates points across **all** strokes in the definition.

### When editing paths

- Keep strokes consistent with the visible guide (`NumberPath` / arrows).
- Prefer editing `svgPath` and letting the sampler regenerate points.
- After path edits, run alignment e2e tests (`point-alignment`, `responsive-alignment`).

## Tracing / completion

**File:** `src/hooks/useTracing.ts`

| Constant | Value | Meaning |
|----------|-------|---------|
| `PATH_TOLERANCE` | `0.03` | Max distance (normalized 0–1 space) to mark a path sample point covered |
| `DEFAULT_COMPLETION_THRESHOLD` | `0.99` | Fraction of sample points that must be covered to complete |

Rules:

1. User points must be in **the same 0–1 space** as sampled path points (`TracingScreen` divides pixel coords by canvas width/height).
2. Completion is evaluated on **stroke end** (`handleStrokeEnd`), not continuously for the completion side effect.
3. `accuracy` stored on complete is the coverage ratio at completion time.
4. `reset()` clears coverage maps and state; pair with canvas `clearTrigger` in the screen.
5. Dev/Playwright may override threshold via `DebugPanel` — production default remains `0.99`.
6. `getCurrentStroke()` currently returns `numberDef.strokes[0]` — be aware if implementing strict stroke-order UX; coverage still counts all strokes’ points.

Related helpers: `src/utils/pathDetection.ts` (flatten, closest point, coverage) — keep math consistent with `useTracing` if both are used.

## Progress model

**File:** `src/stores/progressStore.ts`

| Item | Value |
|------|--------|
| DB name | `NumberTracerDB` |
| Store | `progress` |
| Key | `digit` |

`NumberProgress`:

- `digit`, `completed`, `attempts`
- optional `bestAccuracy`, `lastCompletedAt`

Rules:

1. `hydrate()` loads all records and fills missing digits 0–9 with `completed: false`, `attempts: 0`.
2. `setCompleted(digit, accuracy)` sets `completed: true`, bumps attempts, keeps max `bestAccuracy`.
3. `incrementAttempt` bumps attempts without requiring completion.
4. Failures hydrating → empty defaults for 0–9 (app still runs).
5. Do not introduce server sync without a full privacy/product redesign.

## UI / UX rules

- **Gallery:** completed digits use success styling (`primary-green`); incomplete use `primary-yellow` (see `NumberGallery`).
- **TracingScreen:** supports portrait and landscape layout; landscape scales canvas to available space (aspect 400×500 base).
- **Mascot states:** `idle` \| `guiding` \| `happy` \| `sad` \| `celebrate` — transient states auto-revert in the component.
- **DebugPanel:** render only when `import.meta.env.DEV` **or** `window._PLAYWRIGHT_TEST_` — never ship debug UI to normal production users.
- **Free draw:** creative mode; colors/eraser/clear/save PNG — not graded, not written to the progress store. Canvas ink is auto-persisted to a separate IndexedDB (`NumberTracerFreeDrawDB`) after each stroke and restored on re-open (Back / refresh). Clear All wipes that snapshot. Save Image uses blob URL + Web Share (not data-URL-only) for iPad Safari.
- **Update banner:** shown when server `/version.json` version ≠ embedded `APP_VERSION` (skipped for `dev*` versions).

## Audio

- Central API: `audioManager` in `src/audio/AudioManager.ts`.
- Prefer existing play methods (`playSuccess`, etc.) over ad-hoc Howl instances in components.
- Respect mute flag on the manager.

## Styling

- Runtime tokens live in **`tailwind.config.js`** (e.g. `background.cream` `#FEF6E4`, `primary.yellow` `#F4D35E`, `primary.green` `#52B788`).
- `docs/COLOR-PALETTE.md` is a **design reference** and may drift from Tailwind — when they disagree, **Tailwind + components win** until the palette doc is updated.

## Testing invariants

- E2E must not rely on production-only hiding of DebugPanel: fixtures may set `window._PLAYWRIGHT_TEST_`.
- Visual alignment tests use snapshots under `tests/e2e/*-snapshots/` — update deliberately, not casually.
- Prefer `tests/e2e/helpers/traceNumber.ts` for programmatic tracing rather than one-off pointer hacks in each spec.
