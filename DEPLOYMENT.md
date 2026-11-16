# Sci Infinity — Deployment Guide

Verified against `.github/workflows/deploy.yml`, `vercel.json`, `vite.config.ts`, and `package.json`.
When this file and those files disagree, **trust the code** (same trust order as `docs/ai/GOTCHAS.md` §5).

## Prerequisites

- Node.js with npm. CI (`deploy.yml`) builds with **Node 20** — target 20+ locally.
- No build-time secrets required for the frontend (all runtime config is public `VITE_*`).

> Note: earlier drafts of this file referenced an old machine path (`d:\mo\frontend`)
> and "Node v24". Both are stale. The repo-root `npm run build` is canonical.

## Commands

| Command | What it does |
|---|---|
| `npm install` (or `ci`) | Install dependencies (CI uses `npm ci`). |
| `npm run build` | `tsc -b && vite build` → `dist/`. Fails on any TS error. |
| `npm test` | Runs the build, then `node scripts/verify-release.js` (artifact + brand-token gate — **not** unit tests). |
| `npm run preview` | Serves `dist/` locally. |

`build` output: `dist/index.html`, `dist/assets/*.js` + `*.css`, and everything copied from `public/`.

## Base path: `/scii/` vs `/`

This is the single most important deployment fact — see `docs/ai/GOTCHAS.md` §3.

- `vite.config.ts` sets `base` to **`/scii/` when `GITHUB_ACTIONS=true`** (GitHub Pages), else **`/`**.
- CI sets the GitHub Pages environment, so the Pages build automatically uses `/scii/`.
- Vercel / Cloudflare build outside CI → base `/`.
- Consequence: **never hard-code absolute `/images/...` or `/assets/...`** in code or `index.html`.
  Use `publicAsset('images/...')` in TS, or `%BASE_URL%` in `index.html`.

## GitHub Pages (primary, automated CI)

1. Push to `main` (or `master`) → `.github/workflows/deploy.yml` runs.
2. Steps: checkout → Node 20 (`npm ci`) → `npm run build` → `cp dist/index.html dist/404.html` (SPA fallback) → `actions/upload-pages-artifact` → `actions/deploy-pages`.
3. Repository must be configured for GitHub Pages "GitHub Actions" source; the Pages site is the project path (`/scii/`).
4. `GITHUB_ACTIONS=true` is provided by the runner, which flips the Vite base to `/scii/`.

Rollback: redeploy a previous commit from the GitHub Pages "Deployments" view.

## Vercel

1. Import the repository.
2. Build command `npm run build`; output directory `dist`.
3. `vercel.json` handles the SPA rewrite (`/(.*) → /index.html`) and security headers
   (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`) plus immutable
   `Cache-Control` for static assets.

Rollback: Vercel "Deployments" → redeploy a previous commit.

## Cloudflare Pages

1. Cloudflare Dashboard → Pages → connect the GitHub repo.
2. Build command `npm run build`; output directory `dist`.
3. No `.env` required. Add `VITE_FODOL_API_BASE` only if the protected-content API lives on a
   different origin (recommended is **same origin via reverse proxy — leave it empty**, see `.env.fodol.example`).

## Local development

```bash
npm install
npm run dev      # Vite on http://localhost:5173
```

- The dev Vite server proxies `/api` → `$FODOL_DEV_API` (default `http://127.0.0.1:8787`) so the
  protected reader can talk to the FODOL content server on the same origin (first-party HttpOnly cookie).
- The FODOL content **server is a separate repository** — it is not in this repo. To develop the
  protected reader you need it running on `8787` (configure it from the environment template in that repo). The static
  site (everything except the protected magazine) works with no server.

## Environment variables (frontend runtime)

Only **two** variables are actually read by the frontend code:

| Variable | Read where | Effect | Default |
|---|---|---|---|
| `VITE_FODOL_API_BASE` | `src/lib/contentApi.ts` | Base for protected-content API calls. Empty = same origin (recommended). | empty |
| `import.meta.env.BASE_URL` | Vite built-in | Drives `publicAsset()`, router `basename`, SW registration. Set from `vite.config.ts` `base`. | `/` or `/scii/` |

> The dead config vars (`VITE_DB_MODE`, `VITE_ENABLE_LIVE_FORMS`, `VITE_SUPABASE_*`) were removed
> from the env templates on 2026-11-16 after grep-verification that none are referenced in `src/`.
> Do **not** wire in any live data collection or forms without documented privacy/legal sign-off
> (policy preserved in `docs/ai/GOTCHAS.md` §5 and `CONTRIBUTING.md`).

## Production checklist

- [ ] `npm run build` clean (tsc passes)
- [ ] `npm test` green (10 release-readiness checks)
- [ ] PWA manifest valid (DevTools → Application → Manifest); SW registers
- [ ] All routes work; language switcher (RTL/LTR) works; checked in both `ar` and `en`
- [ ] No hard-coded absolute asset paths (use `publicAsset()` / `%BASE_URL%`)
- [ ] Forms stay in staging unless live-data sign-off is complete
- [ ] No `private-storage/`, `.env.local`, `dist/`, or `public/magazine/**` content committed

## Rollback

- **GitHub Pages**: redeploy a previous commit (Pages → Deployments).
- **Vercel**: redeploy a previous release.
- **Cloudflare Pages**: redeploy a previous deployment.
