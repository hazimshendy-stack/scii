# Agent Operating System — Final Report (Sci Infinity FODOL)

> **Superseded (2026-11-16):** this historical report documents the state at its date only. A later full reorg/cleanup removed `docs/KNOWN_ISSUES.md`, the dead dependencies (`pdfjs-dist`, `vite-plugin-pwa`), the dead env vars/config, one-shot migration scripts, and unreferenced assets. Treat every current-state claim in this file as potentially stale; trust `AGENTS.md`, `package.json`, and the code.

**Date:** 2026-11-16 · **Scope:** full reverse-engineering + documentation/token-optimization of the existing repository.
**Method:** every structural claim below is evidence-labeled: **VERIFIED** (checked in code / executed) or **INFERRED** (strong evidence). Nothing destructive was done; production code was only read, never modified.

---

## 1. Project understanding report

**What it is (VERIFIED).** A static React 19 single-page application for **Sci Infinity (FODOL)**, a
non-profit scientific initiative. Bilingual **Arabic-first (default, RTL) + English (LTR)**, light-mode
only. Single deployable artifact: a Vite build to `dist/`.

**Two magazine readers are the project's distinctive feature (VERIFIED):**
1. `MagazineView` — static, pre-rendered WebP pages shipped inside `public/magazine/fudul-issue-1/{desktop,mobile}/pNNN.webp`.
2. `ProtectedPage` + `contentApi.ts` — **protected** reading through an **external FODOL content server** (not in this repo): HttpOnly session cookie, per-page opaque single-use grants (~60 s TTL), image-only responses, no client-side URL construction.

**Stack (VERIFIED):** React 19 · TypeScript ~6.0 (strict) · Vite 8 · Tailwind CSS v4 (`@theme` tokens) ·
react-router-dom 7 · oxlint · lucide-react · hand-maintained PWA (`public/sw.js`, `manifest.json`, `offline.html`).
`pdfjs-dist` and `vite-plugin-pwa` are declared but **unused** (code loads PDF.js from CDN at runtime).

**Deploy (VERIFIED):** GitHub Pages under `/scii/` via `deploy.yml` (Node 20, `npm ci`, build,
404.html SPA copy, `actions/deploy-pages`). `vite.config.ts` flips `base` to `/scii/` when
`GITHUB_ACTIONS=true`, else `/` — so Vercel/Cloudflare builds are root-based. Vercel configured via `vercel.json`
(SPA rewrite + security headers).

**Testing (VERIFIED):** no unit-test framework. `npm test` = `pretest` build + `scripts/verify-release.js`,
a 10-check artifact/brand-token/content-integrity gate. Executed 2026-11-16: **all 10 PASS, exit 0**.

**Repo state (VERIFIED):** git history exists but messages are numbered placeholders ("9", "8", …) —
no conventional commits, no CHANGELOG, no LICENSE.

## 2. Documentation inventory & design decisions

### Created (this work)
| File | Purpose | Lines |
|---|---|---|
| `README.md` | Human-facing overview: quick start, commands, where-to-look, stack, doc map | 45 |
| `DEPLOYMENT.md` | **Rewritten** — was outdated (stale paths, wrong Node version); now verified against CI/`vite.config.ts` | 73 |
| `CONTRIBUTING.md` | Definition-of-done, conventions, do-not list, security-sensitive file list | 42 |
| `SECURITY.md` | FODOL threat model as client contract, forbidden regressions, vulnerability reporting | 51 |
| `docs/KNOWN_ISSUES.md` | Honest gap register (10 items, each evidence-labeled) | 66 |
| `docs/adr/README.md` + **5 ADRs** | Verified architectural decisions: 0001 grant model · 0002 dual base path · 0003 release gate · 0004 bilingual model · 0005 static pre-render | 14 + 35/28/40/30/39 |

### Updated
- `AGENTS.md` — stale flags cleared (`No README exists`, `pdfjs-dist? needs confirmation`, `DEPLOYMENT.md outdated`) now corrected; folder map extended to `docs/adr/` + `KNOWN_ISSUES`.

### Deliberately NOT created (Rule D — no artificial docs)
The master checklist's ~155 items include many that **do not apply to this project**, and creating
them would manufacture false knowledge or duplicate `docs/ai/`. Skipped with reason:
- **Backend/DB docs** (`API.md` for in-repo server, `DATABASE.md`, migrations, ORM docs) — no server
  or database exists in this repo; the FODOL server is a separate repository (its contract is
  documented in `SECURITY.md` + ADR 0001 + `.env.fodol.example`).
