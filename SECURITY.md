# Security — Sci Infinity (FODOL) frontend

This repository is a **static frontend**. The protected content and its enforcement live on a
**separate FODOL content server** (not in this repo), described here only as the client-side contract.
Treat this as: what the frontend does to *support* security, and what must never be regressed.

## The protected-content model (FODOL)

The reader in `src/lib/contentApi.ts` + `src/components/reader/ProtectedPage.tsx` is the **security
boundary** of this repo. Its invariants are deliberate and must survive any change:

| Invariant | Why |
|---|---|
| The client **never constructs a content URL**. A page image exists only via an opaque, single-use grant token. | Removes URL enumeration as an attack surface, not just makes it hard. |
| Session cookie is **HttpOnly**; the client never reads or stores it. | Nothing credential-like in `localStorage`/`sessionStorage` for an XSS payload to steal. |
| Grants are fetched **lazily, per page**, 60 s TTL, single-use, concurrency bounded. | A memory dump yields at most one briefly-usable token; a scraper cannot open 39 parallel connections. |
| Page response is validated (`content-type` must be `image/*`); blob URL is **revoked** after display. | No stale credential; no broken/error-HTML-as-image rendering. |
| Dev proxy keeps API + reader **same-origin** (first-party `SameSite=Lax` cookie). | No cross-site cookie relaxation is ever needed in production either. |

**Client-side deterrents are friction, not security.** The context-menu / selection / keyboard
handlers in `ProtectedPage.tsx` stop casual attempts and cost nothing, but any of them can be bypassed in
DevTools. All real enforcement is server-side. Do not present these as protection, and do not remove
the honest documentation in the file's header comments.

## Forbidden regressions (frontend)

- Do not add a URL template that maps page number → content path.
- Do not batch, pre-cache, or store grant tokens anywhere client-accessible.
- Do not raise reader concurrency beyond the bounded pre-load window.
- Do not weaken the same-origin / `credentials: 'include'` contract for the protected API.

## Secrets & sensitive data

- **Secrets:** none belong in this repo. The FODOL server's signing keys, admin token, and IP-hash key
  live in that server's environment (see `.env.fodol.example` for the schema — it documents the *shape*,
  and ships no real values).
- **`private-storage/`** (git-ignored) holds the original master PDFs, rendered watermarked images, the
  access-control database, and quarantined uploads. **Publishing any of it defeats the entire protection
  system.** Never read, import, or commit from it.
- **`.env.local`, `.dev-secrets.env`** are git-ignored local/secrets files — never commit.
- `public/` is publishable static content; `src/data/` is public content data. Both are fine to ship.

## Deployment hardening (what the repo configures)

- Vercel sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and immutable `Cache-Control` for static assets
  (`vercel.json`). GitHub Pages is static; add equivalent headers at the hosting layer if you self-host.
- PDF.js is loaded from a **CDN at runtime** (`PdfThumbnail.tsx`, `AnnualForumView.tsx`) via
  `/* @vite-ignore */`, deliberately kept out of the bundle. Note: Subresource-Integrity / version pinning of
  the CDN is **not** configured — accepted risk as of 2026-11-16; mitigate by pinning the CDN version or
  self-hosting pdf.js before any security-hardening pass.

## Report a vulnerability

If you find a real or suspected security issue in this frontend or in the FODOL reader flow:

1. **Do not** exploit it, publish details, or reference real `private-storage/` content.
2. Report it directly to the project maintainer (see the repository owner) with:
   - a short description of the affected flow (e.g. "protected reader grant reuse"),
   - the minimal reproduction or the relevant file/function,
   - the environment (base path, locale, dev vs. deployed).
3. Prefer a private channel. Avoid including secrets or user data in the report.

## Out of scope for this repo

Server-side rate limiting, abuse detection, watermarking, grant signing, IP hashing, and storage
enforcement are implemented on the FODOL content server, not here. Report server-side issues to the
owner of that repository.
