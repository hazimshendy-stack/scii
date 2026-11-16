# ADR 0004 — Bilingual everywhere: `_ar`/`_en` data fields + `t(ar,en)` for UI

**Status:** Accepted · **Date:** 2026 (pre-dates this documentation) · **Code:** `src/context/LocaleContext.tsx`, `src/data/seedData.ts`

## Context

The initiative is Arabic-first (default locale) but fully bilingual: every page must render in Arabic
(RTL) at `/ar/...` and English (LTR) at `/en/...`. Missing one language is a content defect visible
at runtime. The codebase is large (17 views) and inconsistent translation handling would be the
single biggest i18n bug source.

## Decision

Two rules, one for **data**, one for **UI strings**:

1. **Data records** in `src/data/` carry parallel `_ar` / `_en` fields — VERIFIED across
   `seedData.ts` interfaces: `Committee.name_ar/.name_en`, `TeamMember.name_ar/.role_ar`,
   `Activity.title_ar/.summary_ar/.location_ar` + `date_display_ar`, `MagazineIssue.title_ar`,
   plus inline objects like `facebook_posts: { label_ar, label_en, url }`.
   Code selects with `.name_ar` vs `.name_en` (or, for objects, `{ _ar, _en }` records).
2. **UI strings** go through the locale helper: `const { t } = useLocale(); t('النص', 'Text')` —
   a two-arg `(ar, en)` call that returns the active string. `LocaleContext` derives locale from the
   URL path (`/ar` default), else `localStorage['sci-infinity-locale']`, and sets `<html lang dir>`
   plus the body font class (`font-arabic` / `font-english`).

There is **no** i18n framework (no i18next/ICU catalog) — the `t(ar, en)` helper *is* the framework,
and it keeps translation reviewable per-view without a separate build step.

## Evidence
- `LocaleContext.tsx` (77 L) — locale resolution, `<html lang dir>` + body font class, `t` signature — VERIFIED (full read).
- `seedData.ts` — every content interface has paired `_ar`/`_en` fields (head of file) — VERIFIED.
- Views call `t('…', '…')` throughout (grep shows hundreds of call sites) — VERIFIED by sampling.

## Consequences

- **Every** new user-facing string needs both arguments; an Arabic-only or English-only string is a
  bug, not a shortcut. `CONTRIBUTING.md` lists this as a definition-of-done item.
- Translators/content editors work inside view files and data files, not in a catalog.
- Adding a **third** locale is deliberately out of scope: it would require reworking `useLocale`,
  every data interface, and the whole `/ar`|`/en` route scheme.
