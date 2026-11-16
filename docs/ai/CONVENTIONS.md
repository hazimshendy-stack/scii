# CONVENTIONS — Sci Infinity

## Language & naming
- TypeScript strict (`tsconfig.app.json`); `tsc -b` must pass on every build. No JS in `src/` (scripts/ are Node tooling, CommonJS-ish ESM .js).
- Components: function components, named exports (`export const XView`), one component per file.
- Files: PascalCase `.tsx` for components/views (`HomeView.tsx`), camelCase for libs (`contentApi.ts`).
- Routes slugs: kebab-case under `/:locale/` (e.g. `/:locale/team-achievements`).

## i18n (mandatory)
- Every user-facing string: `t('النص العربي', 'The English text')` from `useLocale()`.
- Data objects: `_ar` / `_en` field pairs (see `seedData.ts` interfaces).
- Default locale `ar` (RTL). Test UI in both `/ar/...` and `/en/...`.

## Styling
- Tailwind v4 utilities only. Design tokens (colors, fonts) live in `src/index.css` `@theme` / `:root`; do not hard-code brand hexes in components.
- Brand hexes are verified by `scripts/verify-release.js` — if you change a token, update the check list in that script in the same change.
- Light mode only. Do not add dark-mode variants.
- Fonts: Playpen Sans Arabic (both languages), Squada One (EN display) — loaded in `index.html`, classes `font-arabic`/`font-english` managed by LocaleContext.

## Assets
- Public asset URLs: `publicAsset('images/foo.webp')` (src/lib/publicAsset.ts) or `%BASE_URL%` in index.html. Never hard-code absolute `/images/...` — breaks the `/scii/` GitHub Pages base.
- Images: WebP preferred; large page images pre-rendered server-side (`public/magazine/...`) — never hand-edit.

## Errors & logging
- API errors: `ContentApiError` with machine-readable `code` + `status` + optional `retryAfter` (from `contentApi.ts`). Surface `code`-driven UI states (retry vs. suspended vs. locked).
- No logging framework; no console.log left in committed code (oxlint catches some).
- No third-party error tracking configured.

## Forms
- `VITE_ENABLE_LIVE_FORMS` gate concept exists in env examples but is **not referenced anywhere in src** — Contact form currently uses a static/mailto handler (`ContactView.tsx handleEmailSubmit`). Needs confirmation: is live-form wiring planned or dead config?
- Do not enable any real data collection without privacy/legal sign-off.

## Testing
No unit tests exist. "Verified" = `npm run build` + `npm test` (artifact gate) + manual dual-locale check. When adding release checks, extend `scripts/verify-release.js` rather than introducing a framework.
