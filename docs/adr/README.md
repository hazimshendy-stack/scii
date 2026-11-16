# Architecture Decision Records (Sci Infinity FODOL)

Short records for decisions that are already implemented in the codebase. Status legend:
`Accepted` (implemented, current) · `Superseded by NNNN` · `Deprecated`.

| # | Decision | Status |
|---|---|---|
| [0001](0001-protected-content-grants.md) | Protected magazine delivery via short-lived single-use grants (external server) | Accepted |
| [0002](0002-base-path-dual-deploy.md) | Dual base path: `/scii/` on GitHub Pages, `/` elsewhere | Accepted |
| [0003](0003-release-gate-not-unit-tests.md) | Release verification = build artifact gate, not unit tests | Accepted |
| [0004](0004-bilingual-data-model.md) | Bilingual everywhere: `_ar`/`_en` data fields + `t(ar,en)` for UI | Accepted |
| [0005](0005-static-magazine-pre-render.md) | Static magazine pre-rendered to WebP, served from `public/` | Accepted |

Rules of thumb:
- Keep each ADR ≤ ~90 lines. Context → decision → consequences → evidence (file paths).
- Every claim is labeled **VERIFIED** (checked in code) or **INFERRED** from evidence.
- If a decision changes, do not delete the old ADR — add a new one and mark the old `Superseded`.
