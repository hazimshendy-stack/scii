# TASKS — common recipes

## Add a page/view
1. Create `src/views/<Name>View.tsx` — named export, `useLocale` + `t(ar,en)` for all strings.
2. Add `<Route path="/:locale/<slug>" element={<NameView />} />` in `src/App.tsx` (kebab-case slug).
3. If it should be reachable from nav: add link in `src/components/layout/Navbar.tsx` (both languages).
4. Verify: `npm run build` + check in `/ar/<slug>` and `/en/<slug>`.
5. Optional: add a release spot-check in `scripts/verify-release.js` if the page is launch-critical.

## Fix a bug in a view
1. `rg -l "<unique text>" src/views` to find the file.
2. Read only the region around the match (offset/limit).
3. Edit; re-check both locales and both viewports (320px / desktop).
4. `npm run build` + `npm test`.

## Add content (activity / team member / partner)
1. Find the data file: `src/data/seedData.ts` (interfaces at lines 1–60 — read only those for shape).
2. Extend the array by matching the interface; every text field needs `_ar` + `_en` (or the paired field convention the record uses).
3. Images go in `public/` with `publicAsset()`-compatible relative paths; WebP preferred.
4. Do NOT rewrite the whole seedData.ts; targeted edit only.

## Change the design system (colors/fonts/gradient)
1. Edit `@theme` / `:root` in `src/index.css` (lines 1–60).
2. `rg` the old hex in src to catch hard-coded copies.
3. Update the token list in `scripts/verify-release.js` in the same change (it hard-checks `#111020 #56368d #434a9a #3b56a6 #2774bb #1196d3`).
4. `npm test` — fails if a required token vanished from compiled CSS.

## Work with the protected reader (FODOL)
1. Read `src/lib/contentApi.ts` fully first (190 lines — it's the security contract).
2. UI state machine for one page: `ProtectedPage.tsx`; preload window: `MagazineView.tsx`.
3. NEVER: construct content URLs client-side, batch grants, store tokens in storage, relax concurrency. See GOTCHAS §1.
4. Dev: start FODOL server (separate repo) on 8787 or set `FODOL_DEV_API`; the Vite proxy keeps cookies first-party.

## Upgrade a dependency
1. `npm install <pkg>@version` (updates lockfile — the only allowed lockfile edit, via npm).
2. `npm run build` catches TS breakage; check React peer versions (React 19).
3. Note: PDF.js is a CDN runtime import, **not** a dependency (`components/common/PdfThumbnail.tsx`, `AnnualForumView.tsx`) — do not re-add `pdfjs-dist`.

## Add a release-check gate
Append a `check('Title', () => {...})` block in `scripts/verify-release.js`; it runs after `npm run build` via `npm test`.

## Do NOT (any task)
- Delete `TeamView.tsx` (intentionally preserved, hidden).
- Add dark mode, a test framework, or new state-management libs without asking.
- Touch `private-storage/`, `.env.local`, `dist/`, `public/magazine/**`.
