# Responsive alignment Linux snapshots

- **Date:** 2026-08-12
- **Status:** active
- **Tags:** playwright, snapshots, gitignore, linux
- **Related:** `tests/e2e/responsive-alignment.spec.ts`, `tests/e2e/*-snapshots/`, `.gitignore`

## Context

Full Playwright suite reported 59 passed and 12 failures: all `responsive-alignment` viewport × project combinations on Linux.

## Learning

1. Failures were **missing baselines**, not rendering regressions. Playwright error: `A snapshot doesn't exist at …/number-3-*-linux.png, writing actual.`
2. Root cause was ignore rules: root `.gitignore` had `*.png`, and each `*-snapshots/.gitignore` had `*` / `!.gitignore`. Point-alignment PNGs were force-added earlier; responsive baselines never were.
3. First missing-snapshot run writes actuals into the snapshot dir; a second run (or `--update-snapshots`) establishes them as expected.

## Evidence

- Empty `responsive-alignment.spec.ts-snapshots/` except local ignore file
- 12 missing files: `number-3-{desktop,tablet-landscape,tablet-portrait,mobile}-{chromium,Mobile-Chrome,Mobile-Safari}-linux.png`
- After adding baselines + `!tests/e2e/**/*-snapshots/**/*.png`, responsive suite: 12/12 passed

## Do / Don't

- **Do:** Commit Linux `*-linux.png` baselines under `tests/e2e/**/*-snapshots/`
- **Do:** Keep the root un-ignore for snapshot PNGs when using a global `*.png` ignore
- **Don't:** Rely on per-folder `*` gitignores in snapshot dirs (they hide missing baselines)
- **Don't:** Treat first-run “snapshot doesn't exist” as a product bug without checking the snapshot folder
