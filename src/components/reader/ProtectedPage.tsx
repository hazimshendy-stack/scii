/**
 * FODOL — Protected page viewer.
 *
 * Replaces the previous <iframe src="magazine.pdf"> approach. The original
 * PDF is never referenced, requested, or present in the client bundle.
 * Each page is fetched as a watermarked image via a short-lived grant.
 *
 * READING MODEL: continuous vertical scroll, one page at a time, with a
 * bounded window of preloading. This mirrors how a reader naturally moves
 * through a magazine while keeping concurrent grants low, so a scraper
 * cannot open 39 parallel connections.
 *
 * SECURITY NOTE ON CLIENT-SIDE DETERRENTS: the context-menu and keyboard
 * handlers below are FRICTION, NOT SECURITY. Anyone can bypass them from
 * DevTools. They exist because they stop casual attempts and cost nothing.
 * All real enforcement happens server-side. This is stated plainly rather
 * than dressed up as protection.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import {
  ContentApiError,
  chooseVariant,
  fetchPageImage,
  requestPageGrant,
  startSession,
  type ReaderPolicy,
} from '../../lib/contentApi';

interface ProtectedPageProps {
  slug: string;
  pageNumber: number;
  /** Called once the image is ready, so the parent can size the container. */
  onReady?: (pageNumber: number, aspectRatio: number) => void;
  /** Whether this page is close enough to the viewport to be loaded. */
  shouldLoad: boolean;
  labels: {
    loading: string;
    error: string;
    retry: string;
    suspended: string;
    locked: string;
  };
}

type PageState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; objectUrl: string }
  | { status: 'error'; message: string; code: string; canRetry: boolean };

export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  slug,
  pageNumber,
  onReady,
  shouldLoad,
  labels,
}) => {
  const [state, setState] = useState<PageState>({ status: 'idle' });
  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const loadedForRef = useRef<string | null>(null);

  /** Release the blob URL so the decoded image can be reclaimed. */
  const releaseUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    const key = `${slug}:${pageNumber}`;
    if (loadedForRef.current === key && state.status === 'ready') return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: 'loading' });

    try {
      const variant = chooseVariant(window.innerWidth);
      const grant = await requestPageGrant(slug, pageNumber, variant);
      if (controller.signal.aborted) return;

      const objectUrl = await fetchPageImage(grant.token, controller.signal);
      if (controller.signal.aborted) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      releaseUrl();
      objectUrlRef.current = objectUrl;
      loadedForRef.current = key;
      setState({ status: 'ready', objectUrl });
    } catch (err) {
      if (controller.signal.aborted) return;

      // Narrow explicitly: with `useUnknownInCatchVariables` the thrown value
      // is `unknown`, so we check the shape rather than trusting the type.
      const apiErr =
        err instanceof ContentApiError
          ? err
          : err instanceof Error && 'code' in err && 'status' in err
            ? (err as ContentApiError)
            : null;

      if (apiErr) {
        const canRetry = apiErr.code === 'rate_limited' || apiErr.code === 'expired_grant';
        const isSuspended = apiErr.code === 'suspended';
        const isLocked = apiErr.status === 401 || apiErr.status === 403;
        setState({
          status: 'error',
          message: isSuspended ? labels.suspended : isLocked ? labels.locked : labels.error,
          code: apiErr.code,
          canRetry: canRetry || isSuspended,
        });
      } else {
        setState({ status: 'error', message: labels.error, code: 'network_error', canRetry: true });
      }
    }
  }, [slug, pageNumber, state.status, releaseUrl, labels]);

  // Load when the page approaches the viewport.
  useEffect(() => {
    if (!shouldLoad) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad, slug, pageNumber]);

  // Clean up on unmount so we never leak blob URLs across page navigation.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      releaseUrl();
    };
  }, [releaseUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0 && onReady) {
      onReady(pageNumber, img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <div
      className="relative w-full bg-white shadow-lg rounded-sm overflow-hidden select-none"
      style={{ containIntrinsicSize: 'auto 1400px', contentVisibility: 'auto' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {state.status === 'ready' && (
        <img
          src={state.objectUrl}
          alt={`Page ${pageNumber}`}
          className="w-full h-auto block pointer-events-none"
          draggable={false}
          onLoad={handleImageLoad}
        />
      )}

      {state.status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-2 min-h-[420px]">
          <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
          <span className="text-xs font-medium text-gray-500">{labels.loading}</span>
        </div>
      )}

      {state.status === 'idle' && <div className="min-h-[420px] bg-slate-50" />}

      {state.status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50 gap-3 min-h-[420px] p-6 text-center">
          {state.code === 'suspended' || state.code === 'session_mismatch' ? (
            <Lock className="w-6 h-6 text-amber-700" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          )}
          <p className="text-xs font-medium text-amber-900 max-w-xs">{state.message}</p>
          {state.canRetry && (
            <button
              type="button"
              onClick={() => {
                loadedForRef.current = null;
                void load();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-deep-purple text-white text-xs font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{labels.retry}</span>
            </button>
          )}
        </div>
      )}

      {/* Page indicator, purely decorative */}
      <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded bg-black/40 text-white text-[10px] font-bold">
        {pageNumber}
      </div>
    </div>
  );
};

/**
 * Hook — establishes the reading session and exposes the server's policy.
 * Kept separate from rendering so the reader can show a clear error when
 * the content API is unreachable (rather than a blank viewport).
 */
export function useReaderSession(): {
  ready: boolean;
  policy: ReaderPolicy | null;
  error: string | null;
} {
  const [ready, setReady] = useState(false);
  const [policy, setPolicy] = useState<ReaderPolicy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    startSession()
      .then((p: ReaderPolicy) => {
        if (cancelled) return;
        setPolicy(p);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, policy, error };
}

/**
 * Observe which pages are near the viewport so only those are fetched.
 * A bounded lead of 1 page ahead keeps the reading experience smooth on a
 * slow connection without opening many concurrent grants.
 */
export function useVisiblePages(
  pageCount: number,
  containerRef: React.RefObject<HTMLDivElement | null>
): { visible: Set<number>; registerPage: (n: number) => (el: HTMLDivElement | null) => void } {
  const [visible, setVisible] = useState<Set<number>>(new Set([1]));
  const nodes = useRef<Map<number, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: load the first few pages eagerly.
      setVisible(new Set(Array.from({ length: Math.min(3, pageCount) }, (_, i) => i + 1)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const entry of entries) {
            const n = Number((entry.target as HTMLElement).dataset.page);
            if (!Number.isFinite(n)) continue;
            if (entry.isIntersecting) {
              // Preload exactly one page ahead, bounded by pageCount.
              for (const candidate of [n, n + 1]) {
                if (candidate >= 1 && candidate <= pageCount && !next.has(candidate)) {
                  next.add(candidate);
                  changed = true;
                }
              }
            }
          }
          return changed ? next : prev;
        });
      },
      { root: containerRef.current, rootMargin: '400px 0px', threshold: 0.01 }
    );

    observerRef.current = observer;
    for (const node of nodes.current.values()) observer.observe(node);
    return () => observer.disconnect();
  }, [pageCount, containerRef]);

  const registerPage = useCallback(
    (n: number) => (el: HTMLDivElement | null) => {
      const existing = nodes.current.get(n);
      if (existing && observerRef.current) observerRef.current.unobserve(existing);
      if (el) {
        el.dataset.page = String(n);
        nodes.current.set(n, el);
        observerRef.current?.observe(el);
      } else {
        nodes.current.delete(n);
      }
    },
    []
  );

  return useMemo(() => ({ visible, registerPage }), [visible, registerPage]);
}
