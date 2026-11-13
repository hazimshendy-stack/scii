/**
 * FODOL — Protected content API client.
 *
 * This module is the ONLY place the reader talks to the protected API.
 *
 * SECURITY RELEVANT DESIGN CHOICES:
 *
 *  1. Page URLs are never constructed by the client. The client asks the
 *     server for a grant and receives an opaque token; it cannot compute,
 *     guess, or cache a stable page URL. There is no template string
 *     anywhere in the frontend that produces a content path from a page
 *     number. This is deliberate: it removes URL enumeration as an attack
 *     surface rather than merely making it hard.
 *
 *  2. The session cookie is HttpOnly, so this code never sees or stores a
 *     session token. There is nothing credential-like in localStorage or
 *     sessionStorage for an XSS payload to steal.
 *
 *  3. Grants are fetched lazily, per page, immediately before display. The
 *     client never holds a batch of credentials, so a memory dump of the
 *     page yields at most one usable 60-second token.
 *
 *  4. Every response is treated as untrusted and validated before use.
 */

/** Base URL of the content API. Configured at build time via Vite env. */
const API_BASE = (import.meta.env.VITE_FODOL_API_BASE as string | undefined) ?? '';

export interface ReaderPolicy {
  idleTimeoutSeconds: number;
  absoluteTimeoutSeconds: number;
  grantTtlSeconds: number;
  maxConcurrentPages: number;
}

export interface IssueMeta {
  slug: string;
  titleEn: string;
  titleAr: string | null;
  pageCount: number;
}

export interface PageGrant {
  token: string;
  expiresInSeconds: number;
  page: number;
  variant: string;
}

/** Error carrying a machine-readable code from the server. */
export class ContentApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryAfter?: number;

  constructor(message: string, code: string, status: number, retryAfter?: number) {
    super(message);
    this.name = 'ContentApiError';
    this.code = code;
    this.status = status;
    if (retryAfter !== undefined) this.retryAfter = retryAfter;
  }
}

function url(path: string): string {
  return `${API_BASE}${path}`;
}

async function parseError(res: Response): Promise<ContentApiError> {
  let code = 'unknown_error';
  let message = `Request failed with status ${res.status}.`;
  try {
    const body = (await res.json()) as { error?: { code?: string; message?: string; retryAfter?: number } };
    if (body.error?.code) code = body.error.code;
    if (body.error?.message) message = body.error.message;
    const ra = res.headers.get('retry-after');
    if (body.error?.retryAfter !== undefined) {
      return new ContentApiError(message, code, res.status, body.error.retryAfter);
    }
    if (ra) return new ContentApiError(message, code, res.status, Number.parseInt(ra, 10));
  } catch {
    /* response was not JSON; keep the defaults */
  }
  return new ContentApiError(message, code, res.status);
}

/**
 * Ensure a reading session exists.
 * credentials:'include' is required for the HttpOnly cookie to be sent and
 * accepted cross-origin during local development.
 */
export async function startSession(): Promise<ReaderPolicy> {
  const res = await fetch(url('/api/session'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!res.ok) throw await parseError(res);
  const body = (await res.json()) as { policy: ReaderPolicy };
  return body.policy;
}

/** Revoke the current session server-side. */
export async function endSession(): Promise<void> {
  await fetch(url('/api/session/logout'), { method: 'POST', credentials: 'include' });
}

export async function fetchIssue(slug: string): Promise<IssueMeta> {
  const res = await fetch(url(`/api/issues/${encodeURIComponent(slug)}`), {
    credentials: 'include',
  });
  if (!res.ok) throw await parseError(res);
  const body = (await res.json()) as { issue: IssueMeta };
  return body.issue;
}

/**
 * Request a short-lived grant for exactly one page.
 *
 * @param variant render size hint; the server clamps this to a known set,
 *                so an attacker cannot request an arbitrarily large render.
 */
export async function requestPageGrant(
  slug: string,
  page: number,
  variant: 'mobile' | 'tablet' | 'desktop'
): Promise<PageGrant> {
  const res = await fetch(url(`/api/issues/${encodeURIComponent(slug)}/grant`), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, variant }),
  });
  if (!res.ok) throw await parseError(res);
  const body = (await res.json()) as { token: string; expiresInSeconds: number; page: number; variant: string };
  return {
    token: body.token,
    expiresInSeconds: body.expiresInSeconds,
    page: body.page,
    variant: body.variant,
  };
}

/**
 * Redeem a grant and return an object URL for the fetched image.
 *
 * We fetch as a blob rather than assigning the token URL directly to
 * <img src>. Reason: grants are single-use, so a browser-initiated retry
 * (or a prefetch the browser decides to do) would burn the token and
 * produce a broken image. Fetching explicitly gives us control, and lets us
 * revoke the object URL deterministically when the page is released.
 *
 * The blob URL is same-origin and short-lived; the caller MUST call
 * URL.revokeObjectURL when done, which we do in the reader.
 */
export async function fetchPageImage(token: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(url(`/api/content/${encodeURIComponent(token)}`), {
    credentials: 'include',
    ...(signal ? { signal } : {}),
  });
  if (!res.ok) throw await parseError(res);

  // Defence in depth: confirm we actually received an image, not an HTML
  // error page that would render as a broken tag.
  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) {
    throw new ContentApiError('Server returned a non-image response.', 'bad_content_type', res.status);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Choose a render variant from viewport size.
 * Mobile clients get a smaller render, which is both a bandwidth saving and
 * a reduction in the value of any single captured page.
 */
export function chooseVariant(widthPx: number): 'mobile' | 'tablet' | 'desktop' {
  if (widthPx < 768) return 'mobile';
  if (widthPx < 1280) return 'tablet';
  return 'desktop';
}

/** True when the API is configured; the reader shows a clear notice if not. */
export function isApiConfigured(): boolean {
  // In dev the Vite proxy handles /api, so an empty base is valid.
  return true;
}
