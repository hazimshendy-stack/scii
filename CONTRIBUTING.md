# Contributing — Sci Infinity (FODOL)

This is a bilingual, static-asset-heavy React SPA with **no unit-test framework**. "Correct" means it
builds clean, the release gate passes, and the UI works in **both** locales (RTL `ar` and LTR `en`).
The hard rules live in [`AGENTS.md`](AGENTS.md) — read it first; this file covers contribution workflow.

## Before you start

- Read [`AGENTS.md`](AGENTS.md) and the **one** matching [`docs/ai/`](docs/ai/) file for your task.
- Find the relevant code with `rg` / grep before opening files; views are large and self-contained.

## Development loop

```bash
npm install
npm run dev      # develop on http://localhost:5173
```

## Definition of "done"

A change is complete only when **all** of the following hold:

- [ ] `npm run build` passes (TypeScript strict, zero errors)
- [ ] `npm run lint` is clean
- [ ] `npm test` passes (build + `scripts/verify-release.js` — 10 artifact/brand-token checks)
- [ ] If UI changed: verified in **both** `/ar/...` (RTL) and `/en/...` (LTR), at 320px and desktop
- [ ] If assets/paths touched: uses `publicAsset()` (`public/`) or `%BASE_URL%` (`index.html`), works under the `/scii/` GitHub-Pages base
- [ ] Every new user-facing string has **both** Arabic and English (`t(ar, en)` or `_ar`/`_en` fields)
- [ ] No generated files touched (`dist/`, `package-lock.json`, `public/magazine/**`)
- [ ] No secrets, no `private-storage/` content, no `.env.local` committed

## Conventions (short version)

- **TypeScript strict** (`tsconfig.app.json`); function components; named exports; one component per file.
- **i18n is mandatory** — every user-visible string ships twice.
- **Styling:** Tailwind v4 utilities + tokens in `src/index.css` `@theme`. Light-mode only; don't add dark mode.
  If you change a brand token, update the token list in `scripts/verify-release.js` in the same change.
- **Routes:** add only in `src/App.tsx`, pattern `/:locale/<slug>` (kebab-case).
- **Env:** new public vars must be `VITE_*` and documented in `.env.fodol.example` (single env template).
  (Policy: live forms — e.g. a future `VITE_ENABLE_LIVE_FORMS` — require documented privacy/legal sign-off before any wiring.)
- **Tests:** there are none. To add a release check, append a `check('Name', () => {...})` block to
  `scripts/verify-release.js`. Do not introduce a test framework without asking the maintainer.

## What you must NOT do

- Do not construct FODOL page URLs client-side, batch grants, store tokens in client storage, or raise
  reader concurrency. See `docs/ai/GOTCHAS.md` §1 — the protected reader is a security boundary.
- Do not enable live forms (`VITE_ENABLE_LIVE_FORMS`) without documented privacy/legal sign-off.
- Do not delete or "clean up" intentionally-preserved code (e.g. the hidden `TeamView`).
- Do not hand-edit generated content (`public/magazine/**` — server-pipeline pre-renders; committed static assets).

## Security-sensitive files

Changes to these need maintainer review: `src/lib/contentApi.ts`, `src/components/reader/ProtectedPage.tsx`,
`src/index.css` (release-verified tokens), `scripts/verify-release.js`, `.github/workflows/deploy.yml`,
`vercel.json`, `.gitignore` (the `private-storage/` rule). See [`SECURITY.md`](SECURITY.md).
