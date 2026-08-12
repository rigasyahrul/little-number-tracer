# Architecture

> **Agents:** For navigation, data flow, and “where to change X”, use the live handbook:
> [`docs/agents/codebase-map.md`](./agents/codebase-map.md), [`domain-rules.md`](./agents/domain-rules.md), [`ops-playbook.md`](./agents/ops-playbook.md).
> This file is a short stack + ADR summary kept aligned with the shipped app (updated 2026-08-12).

## Tech Stack (current)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript | Type safety, maintainable codebase |
| Framework | React 19 + Vite 6 | Fast DX, strong ecosystem, PWA-friendly |
| PWA | `vite-plugin-pwa` + Workbox | SW generation, offline caching, manifest |
| Canvas / drawing | HTML5 Canvas + Pointer Events | Touch/stylus tracing, performance |
| Path geometry | SVG path strings (0–100) + runtime sampling | Single source for render + hit-testing |
| Animations | Emoji/CSS celebrations + mascot states; `lottie-react` listed in package.json but not imported in `src/` yet | Lightweight feedback |
| Audio | Howler.js | Cross-browser SFX |
| Storage | IndexedDB via **`idb`** | Offline-first progress, no backend |
| Styling | Tailwind CSS | Kid-friendly utility UI |
| State | Zustand | Lightweight progress + app state |
| E2E | Playwright | Touch/viewport/alignment coverage |

**Not used (despite older drafts):** React Konva, Dexie.js.

## Runtime components (shipped)

| Component / module | Role |
|--------------------|------|
| `App` | View state: gallery \| tracing \| freeDraw; hydrate progress; update banner |
| `NumberGallery` | Digit grid + free-draw entry; completion styling from progress store |
| `TracingScreen` | Composes canvas, path, arrows, mascot, celebration, sidebar, debug |
| `TracingCanvas` | Pointer drawing surface |
| `NumberPath` / `StrokeArrows` | Guide rendering and direction cues |
| `useTracing` + `svgPathSampler` | Coverage detection and completion |
| `numberDefinitions` | Digits 0–9 stroke/path data |
| `progressStore` | Zustand + IndexedDB progress |
| `Mascot` / `CelebrationOverlay` | Encouragement and rewards |
| `FreeDrawScreen` | Ungraded creative canvas |
| `AudioManager` | Howler SFX |
| `DebugPanel` | Dev/Playwright tracing diagnostics |
| `NumberPickerSidebar` | Switch digits while tracing |
| `UpdateBanner` + `useVersionCheck` | Deployed version mismatch UX |

## Deployment

Static assets suitable for object storage + CDN (e.g. Cloudflare Pages). PWA offline via service workers. Build emits `public/version.json` via `scripts/generate-version.js`.

## Architecture Decision Records

### ADR-001: PWA over Native App

**Decision:** Progressive Web App (React + Vite PWA plugin).

**Rationale:** No app-store gate, instant updates, any modern browser/tablet, simpler maintenance.

### ADR-002: Offline-First Architecture

**Decision:** Service workers + IndexedDB for offline use and durable local progress.

**Rationale:** Children may use the app without reliable internet; progress must survive reloads.

### ADR-003: Local-Only Storage

**Decision:** All progress in IndexedDB; no backend.

**Rationale:** Simple ops, no server cost, privacy-friendly for children.

### ADR-004: Lightweight motion for feedback

**Decision:** Ship celebrations/mascot with simple UI motion (emoji/CSS). `lottie-react` may be adopted later for richer motion; it is not required by current components.

**Rationale:** Engaging feedback with minimal asset pipeline; avoid blocking on animation tooling.

### ADR-005: Canvas-Based Tracing + SVG Path Definitions

**Decision:** Draw with HTML5 Canvas; define glyphs as SVG paths; sample paths for detection.

**Rationale:** Continuous pointer tracking performance; one geometry source for visuals and hit-testing (see agent domain-rules for coordinate spaces).
