# CONTEXT_MAP — where to look for what

## Find before reading

| Question | Search / file (in order) |
|---|---|
| Where is route X? | `rg "path=" src/App.tsx` |
| Who uses a symbol? | `rg -n "symbolName" src` |
| Which view renders a section? | `rg -l "label-text" src/views` |
| FODOL API shape | `src/lib/contentApi.ts` (190 lines — read fully, it's the contract) + `.env.fodol.example` (server side) |
| Reader/page display logic | `src/components/reader/ProtectedPage.tsx` (line ~1: state machine), `src/views/MagazineView.tsx` (shell: PAGE_COUNT, preload window) |
| Locale/RTL behavior | `src/context/LocaleContext.tsx` (77 lines) |
| Styling tokens / gradients | `src/index.css` (lines 1–60: @theme + :root) |
| Content data (activities, team, posters) | `src/data/seedData.ts` (interfaces lines 1–60), `src/data/forumPosters.json`, `src/data/partnersData.ts` |
| Release gate checks | `scripts/verify-release.js` |
| CI/deploy | `.github/workflows/deploy.yml`, `vercel.json`, `DEPLOYMENT.md` (partially outdated) |
| Security decisions "why" | header comments in `src/lib/contentApi.ts` (lines 1–24) and `src/components/reader/ProtectedPage.tsx` (lines 1–18) |

## Ready-to-use searches
```
rg -n "VITE_" src                 # all env usage
rg -n "useLocale" src/views        # which views are bilingual-ready
rg -ln "publicAsset" src           # asset URL usage
rg -n "Navigate to" src/App.tsx    # redirects
rg -n "grant|Grant" src            # protected-content flow
rg -n "TODO|FIXME|XXX" src
```

## Files NOT to read fully (search instead)
- `src/data/seedData.ts` (950 lines, ~73 KB) — content data; read interfaces (1–60) or `rg "export const"`.
- `src/views/MagazineView.tsx` (680) — read the doc header + specific handler region.
- `src/views/TeamAchievementsView.tsx` (516), `AnnualForumView.tsx` (435), `HomeView.tsx` (406) — region reads only.
- `dist/**`, `node_modules/**`, `package-lock.json`, `public/magazine/**` (39×2 webp), `public/images/**` — never.
- `.env.local`, `private-storage/`, `.dev-secrets.env` — forbidden.

## Map of the 17 views (route → file)
`/` → ar redirect → HomeView; `about`; `annual-forum` (AnnualForumView — includes pdfjs CDN poster viewer); `projects-activities` + `/projects-activities/:slug`; `partners`; `fudul` (MagazineView); `sci-cast` + `/sci-cast/episode/:n` (PodcastView/EpisodeDetailView); `team-achievements`; `join-us`; `contact`; `privacy`; team → redirects home (TeamView kept but hidden); 1st/2nd-forum slugs → annual-forum; research → team-achievements; `*` → NotFoundView.
