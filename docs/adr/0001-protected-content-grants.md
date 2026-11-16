# ADR 0001 — Protected magazine delivery via short-lived single-use grants

**Status:** Accepted · **Date:** 2026 (pre-dates this documentation) · **Code:** `src/lib/contentApi.ts`, `src/components/reader/ProtectedPage.tsx`

## Context

The FODOL magazine is protected content: the original PDF must never reach the browser, and page
images must not be enumerable by URL. A plain "static image" approach cannot provide this, and a
client-side encryption layer would only be friction.

## Decision

Enforcement lives on an **external FODOL content server** (separate repository, default
`127.0.0.1:8787` in dev). The client talks to it through exactly five endpoints
(`startSession`, `endSession`, `fetchIssue`, `requestPageGrant`, `fetchPageImage`) and obeys these
invariants (**VERIFIED** by reading `contentApi.ts` line by line):

1. The client **never constructs a content URL**. A page exists only as an opaque, single-use,
   ~60-second grant token that is redeemed for one `fetchPageImage` call.
2. Auth is an **HttpOnly session cookie** (`credentials: 'include'`). The client never stores or
   reads credentials in `localStorage`/`sessionStorage`.
3. Grants are fetched **lazily per page** (with a bounded IntersectionObserver pre-load window,
   `rootMargin: '400px 0px'`), never batched. A memory dump yields at most one briefly-usable token.
4. Responses are validated (`content-type` must start `image/*`); the object URL is revoked after
   display; requests are cancellable (`AbortController`).
5. In dev, Vite proxies `/api` to the server so the cookie stays **first-party same-origin**.
   `VITE_FODOL_API_BASE` stays empty (same origin) in production.

Client-side context-menu/selection/keyboard guards in `ProtectedPage.tsx` are explicitly
**deterrents, not security** (the file's own header says so) — DevTools bypasses all of them.

## Evidence

- `contentApi.ts` (190 L): 5 exports, `ContentApiError` with `retryAfter`, `chooseVariant(widthPx)`
  breakpoint 768/1280 for mobile/tablet/desktop image variants — VERIFIED.
- `.env.fodol.example` (139 L): server-side grant TTL 60 s, single-use, max-pages 1, session idle
  1800 s / absolute 43200 s, watermarking with IP-hash, quarantined uploads under
  `FODOL_STORAGE_ROOT` — documented there, server repo implements it.

## Consequences

- A scraper cannot replay, cache beyond 60 s, or enumerate content URLs (no URL ↔ page mapping).
- This repo is therefore **not** where security bugs are fixed; frontend changes must not regress any
  invariant in §Decision (see `SECURITY.md` "Forbidden regressions").
- The static site works with **no server**; only the protected reader needs it. That split is
  deliberate and must stay (see ADR 0005 for the static half).
