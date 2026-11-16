# ARCHITECTURE — Sci Infinity (FODOL) frontend

## Shape
Static SPA. No backend in this repo. Two runtime data sources:
1. **Bundled data** — `src/data/*` (seedData.ts, forumPosters.json, partnersData.ts) compiled into the JS bundle.
2. **FODOL protected-content API** — external server (this repo does NOT contain it; env config lives in `.env.fodol.example` for reference). Reached only through `src/lib/contentApi.ts` (5 endpoints, below).

## Frontend layers
- **Routing/shell** — `src/main.tsx` → `src/App.tsx` (routes) wrapped in `LocaleProvider` → `Navbar`/`Footer`.
- **i18n** — `src/context/LocaleContext.tsx`: locale from URL path (`/ar/...` default, `/en/...`), persisted to localStorage key `sci-infinity-locale`, sets `<html lang dir>` and body font classes. `t(ar,en)` picks the active language.
- **Views** — `src/views/*View.tsx`, one per route, self-contained (own data imports).
- **Shared components** — `src/components/layout` (Navbar/Footer), `common` (embeds, transcript, accordion), `reader` (ProtectedPage), `icons`.
- **Styling** — Tailwind v4 via `@tailwindcss/vite`; design tokens in `src/index.css` `@theme`. Light-mode only.

## FODOL data flow (protected magazine)
```
MagazineView (viewer shell, PAGE_COUNT, navigation, zoom)
  └─> ProtectedPage (one per visible page, lazy, bounded pre-load window)
        └─> contentApi.ts:
            startSession()      POST/GET /api/session        → HttpOnly cookie (client never sees it)
            fetchIssueMeta()    GET  /api/issues/:slug       → {pageCount, titles}
            requestPageGrant()  POST /api/issues/:slug/grant → {token, expiresInSeconds, variant} (60s TTL, single-use)
            fetchPageImage()    GET  /api/content/:token     → watermarked WebP/JPEG blob (object URL, revoked after display)
            logoutSession()     POST /api/session/logout
```
Key invariant: **the client never constructs a content path**; page images only exist via opaque grants. All enforcement is server-side.

## Static reader (legacy/alternative)
`MagazineView` also reads pre-rendered `public/magazine/fudul-issue-1/{desktop,mobile}/pNNN.webp` (39 pages). No API. Client "protections" (no-select, no-context-menu) are **friction only**, documented as such.

## Deployment topology
- GitHub Pages (CI in `.github/workflows/deploy.yml`): base `/scii/` when `GITHUB_ACTIONS=true` (set by Vite config) — all asset URLs must be `publicAsset()`-relative or `%BASE_URL%`-prefixed.
- Vercel/Cloudflare: base `/`, SPA rewrite in `vercel.json` / `dist/404.html` copy in CI.
- Dev: Vite proxies `/api` → `FODOL_DEV_API` (default `127.0.0.1:8787`) to keep cookies same-origin.

## Boundaries
- `contentApi.ts` + `ProtectedPage.tsx` = security boundary. Changes there need the GOTCHAS.md §1 review.
- `public/` is publishable static content; anything in `private-storage/` (referenced in .gitignore) MUST never enter this repo or bundle.
