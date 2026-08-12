# Codebase Map

Facts verified against `src/` as of 2026-08-12. Prefer this over `docs/ARCHITECTURE.md` for navigation.

## App shell

**Entry:** `src/main.tsx` → `src/App.tsx`

`App` holds view state (not a router):

| View | Component | How entered |
|------|-----------|-------------|
| `gallery` | `NumberGallery` | Default |
| `tracing` | `TracingScreen` | Tap digit in gallery |
| `freeDraw` | `FreeDrawScreen` | Free Draw from gallery |

Also on `App`:

- `useProgressStore().hydrate()` on mount  
- `useVersionCheck()` + optional `UpdateBanner`  
- Header title + **Back** (non-gallery views)

```
gallery ──select number──► tracing ──Back / complete──► gallery
gallery ──Free Draw──────► freeDraw ──Back────────────► gallery
```

## Directory map

```
src/
  App.tsx, main.tsx, index.css, version.ts
  audio/AudioManager.ts          # Howler singleton
  components/
    NumberGallery.tsx
    TracingScreen.tsx            # Composes tracing UI
    FreeDrawScreen.tsx
    NumberPickerSidebar.tsx      # Switch digit while tracing
    DebugPanel.tsx               # Dev / Playwright only
    UpdateBanner.tsx
    TracingCanvas/TracingCanvas.tsx
    NumberPath/NumberPath.tsx
    StrokeArrows/StrokeArrows.tsx
    Mascot/Mascot.tsx
    CelebrationOverlay/CelebrationOverlay.tsx
  data/numberDefinitions.ts      # Digits 0–9 SVG paths
  hooks/useTracing.ts            # Coverage + completion
  hooks/useVersionCheck.ts
  stores/progressStore.ts        # Zustand + IndexedDB
  types/tracing.ts
  utils/svgPathSampler.ts        # Sample SVG → points
  utils/pathDetection.ts         # Distance / coverage helpers
tests/e2e/                       # Playwright (see ops-playbook)
public/                          # PWA assets, audio, version.json (generated)
scripts/generate-version.js      # Writes public/version.json on build
```

## Module responsibilities

| Module | Responsibility | Key deps |
|--------|----------------|----------|
| `TracingCanvas` | Pointer drawing on HTML canvas; emits stroke points in **pixel** space | Pointer events, DPR scaling |
| `NumberPath` | Renders number outline / dotted guide from defs | `numberDefinitions`, SVG |
| `StrokeArrows` | Direction cues for current stroke | stroke geometry |
| `useTracing` | Path coverage, completion threshold, reset | `sampleSvgPathPoints` |
| `svgPathSampler` | Sample Bezier SVG path → normalized points | DOM `SVGPathElement` |
| `pathDetection` | Closest-point / coverage utilities (shared math) | sampler |
| `numberDefinitions` | Per-digit strokes + full `svgPath` | `types/tracing` |
| `progressStore` | Completed flags, attempts, best accuracy | Zustand, `idb` |
| `AudioManager` | SFX via Howler | `/audio/success.ogg`, data-URI stubs |
| `Mascot` | Emoji-based states (`idle`, `guiding`, `happy`, `sad`, `celebrate`) | — |
| `CelebrationOverlay` | Completion celebration UI + audio (emoji/CSS stars; not Lottie today) | `audioManager` |
| `DebugPanel` | Coverage %, threshold slider, show points | `import.meta.env.DEV` or `window._PLAYWRIGHT_TEST_` |
| `NumberPickerSidebar` | Jump to another digit without gallery | parent callbacks |
| `useVersionCheck` | Compare build version to `/version.json` | `APP_VERSION` |
| `FreeDrawScreen` | Blank canvas, colors, eraser, clear, PNG save | canvas 2D |

## Tracing data flow

```
Pointer on TracingCanvas (pixel coords)
    → TracingScreen normalizes to 0–1 (divide by canvas width/height)
    → useTracing.handleStrokeChange
        → for each user point, mark nearby path sample indices covered
          (distance ≤ PATH_TOLERANCE within normalized space)
        → pathCoverage = covered / total sample points
    → handleStrokeEnd
        → if coverage ≥ completionThreshold → onComplete(accuracy)
    → TracingScreen: mascot celebrate, CelebrationOverlay, progressStore.setCompleted
```

**Coordinate spaces (critical):**

| Space | Range | Used by |
|-------|-------|---------|
| SVG path defs | **0–100** | `numberDefinitions` `svgPath` strings |
| Sampled path points | **0–1** (`p.x/100`) | `svgPathSampler`, `useTracing` |
| Canvas drawing | **pixels** | `TracingCanvas` |
| User points into hook | **0–1** | `TracingScreen` normalizes before `handleStrokeChange` |

## Progress data flow

```
App mount → hydrate() → IndexedDB NumberTracerDB / store "progress"
Tracing complete → setCompleted(digit, accuracy)
Practice attempt hooks may call incrementAttempt(digit)
NumberGallery reads numbers[digit].completed for styling
```

## Where to change X

| Goal | Start here |
|------|------------|
| Digit shape / stroke paths | `src/data/numberDefinitions.ts` |
| Completion difficulty | `DEFAULT_COMPLETION_THRESHOLD` / `PATH_TOLERANCE` in `src/hooks/useTracing.ts` (DebugPanel can override threshold in dev) |
| Path sampling density | `sampleSvgPathPoints` options in `src/utils/svgPathSampler.ts` |
| Touch / draw feel (width, color) | `src/components/TracingCanvas/TracingCanvas.tsx` |
| Tracing layout (portrait/landscape) | `src/components/TracingScreen.tsx` |
| Gallery UI | `src/components/NumberGallery.tsx` |
| Free draw tools | `src/components/FreeDrawScreen.tsx` |
| Progress schema / persistence | `src/stores/progressStore.ts` |
| Types for strokes/numbers | `src/types/tracing.ts` |
| Sounds | `src/audio/AudioManager.ts`, `public/audio/` |
| Mascot presentation | `src/components/Mascot/Mascot.tsx` |
| Celebration | `src/components/CelebrationOverlay/` |
| Theme colors (runtime) | `tailwind.config.js` (see also historical `docs/COLOR-PALETTE.md`) |
| PWA manifest / Workbox | `vite.config.ts` |
| Service worker registration | `src/main.tsx` |
| App version / update banner | `scripts/generate-version.js`, `src/version.ts`, `useVersionCheck`, `UpdateBanner` |
| E2E tracing helpers | `tests/e2e/helpers/traceNumber.ts`, `tests/e2e/*.spec.ts` |
| ESLint / TS / Vite | root configs + `package.json` scripts |

## Stack (actual)

| Layer | Choice |
|-------|--------|
| UI | React **19** + TypeScript |
| Build | Vite 6 |
| State | Zustand 5 |
| DB | IndexedDB via **`idb`** (not Dexie) |
| Drawing | **HTML5 Canvas** + Pointer Events (not Konva) |
| Audio | Howler.js |
| Animations | CSS/emoji celebrations today; `lottie-react` is in package.json but unused in `src/` |
| CSS | Tailwind 3 |
| PWA | `vite-plugin-pwa` + Workbox |
| E2E | Playwright (`tests/e2e`) |

## Tests layout

- Config: `playwright.config.ts` — `testDir: ./tests/e2e`, webServer `npm run dev` on `:5173`
- Specs: `tracing`, `touch-tracing`, `point-alignment`, `responsive-alignment`
- Fixtures set Playwright hooks (e.g. test flags for DebugPanel)
