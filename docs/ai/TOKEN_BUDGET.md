# TOKEN_BUDGET — measurement & strategy

## Baseline (before this context system)
An agent with no context files must discover the project by reading: README (absent) + DEPLOYMENT.md (128 L) + package.json + vite.config + .gitignore + both .env examples (147 L) + App.tsx + guessing into src/ (17 views, up to 950-line files) + scripts + CI + public/ → realistically 15–30 file reads ≈ **25k–45k tokens**, often hitting 50k+ after opening seedData.ts, MagazineView.tsx, or journal data by accident, plus high duplication (env tables, deploy steps repeated across docs).

New steady-state cost per task: **AGENTS.md (~150 lines ≈ 2.5–3k tokens, auto-loaded) + ONE docs/ai file (~1–1.5k tokens) + 2–5 targeted rg/grep results + region reads** ≈ **4k–7k tokens**.

Estimated reduction: **~80–90%** for a typical task; up to >95% if the old behavior included full-file reads of data files.

| Item | Before (typical task) | After |
|---|---|---|
| Root guidance | rediscovered each session (~5k+) | AGENTS.md loaded once ~3k |
| Task-specific context | 5–15 exploratory reads (~10–25k) | 1 docs/ai file + 2–5 greps (~2–4k) |
| Accidental big reads (seedData 73KB ≈ 18k, MagazineView 17K) | common | forbidden by rule + CONTEXT_MAP |
| Duplicated env/deploy text (present in 3+ files) | re-read | single source each (.env.fodol.example stays canonical for server vars) |
| **Total/task** | **~25–45k** | **~4–7k** |

## Strategy that produces the reduction
1. **Progressive disclosure**: AGENTS.md is the only always-loaded file; the other 7 docs/ai files load on demand per table in AGENTS.md.
2. **Root files are aliases**: CLAUDE.md, GEMINI.md, AGENT.md, .windsurfrules, .cursor/rules/*.mdc, .github/copilot-instructions.md all just point at AGENTS.md — zero duplicated instructions.
3. **Search-first**: CONTEXT_MAP ships rg recipes; "find the line" beats "open the file".
4. **Read-forbidden list** (bigger files, generated files, assets, secrets) removes the largest accidental costs.
5. **Recipes instead of prose**: TASKS.md is imperative steps; GOTCHAS.md is a ranked pitfall list — no narrative.
6. **Path references, not copies**: env vars → .env.fodol.example; security rationale → the original header comments; deploy steps → CI file.
7. **One source of truth per fact**: routes in App.tsx; server config in .env.fodol.example; release criteria in verify-release.js. docs/ai never restates details verbatim, only pointers + invariants.

## Maintenance rule
If a docs/ai file grows past ~120 lines or starts repeating another file, split or cut — the budget above is only valid while files stay ≤ ~1.5k tokens each.
