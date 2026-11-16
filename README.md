# Sci Infinity (FODOL) — frontend

Static React single-page application for **Sci Infinity (مبادرة ساي إنفينيتي)**, a non-profit
scientific-research and entrepreneurship initiative. Bilingual by default: **Arabic (RTL)** at
`/ar/...` and **English (LTR)** at `/en/...`. Light-mode only.

Two reading experiences are bundled:

1. **Static magazine reader** — pre-rendered WebP pages served from `public/magazine/`.
2. **Protected (FODOL) reader** — pages delivered from an external protected-content API via
   short-lived, single-use grants. The original PDF never reaches the browser.

Deployed to **GitHub Pages** under `/scii/` (automated CI) and optionally **Vercel / Cloudflare Pages**
under `/`.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

The site works fully with no backend. To develop the **protected reader** you additionally need the
separate FODOL content server running on `127.0.0.1:8787` (Vite proxies `/api` to it).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server; proxies `/api` → `FODOL_DEV_API` (default `127.0.0.1:8787`). |
| `npm run build` | `tsc -b && vite build` → `dist/` (TypeScript must compile clean). |
| `npm run lint` | `oxlint`. |
| `npm test` | Builds, then runs `node scripts/verify-release.js` — **artifact / brand-token gate, not unit tests**. |
| `npm run preview` | Serve the `dist/` build locally. |

## Where to look

- `src/App.tsx` — every route (the only place routes are declared).
- `src/views/` — one component per page (self-contained).
- `src/components/{layout,common,reader,icons}` — shared UI; `reader/ProtectedPage.tsx` is the security boundary.
- `src/lib/contentApi.ts` — the **sole** FODOL API client (security-sensitive).
- `src/data/` — content data (`seedData.ts`, `forumPosters.json`, `partnersData.ts`).
- `src/index.css` — Tailwind v4 design system (`@theme`); brand tokens hard-verified by the release gate.
- `public/` — static assets (icons, magazine WebP, `sw.js`, `manifest.json`, `404.html`).

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS v4 · react-router-dom 7 · oxlint · lucide-react.
PWA via hand-maintained `sw.js` + `manifest.json` (offline fallback `offline.html`).

## Documentation

- **AI agents:** read [`AGENTS.md`](AGENTS.md) first, then **one** file from [`docs/ai/`](docs/ai/)
  (index table inside AGENTS.md). Hard limits in AGENTS.md always apply.
- **Deploying:** [`DEPLOYMENT.md`](DEPLOYMENT.md) (verified against CI).
- **Architecture decisions:** [`docs/adr/`](docs/adr/README.md).
- **Contributing:** [`CONTRIBUTING.md`](CONTRIBUTING.md) · **Security / vulnerability reporting:** [`SECURITY.md`](SECURITY.md).

## License

No license file is present in the repository. Do not assume default rights — see the maintainer.
