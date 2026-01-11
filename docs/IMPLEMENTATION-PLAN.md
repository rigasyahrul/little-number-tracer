# Little Number Tracer - Implementation Plan

## Overview

A PWA for children ages 3-6 to learn number writing through interactive tracing with instant feedback.

**Tech Stack:** React 18 + Vite, TypeScript, Tailwind CSS, HTML5 Canvas, Lottie, Howler.js, Zustand, IndexedDB, Workbox

---

## Milestone Summary

| Milestone | Focus | Complexity | REQs Covered |
|-----------|-------|------------|--------------|
| **M1** | Project setup, Tailwind, color scheme | S-M | REQ-009 |
| **M2** | TracingCanvas, single number path | M-L | REQ-001, REQ-003 (partial) |
| **M3** | All numbers 0-9, stroke arrows, detection | L | REQ-001, REQ-002, REQ-003 |
| **M4** | Mascot Lottie, celebrations, audio | M-L | REQ-004, REQ-005 |
| **M5** | Number gallery, Zustand + IndexedDB | M-L | REQ-006 |
| **M6** | Practice mode, free draw canvas | M-L | REQ-007, REQ-008 |
| **M7** | PWA manifest, Workbox, offline | M | All (cross-cutting) |

**Effort estimates:** S = <1 day, M = 1-2 days, L = 3-5 days, XL = 1+ week

---

## Milestone 1: Foundation & Visual Shell (S-M)

**Included REQs:** REQ-009 (core), groundwork for others

### Deliverables
- Vite + React 18 + TS project scaffolded
- Tailwind configured with COLOR-PALETTE.md colors
- Basic app layout: header, main content area, background styling
- Simple "home" screen with placeholder card and navigation

### Tasks

1. **Project setup**
   - Create Vite React TS app
   - Install dependencies: `tailwindcss`, `zustand`, `howler`, `lottie-react`, `idb`/`dexie`, `vite-plugin-pwa`
   - Configure ESLint/Prettier

2. **Tailwind & design system**
   - Configure Tailwind theme colors from COLOR-PALETTE.md
   - Add base styles: body background, global fonts, soft rounding, shadows
   - Add utility classes for large tap targets (min 48x48px)

3. **App shell**
   - `App.tsx` with top-level layout
   - Simple view-switch mechanism (state or React Router)
   - Placeholder tracing screen with "Back" button

---

## Milestone 2: Core Canvas & Single Number Tracing (M-L)

**Included REQs:** REQ-001, REQ-003 (foundations)

### Deliverables
- `TracingCanvas` component with finger drawing
- `NumberPath` rendering dotted path for single number
- Basic touch/pointer event handling
- Visual trace line follows finger (no correctness detection yet)

### Tasks

1. **TracingCanvas skeleton**
   - Create `components/TracingCanvas/TracingCanvas.tsx`
   - Use `<canvas>` with `useRef` and `useEffect` for draw loop
   - Handle pointer events (pointerdown, pointermove, pointerup, pointercancel)
   - Normalize drawing for device pixel ratio

2. **Basic drawing**
   - Store current stroke as array of points (x, y, t)
   - Draw smooth line on pointermove
   - Clear and redraw canvas on stroke changes

3. **NumberPath for 1 number**
   - Define stroke data structure:
     ```ts
     type StrokePoint = { x: number; y: number };
     type Stroke = { id: string; points: StrokePoint[] };
     type NumberDefinition = { digit: number; strokes: Stroke[]; startPoint: StrokePoint };
     ```
   - Hard-code `NumberDefinition` for "1"
   - Draw dotted path, start marker, end marker

4. **Canvas composition**
   - Compose TracingCanvas + NumberPath (layered or single canvas)
   - Map normalized [0-1] coordinates to canvas dimensions

5. **Touch support**
   - Use Pointer Events for consistent touch/mouse
   - Disable scrolling during draw (preventDefault)
   - Test on touch device simulators

---

## Milestone 3: Full Tracing Logic & Stroke Arrows (L)

**Included REQs:** REQ-001, REQ-002, REQ-003

### Deliverables
- Stroke definitions for numbers 0-9
- Correctness detection with tolerance (on/off-path)
- Animated stroke direction arrows
- Visual feedback for on-path vs off-path tracing

### Tasks

1. **Stroke data for 0-9**
   - Create `data/numberDefinitions.ts`
   - Include multiple strokes where needed (4, 5, etc.)
   - Sample ~50-100 points per stroke

2. **Path progress & proximity algorithm**
   - Precompute flattened points with cumulative length
   - For each user point: find closest path point
   - Track on-path ratio and path coverage ratio
   - Completion thresholds: coverage ≥70-80%, on-path ≥50-60%

3. **Per-stroke sequencing**
   - Track current stroke index
   - Only count coverage for current stroke
   - Advance to next stroke on completion

4. **Visual feedback**
   - Draw stroke in `tracing.active` when on-path
   - Draw stroke in `tracing.offPath` when off-path
   - Optional glow effect when on-path

5. **Stroke arrows & animation**
   - Compute direction vectors for each stroke
   - Place arrow icons along path
   - Add pulsing animation (CSS or requestAnimationFrame)

6. **Start point differentiation**
   - Larger size, distinct color
   - Use `primary.yellow` border, white fill

---

## Milestone 4: Mascot & Celebrations (M-L)

**Included REQs:** REQ-004, REQ-005