- **GraphQL/OpenAPI/WebSocket docs** — no such surface exists (a plain 5-endpoint REST client).
- **CI/CD design docs, job/queue docs, microservice diagrams** — one static deploy (`deploy.yml`),
  documented in `DEPLOYMENT.md`.
- **Parallel agent-context trees** (`ai/`, `.github/agents/`, a second `docs/context/`…) — the repo
  already ships `docs/ai/` (7 files) + `AGENTS.md` + 5 alias stubs (`CLAUDE.md`, `GEMINI.md`, `AGENT.md`,
  `.windsurfrules`, `.cursor/rules/scii-rules.mdc`, `.github/copilot-instructions.md`) as the single
  source of truth for agent context. Duplicating it would **increase** context cost and invite drift —
  a direct violation of the single-source-of-truth and token-efficiency requirements. It was
  **strengthened**, not replicated.
- **Per-view specs, per-component docs** — 17 views are self-contained; `docs/ai/CONTEXT_MAP.md` maps
  them and prescribes region reads. Full per-view docs would be pure duplication.
- **CHANGELOG** — git history is numbered placeholders; a changelog would be fiction until it isn't.
  `docs/adr/` + ADR discipline covers decision history instead. Flagged in `KNOWN_ISSUES` §9.
- **Test-plan / test-strategy docs** — deliberately no test framework (ADR 0003); gate is documented there.

## 3. Context architecture (how a future agent works here)

```
AGENTS.md  (root, ~64 L, always read first — hard limits + routing table)
 ├─► docs/ai/  ← "read ONE per task" routing:
 │    ARCHITECTURE.md  data flow / boundaries
 │    COMMANDS.md      commands deep-dive
 │    CONTEXT_MAP.md   find-before-reading: rg recipes + route map
 │    CONVENTIONS.md   naming / i18n / styling / forms
 │    GOTCHAS.md       ranked pitfalls (FODOL boundary, dead config, base path)
 │    TASKS.md         imperative recipes (add page, fix bug, release check…)
 │    TOKEN_BUDGET.md  retrieval discipline + budget
 ├─► docs/adr/           "why" — 5 verified decisions
 ├─► docs/KNOWN_ISSUES.md  "what's off" — honest gap register
 ├─► README.md / CONTRIBUTING.md / SECURITY.md / DEPLOYMENT.md  (human-oriented)
 └─► alias stubs (CLAUDE/GEMINI/AGENT/.windsurfrules/.cursor/.github) → AGENTS.md only, zero duplication
```

**Progressive disclosure:** an agent never reads the repo to orient — it reads `AGENTS.md`, routes to
one `docs/ai/*` file, then opens code **by grep/rg symbol lookup**, in the **region it needs**
(views are 300–680 lines and must not be read fully). The 5 alias stubs guarantee any vendor harness
lands on the same single source of truth.

## 4. Token-efficiency report

**Measured (chars/4 approximation) on 2026-11-16:**

| Mode | Files | ~Tokens |
|---|---|---|
| Naive: scan all 40 source files to understand (incl. full `seedData.ts`, 950 L) | 40 | **~93,000** |
| Optimized: `AGENTS.md` + all of `docs/ai/` + `README.md` + `KNOWN_ISSUES.md` (full orientation ceiling) | 10 | **~8,200** |
| Optimized, single task (AGENTS + ONE `docs/ai/*` file, e.g. TASKS) | 2 | ~2,000 |

**Measured reduction: ~91% (naive → optimized ceiling)** and **~98% (naive → single-task path)** —
matching the target band of `docs/ai/TOKEN_BUDGET.md` (80–90%) with the ceiling figure now a measured
value, not an asserted one. Note: this measures **orientation context**; per-task code reads are
additive but region-bounded by design (offset/limit discipline).

Why it works: single source of truth (no duplicate agent files), alias stubs (2-line redirects),
grep-first context map (find before read), one-file-per-task routing, region reads of large files,
and a hard "never read full" list (`seedData.ts`, `node_modules/`, `dist/`, generated assets).

## 5. Engineering quality report

**Strengths (VERIFIED):**
- **Security-minded architecture**: the protected reader's threat model is explicit in code comments
  (deter vs. enforce), invariant list is real, dev proxy keeps cookies first-party.
