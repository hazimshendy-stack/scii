# COMMANDS — Sci Infinity

All commands run from repo root. Node 20+ (CI uses 20 — verified in `.github/workflows/deploy.yml`; DEPLOYMENT.md was aligned to this on 2026-11-16).

## Day-to-day
| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (port 5173). `/api` proxied to `$FODOL_DEV_API` ?? `http://127.0.0.1:8787`. |
| `npm run build` | `tsc -b && vite build` → `dist/`. Fails if TS errors. |
| `npm run lint` | oxlint (rules in `.oxlintrc.json`; react+typescript plugins). |
| `npm test` | `pretest` runs the build, then `node scripts/verify-release.js`. **This is artifact verification, not unit tests.** |
| `npm run preview` | Serves `dist/` locally. |

PowerShell execution-policy issues with `npx`/npm shims: run `node node_modules/vite/bin/vite.js build` / `node node_modules/typescript/bin/tsc` directly (see DEPLOYMENT.md troubleshooting).

## verify-release.js checks (10, run after `npm test` build)
1. `dist/index.html` + JS/CSS bundles exist · 2. brand hex tokens in `src/index.css` AND compiled CSS · 3. `manifest.json` valid, `#111020` colors · 4. `sw.js` present · 5. `offline.html` present · 6. ARPS 2026 = `registration_closed` · 7. 13 required activity slugs in `seedData.ts` · 8. Partners view free of misused team photos · 9. no `/admin`, `dark:`, Theme/Auth context · 10. Footer uses authentic brand SVG icons.
Add new release checks as `check('name', () => {...})` blocks. Full rationale: `docs/adr/0003-release-gate-not-unit-tests.md`. Passing does **not** prove runtime behavior (there is no test runner).

## Environment
- Frontend public vars: `VITE_FODOL_API_BASE` only (empty = same origin) — see `.env.fodol.example`.
- FODOL server runtime/secrets are NOT part of this frontend's repo — they live in the FODOL server repository.
- `.env.local` exists in the workspace and is git-ignored — do not read or commit it.

## Deployment
- **GitHub Pages** (default CI): push to `main`/`master` → `.github/workflows/deploy.yml` builds, copies `dist/index.html` → `dist/404.html`, deploys. Base path becomes `/scii/`.
- **Vercel**: import repo; build `npm run build`; output `dist`; `vercel.json` handles SPA rewrite + security headers.
- **Cloudflare Pages**: per DEPLOYMENT.md (manual).
- Do not edit CI or deployment targets without asking.

## Not available
No unit test runner (Vitest/Jest not installed). No Dockerfile. No database migrations (static frontend).
