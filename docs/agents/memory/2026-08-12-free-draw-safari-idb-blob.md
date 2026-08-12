# Free draw: Safari cannot store Blob in IndexedDB

- **Date:** 2026-08-12
- **Status:** promoted
- **Tags:** free-draw, safari, webkit, indexeddb, download, ipad
- **Related:** `src/utils/freeDrawStorage.ts`, `src/utils/downloadImage.ts`, `src/components/FreeDrawScreen.tsx`, `tests/e2e/free-draw.spec.ts`

## Context

Users lost free-draw ink on Back/refresh. Separately, Save Image on iPad Safari did not keep a usable download in the tab.

## Learning

1. **WebKit IDB + Blob:** Putting a `Blob`/`File` into IndexedDB fails on Safari/WebKit with  
   `UnknownError: Error preparing Blob/File data to be stored in object store`.  
   Persist PNG bytes as **`ArrayBuffer`** (field `data`) and rebuild a `Blob` on load.

2. **Download on iOS:** `<a download>` with a **data:** URL is unreliable and can navigate away from the app. Prefer:
   - Web Share API with a `File` when `canShare({ files })`
   - else object URL (`URL.createObjectURL`) + `download` attribute (same-origin blob keeps the page)

3. **Drawing state:** Use a **ref** for `isDrawing`, not React state — synchronous `pointerdown` + `pointermove` in one turn (tests / fast input) otherwise drops the stroke.

## Evidence

- Debug on Playwright Mobile Safari (iPad Pro 11): ink drawn, `toBlob` OK, IDB put of Blob failed; ArrayBuffer put succeeded.
- E2E: `tests/e2e/free-draw.spec.ts` passes on chromium, Mobile Chrome, Mobile Safari.

## Do / Don't

- **Do:** Store free-draw snapshots as ArrayBuffer in `NumberTracerFreeDrawDB` / store `canvas` / key `current`.
- **Do:** Save PNG via `downloadPngImage` (share → blob URL).
- **Don't:** Rely on data-URL `link.download` for iPad.
- **Don't:** Put raw `Blob` into IDB if Safari must work.