- **Enforced design system**: brand palette is *machine-verified* in compiled CSS by the release gate.
- **Honest self-documentation** pre-existed in `docs/ai/` — including a trust-order rule (code > docs)
  and a read-forbidden list. Rare and valuable.
- **Clean build**: tsc strict passes, 1,988 modules, 8.4 s build, 10/10 release gates, lint 0 errors
  (4 pre-existing warnings in `scripts/*.js`, untouched per the no-destructive-change rule).

**Weaknesses (VERIFIED, tracked in `docs/KNOWN_ISSUES.md`):**
1. **Design-token duality** — `@theme` palette components use (`#5D3B8E`…) ≠ the legacy `:root` set the gate checks (`#56368d`…). Gate passes but the two palettes have drifted; a "cleanup" risks a silent visual regression **or** a gate failure.
2. **Dead config** — `VITE_DB_MODE` / `VITE_ENABLE_LIVE_FORMS` / `VITE_SUPABASE_*` in env examples, referenced nowhere; misleading.
3. **Dead deps** — `pdfjs-dist`, `vite-plugin-pwa`; PDF.js CDN load has **no SRI/version pin** (minor supply-chain surface).
4. **No license file**; git messages are placeholders (no real changelog).
5. **No automated runtime tests** — by design (ADR 0003), but coverage relies on manual dual-locale checks.

## 6. Agent-scenario validation (clean-room)

An independent subagent with **no prior context** was given only the repo root and the standard
agent instruction, plus three micro-tasks: (T1) add a "Gallery" page; (T2) explain the protected
reader's security model; (T3) state release-readiness criteria and what `npm test` really does.

**Result: the navigation system works as designed.**

| Metric | Result |
|---|---|
| Files opened to complete all 3 tasks | **10** (7 docs + 2 code *headers* + listings) |
| Files read the docs did not point to | **0** |
| Full reads of any >150-line file | **0** (`contentApi.ts` read as lines 1–24, `ProtectedPage.tsx` 1–18, `App.tsx` route-region only) |
| Free-exploration outside the prescribed path | none (one initial root listing, as instructed) |
| Never-list honored (node_modules, dist, seedData full, .env.local, private-storage) | fully |
| Correctness of T1/T2/T3 answers | all three match the verified ground truth (route recipe, grant model incl. "friction, not security", the 10-gate release contract) |

**Defects found by the simulation and fixed immediately:**

1. **`AGENTS.md` referenced `docs/adr/0003`** — a shorthand that is not a resolvable path. The agent
   had to `glob docs/adr/*` to find `0003-release-gate-not-unit-tests.md`. **Fixed:** the reference is
   now the full path.
2. **`docs/ai/COMMANDS.md` Node-version note was stale** ("DEPLOYMENT.md says v24 — needs
   confirmation"). **Fixed:** now states CI = 20, verified in `deploy.yml` (2026-11-16). The
   verify-release section was also upgraded from a generic description to the explicit 10-gate list,
   closing the "newcomer could underestimate what `npm test` covers" gap.

**Minor observation (accepted, not changed):** CONTEXT_MAP/TASKS say `contentApi.ts` (190 L) may be
read fully; the simulation's minimal-read interpretation (24-line security header) answered T2
completely. The "read fully" guidance remains valid for modification tasks; leaving it as-is.

## 7. Readiness assessment

**Assessment: HIGH-READY for agent onboarding (with documented exceptions).**

| Criterion | Status |
|---|---|
| New agent can orient without scanning the repo | ✅ measured ~91–98% context reduction |
| Single source of truth, zero-duplication alias stubs | ✅ 5 stubs → `AGENTS.md` |
| Security boundaries documented AND enforced by gate | ✅ FODOL invariants + ADR 0001 + SECURITY.md |
| Release path automated and reproducible | ✅ CI + `npm test` (10 gates, verified passing today) |
| Known gaps honestly registered, not hidden | ✅ 10 items in `KNOWN_ISSUES.md`, all evidence-labeled |
| Runtime behavior auto-verified | ⚠️ no (by design; manual dual-locale checklist) |
| Supply-chain pinning of PDF.js CDN | ⚠️ open (KNOWN_ISSUES §7) |
| Licensing | ⚠️ open (maintainer decision) |

**Recommended next actions (owner's call, none performed here):** reconcile the two brand palettes;
remove or wire the dead env vars; drop the two dead deps or pin the CDN load; pick a LICENSE;
consider conventional commits so history becomes a changelog.
