# AGENTS.md — Sci Infinity (FODOL) frontend

## Project in 5 lines
Static React SPA for a non-profit initiative. Two languages (ar default/rtl, en/ltr), light-mode only.
Two magazine readers: static pre-rendered WebP pages (`MagazineView`) and grant-based protected reader (`ProtectedPage`) via FODOL API.
Deploy: GitHub Pages (repo pages under path `/scii/`) + optional Cloudflare Pages / Vercel (`/`).
No unit tests — "test" means `npm run build` + `scripts/verify-release.js` artifact checks (10 gates, rationale in docs/adr/0003-release-gate-not-unit-tests.md).
**README.md, DEPLOYMENT.md (rewritten 2026-11-16, code-verified), and docs/ (ai/ + adr/) exist. Trust package.json / vite.config.ts / CI over any doc (see docs/ai/GOTCHAS.md §5).**

## Stack
React 19 · TypeScript 6 (strict) · Vite 8 · Tailwind CSS v4 (`@theme` in `src/index.css`) · react-router-dom 7 · oxlint · lucide-react.
PDF.js is loaded from a CDN at runtime — do NOT re-add `pdfjs-dist`. The PWA is hand-maintained in `public/` — do NOT re-add `vite-plugin-pwa`. (Dead entries removed 2026-11-16.)

## Commands (see docs/ai/COMMANDS.md for details)
- `npm run dev` — Vite dev server; proxies `/api` → `FODOL_DEV_API` (default `http://127.0.0.1:8787`)
- `npm run build` — `tsc -b && vite build` (tsc MUST pass)
- `npm run lint` — oxlint
- `npm test` — runs build then `node scripts/verify-release.js` (artifact/brand-token checks — NOT unit tests)
- `npm run preview` — serve dist

## Folder map (start here, then ONE file deeper)
- `src/App.tsx` — ALL routes. Read when: adding/changing pages or redirects.
- `src/context/LocaleContext.tsx` — locale/rtl/ltr, `t(ar,en)` helper.
- `src/views/` — one component per page (17 views, up to ~700 lines).
- `src/components/{layout,common,reader,icons}` — shared UI.
- `src/lib/contentApi.ts` — SOLE FODOL API client. SECURITY-SENSITIVE (see GOTCHAS).
- `src/lib/publicAsset.ts` — 3-line asset URL prefixer (`publicAsset('images/...')`).
- `src/data/` — content data: `seedData.ts` (950 lines — NEVER read fully), `forumPosters.json`, `partnersData.ts`.
- `src/index.css` — Tailwind v4 `@theme` design system; brand tokens are HARD-VERIFIED by verify-release.js.
- `public/` — static content (magazine webp, sw.js, manifest.json, 404.html).
- `scripts/` — `verify-release.js` (release gate) + `convert_all_to_webp.py` (asset optimizer).
- `docs/ai/` — shared agent context (read ONLY the file matching your task). `docs/adr/` = decisions.

## Working rules
First read: this file → `docs/ai/CONTEXT_MAP.md` (search patterns) → the one relevant `docs/ai/*` file.
Search with `rg`/grep by symbol before opening files: `rg -l "requestPageGrant"`, `rg "VITE_FODOL"`.
Read a view/component only the region you need (offset/limit); views are self-contained except imports.

## Never
- Do NOT read/commit: `node_modules/`, `dist/`, `package-lock.json`, `seedData.ts` in full, `.env.local`, `private-storage/` (FODOL private content — committing defeats the protection system).
- Do NOT open large files fully (>150 lines) before searching; do NOT re-read a file you already read and haven't changed.
- Do NOT edit generated files: `dist/**`, `package-lock.json`, `public/magazine/*` (pre-rendered assets, regenerated server-side).
- Do NOT run: `git push --force`, deleting `public/`, `rm -rf dist` in production contexts, or any command touching `private-storage/`.
- Do NOT change FODOL grant/token flow, cookies, or URL construction in `contentApi.ts` — see docs/ai/GOTCHAS.md §1.
- Do NOT weaken the light-mode-only design system or drop brand tokens checked by verify-release.js.
- Do NOT enable live forms: any live data collection (`VITE_ENABLE_LIVE_FORMS=true`) requires privacy/legal sign-off — policy survives the env cleanup that removed the dead var.

## Editing rules
- Code: TypeScript strict; components are function components; i18n via `useLocale().t(arText, enText)` — every user-facing string needs both languages.
- Routes: add in `src/App.tsx` only; route pattern `/:locale/<slug>`; keep redirect blocks tidy.
- CSS: Tailwind utilities + `@theme` tokens in `src/index.css`; verify tokens survive in compiled CSS (verify-release checks `#111020` etc.).
- Tests: there ARE none. Verify via `npm run build` + `npm test`. Add new checks to `scripts/verify-release.js` as `check(...)` blocks — do not introduce a test framework without asking.
- Env: new public vars must be `VITE_*` and documented in `.env.fodol.example` (the single env template).

## Before finishing any task — checklist
- [ ] `npm run build` passes (tsc clean)
- [ ] `npm run lint` clean
- [ ] `npm test` passes (only after a build; it verifies artifacts + brand tokens in compiled CSS)
- [ ] If UI changed: checked in BOTH `ar` (rtl) and `en` (ltr)
- [ ] If assets/paths changed: used `publicAsset()` or `%BASE_URL%`, works under `/scii/` base on GitHub Pages
- [ ] No secrets, no `private-storage/` content, no generated files touched
- [ ] New user-facing text has both Arabic and English

## Context library (read ONE per task)
| Need | Read |
|---|---|
| Data flow / modules / boundaries | docs/ai/ARCHITECTURE.md |
| Commands deep-dive | docs/ai/COMMANDS.md |
| Style / naming / i18n / logging | docs/ai/CONVENTIONS.md |
| Where to look / search recipes | docs/ai/CONTEXT_MAP.md |
| Do X (add page, fix bug, add check) | docs/ai/TASKS.md |
| Security, dead code, broken docs | docs/ai/GOTCHAS.md |
| Token budget & strategy | docs/ai/TOKEN_BUDGET.md |
