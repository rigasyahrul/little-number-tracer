# Ops Playbook

Run, test, debug, and ship without rediscovering commands.

## Prerequisites

- Node.js ≥ 18  
- npm (lockfile is npm)

```bash
npm install
```

## Scripts (`package.json`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (`host: true` → LAN-reachable). Default URL `http://localhost:5173` |
| `npm run build` | `generate-version.js` → `tsc -b` → `vite build` |
| `npm run preview` | Preview production build (port 4173) |
| `npm run preview:lan` | Preview + print local IP for tablets |
| `npm run lint` | ESLint |
| `npm run test` | Playwright e2e |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:headed` | Headed browsers |
| `npm run test:debug` | Playwright debugger |

## Quality gates (before commit / land plane)

From `AGENTS.md` — required when code changes:

```bash
npm run build
npm run lint
npm run test
```

**Docs-only changes:** gates still nice-to-have; do not skip if you touched `src/`, configs, or tests.

## Playwright

- **Config:** `playwright.config.ts`
- **Tests:** `tests/e2e/`
- **Base URL:** `http://localhost:5173`
- **webServer:** starts `npm run dev` (reuses existing server outside CI)
- **Projects:** Desktop Chrome, Mobile Chrome (Pixel 5), Mobile Safari (iPad Pro 11)
- **CI:** retries 2, workers 1

### Spec map

| Spec | Focus |
|------|--------|
| `tracing.spec.ts` | Trace all numbers / completion flows |
| `touch-tracing.spec.ts` | Touch / iPad-oriented tracing |
| `point-alignment.spec.ts` | Detection points vs stroke (per digit) + snapshots |
| `responsive-alignment.spec.ts` | Alignment across viewports + snapshots |

Helpers: `tests/e2e/helpers/traceNumber.ts`, `tests/e2e/fixtures.ts`.

### Tips

- First run may need browser install: `npx playwright install` (if missing in environment).
- Snapshot failures: inspect diff; update only when intentional (`npx playwright test --update-snapshots` with care).
- DebugPanel is available under Playwright via `window._PLAYWRIGHT_TEST_` (see fixtures / `DebugPanel.tsx`).

## PWA & versioning

- Plugin: `vite-plugin-pwa` in `vite.config.ts` (`registerType: 'autoUpdate'`, Workbox `skipWaiting` + `clientsClaim`).
- SW registration also attempted in `src/main.tsx` (`/sw.js`).
- **Version file:** `scripts/generate-version.js` writes `public/version.json` (`version`, `timestamp`). Build uses `CF_PAGES_COMMIT_SHA` or `VITE_APP_VERSION` or `dev-<timestamp>`.
- **Runtime:** `src/version.ts` → `APP_VERSION` from `import.meta.env.VITE_APP_VERSION`.
- **Update UX:** `useVersionCheck` fetches `/version.json?t=…` with `cache: 'no-store'`; shows `UpdateBanner` on mismatch. Skips when version starts with `dev`.

### Tablet / LAN

```bash
npm run build
npm run preview:lan
# open http://<printed-ip>:4173 on device (same Wi-Fi)
```

Dev server is also LAN-bindable (`server.host: true`) via `npm run dev`.

## Debugging tracing

1. Run `npm run dev`, open tracing for a digit.
2. **DebugPanel** (dev): coverage %, threshold slider, optional show points (`data-testid="debug-toggle"`).
3. Confirm coordinate pipeline if hits feel wrong: canvas pixels → normalize in `TracingScreen` → `useTracing` vs sampled 0–1 points.
4. Path edits: re-check `numberDefinitions` + alignment e2e.
5. Progress: Application tab → IndexedDB → `NumberTracerDB` / `progress`.

## cm (code navigation)

Prefer `./cm` for symbol search (see `AGENTS.md`). Examples:

```bash
./cm query useTracing --format ai
./cm callers setCompleted --format ai
./cm map . --level 2 --format ai
```

## Beads

Issue tracking via `bd` — `bd ready`, `bd show`, `bd update`, `bd close`, `bd sync`. See `AGENTS.md`.

## Common pitfalls

| Pitfall | What to do |
|---------|------------|
| Mixing coordinate spaces (0–100 vs 0–1 vs px) | Read domain-rules; normalize before `useTracing` |
| Completing never fires | Coverage must reach threshold (default 99%); check DebugPanel; ensure `handleStrokeEnd` runs |
| Multi-stroke digit “half done” | Coverage is over **all** stroke samples; incomplete second stroke blocks completion |
| Stale PWA cache after deploy | Version banner / hard reload; Workbox skipWaiting should activate new SW |
| Update banner spam in dev | Expected skip when `APP_VERSION` is `dev*` |
| `docs/COLOR-PALETTE.md` ≠ UI | Trust `tailwind.config.js` |
| Treating `docs/IMPLEMENTATION-PLAN.md` as current | Historical — use this handbook |
| E2E against wrong port | Config expects 5173 + dev server |
| Konva/Dexie in old architecture doc | **Not used** — Canvas + `idb` |

## Landing the plane

Mandatory end-of-session steps are in `AGENTS.md` (issues, gates, `bd sync`, **git push**, handoff). Work is not done until `git status` shows up to date with origin.
