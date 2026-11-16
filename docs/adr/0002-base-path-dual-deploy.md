# ADR 0002 — Dual base path: `/scii/` on GitHub Pages, `/` elsewhere

**Status:** Accepted · **Date:** 2026 (pre-dates this documentation) · **Code:** `vite.config.ts`, `src/lib/publicAsset.ts`, `src/main.tsx`, `index.html`

## Context

The site ships to **GitHub Pages** as a project page (`github.com/<org>/scii` → `/scii/`) and
optionally to **Vercel / Cloudflare Pages** at domain root. A hard-coded base path breaks one or the
other the moment it's wrong.

## Decision

`vite.config.ts` sets `base` **at build time**:

```ts
base: process.env.GITHUB_ACTIONS === 'true' ? '/scii/' : '/'
```

- **VERIFIED:** on GitHub Actions the runner provides `GITHUB_ACTIONS=true`, so the Pages build
  automatically bakes `/scii/`. Anywhere else (local, Vercel, Cloudflare) base is `/`.
- Everything that must work under **either** base routes through:
  - `publicAsset('images/...')` → `import.meta.env.BASE_URL + path` (3-line helper in `src/lib/publicAsset.ts`).
  - `%BASE_URL%` placeholder in `index.html` for `favicon`/`manifest`.
  - `BrowserRouter basename={BASE_URL}` and `${BASE_URL}sw.js` in `src/main.tsx`.
- `public/manifest.json` uses **relative** `start_url: "./"` and `scope: "./"` so it works under any base.

## Evidence
- `vite.config.ts` — the exact ternary — VERIFIED.
- `publicAsset.ts`, `main.tsx`, `index.html` — all referenced paths go through `BASE_URL` — VERIFIED.
- `.github/workflows/deploy.yml` — CI sets `GITHUB_ACTIONS`, deploys via `actions/deploy-pages`.

## Consequences

- **Never** hard-code absolute `/images/...` or `/assets/...` in code or `index.html`. Violations
  break the GitHub Pages build. See `docs/ai/GOTCHAS.md` §3.
- `npm run preview` serves `/` locally (base `/`). The `/scii/` behavior is only reproducible under CI
  or by overriding the base before build.
- If the Pages sub-path ever changes, **only** the ternary in `vite.config.ts` needs updating.