### Deliverables
- `Mascot` component with idle + reaction states
- `CelebrationOverlay` with confetti + sounds
- `AudioManager` wrapper using Howler
- Event wiring for completion celebrations

### Tasks

1. **AudioManager (Howler.js)**
   - Create `audio/AudioManager.ts`
   - Preload sounds: success, tap, error, encouragement
   - Methods: `playSuccess()`, `playHint()`, `playTap()`, `setMuted()`
   - Global mute toggle in UI

2. **Mascot component**
   - Integrate `lottie-react`
   - State machine: `idle`, `guiding`, `happy`, `sad`, `celebrate`
   - API: `<Mascot state="idle" />` controlled via props

3. **Event wiring for mascot**
   - Start tracing → `guiding`
   - Off-path or idle → `guiding` + hint sound
   - Completion → `celebrate`
   - Use setTimeout to revert to `idle`

4. **CelebrationOverlay**
   - Full-screen overlay with confetti Lottie
   - Floating stars animation
   - Trigger `playSuccess()` on completion
   - Show for 2-3 seconds or until tap

5. **Visual integration**
   - Place mascot near canvas (bottom-left or top-right)
   - Large, readable, high contrast

---

## Milestone 5: Number Gallery & Progress Persistence (M-L)

**Included REQs:** REQ-006

### Deliverables
- `NumberGallery` grid for 0-9 with completion status
- `ProgressStore` using Zustand + IndexedDB
- Number selection loads tracing view

### Tasks

1. **ProgressStore (Zustand + IndexedDB)**
   ```ts
   type NumberProgress = {
     digit: number;
     completed: boolean;
     bestAccuracy?: number;
     attempts: number;
     lastCompletedAt?: string;
   };

   interface ProgressState {
     numbers: Record<number, NumberProgress>;
     setCompleted(digit: number, accuracy: number): void;
     incrementAttempt(digit: number): void;
     hydrate(): Promise<void>;
   }
   ```
   - Use `idb` or `Dexie` for read/write
   - Hydrate on app start, debounce writes

2. **NumberGallery UI**
   - 2x5 grid of large buttons (0-9)
   - Each card: big digit, star/check when completed
   - Use `background.paleBlue`, `primary.green` for completed
   - Tap → navigate to tracing screen

3. **Completed indicators**
   - Completed: colored card, star badge, check icon
   - Incomplete: neutral card, dotted border

4. **App flow**
   - Home = NumberGallery
   - Back button → gallery
   - On completion → `setCompleted(digit, accuracy)`

---

## Milestone 6: Practice Mode & Free Draw (M-L)

**Included REQs:** REQ-007, REQ-008

### Deliverables
- Practice mode: multiple attempts, reset, best tracking
- FreeDrawCanvas with colors, eraser, clear

### Tasks

1. **Practice Mode**
   - "Try Again" button on tracing screen
   - On reset: clear strokes, increment attempts
   - No penalties, encouraging UI copy
   - Track `bestAccuracy` in ProgressStore

2. **FreeDrawCanvas**
   - Reuse TracingCanvas drawing logic
   - Separate component without path detection
   - Tools:
     - Color swatches (3-5 colors)
     - Eraser toggle
     - Clear all button
   - Access from home screen

3. **State separation**
   - Tracing progress separate from free-draw
   - No persistence for free-draw sketches

---

## Milestone 7: PWA & Offline Polish (M)

**Cross-cutting:** Supports ADR-002 & ADR-003

### Deliverables
- PWA manifest
- Service worker via Vite PWA + Workbox
- Verified offline experience

### Tasks

1. **Vite PWA plugin & Workbox**
   - Configure `vite.config.ts` with VitePWA
   - Manifest: name, icons, colors (`background.cream`, `primary.yellow`)
   - Register service worker
   - Pre-cache: HTML, JS, CSS, Lottie, audio

2. **Offline behavior**
   - Verify app loads without network
   - Confirm IndexedDB persists progress
   - Handle asset load failures gracefully

3. **Installability**
   - Test PWA install on Android/Chrome, iOS Safari
   - Optional: soft install prompt in UI

---

## Risk Areas & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tracing too strict/lax | Kids frustrated or no learning | Start forgiving, tune via constants, test on real devices |
| Performance on low-end tablets | Stuttery drawing | Modest point counts, refs over state, single RAF loop |
| Complex hit-testing | Slow development | Brute-force first, optimize only if needed |
| Offline asset issues | Broken offline UX | Pre-cache via Workbox, graceful fallbacks |
| Touch/scroll conflicts | Tracing interrupted | `touch-action: none`, test iOS/Android |
| UX for young children | Controls too complex | Minimal UI, large icons, no text-dependent instructions |

---

## Component Architecture

```
src/
├── components/
│   ├── TracingCanvas/
│   ├── NumberPath/
│   ├── Mascot/
│   ├── NumberGallery/
│   ├── CelebrationOverlay/
│   └── FreeDrawCanvas/
├── data/
│   └── numberDefinitions.ts
├── audio/
│   └── AudioManager.ts
├── stores/
│   └── progressStore.ts
├── hooks/
│   └── useTracing.ts
└── App.tsx
```

---

## Definition of Done

- [ ] All must-have REQs (001-006, 009) implemented
- [ ] Should-have REQs (007, 008) implemented
- [ ] Works offline after first load
- [ ] Touch tracing works on tablets
- [ ] Kid-friendly tolerances for tracing detection
- [ ] PWA installable on Android/iOS
- [ ] No console errors in production build
