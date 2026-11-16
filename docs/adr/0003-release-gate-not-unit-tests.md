# ADR 0003 — Release verification = build artifact gate, not unit tests

**Status:** Accepted · **Date:** 2026 (pre-dates this documentation) · **Code:** `scripts/verify-release.js` (198 L), `package.json`

## Context

This is a content-heavy marketing + reader SPA. The risks that have actually burned projects like
this one are not "a hook returned the wrong value" but: the build broke on a strict TypeScript rule,
a **release-verified brand token** vanished from the compiled CSS, the PWA manifest went invalid, or
content integrity regressed (e.g. the ARPS 2026 registration-status wording). A full unit-test
framework would not catch these and would add maintenance cost to a repo with no testing culture.

## Decision

`npm test` is **not** a unit-Test framework. It is:

```
pretest → npm run build (tsc -b && vite build)
test    → node scripts/verify-release.js
```

`verify-release.js` runs **10 static checks** against the just-built `dist/` + `public/` + source,
all `check(title, fn)` blocks:

1. `dist/index.html` exists with `#root` and the manifest link; JS + CSS bundles present.
2. Compiled CSS still contains the **release-verified brand hexes**
   (`#111020 #56368d #434a9a #3b56a6 #2774bb #1196d3`), and those tokens exist in `src/index.css`.
3. `public/manifest.json` valid, `theme_color`/`background_color` = `#111020`.
4. `public/sw.js` present (offline support).
5. `public/offline.html` present with localized retry messaging.
6. Content truthfulness — e.g. **ARPS Workshop 2026** carries `registration_closed` (deadline honored).
7. Content inventory — **13 required** scientific activities/camps present in `seedData.ts`.
8. Partners page uses dignified badges, not misused photos.
9. Static purity — no dark mode / theme toggle / admin code in `App.tsx` or `src/`.
10. Footer renders authentic branded SVG icons (Facebook/Youtube/Spotify).

**VERIFIED** by running `npm test` on 2026-11-16: `tsc` clean, 1988 modules bundled, all 10 checks
PASS, exit 0.

## Evidence
- `scripts/verify-release.js` — the 10 `check()` blocks and the token lists — VERIFIED (full read).
- `package.json` — `pretest: build`, `test: node scripts/verify-release.js` — VERIFIED.
- Build output: `dist/index.html` 2.43 kB, CSS 66.31 kB, vendor JS 271.81 kB, app JS 253.59 kB (8.44 s build).

## Consequences

- Adding a new **release invariant** (a token, a required asset, a content-fact guarantee) = append a
  `check('...', () => {...})` block to `verify-release.js`. Do **not** introduce a test framework
  without maintainer sign-off (`CONTRIBUTING.md`).
- The gate is the **only** automated proof that "release = clean". If `npm test` passes, the build
  artifacts are deployable under the current invariants.
- It cannot catch runtime behavior bugs. That's covered manually (dual-locale checklist in `AGENTS.md`).
