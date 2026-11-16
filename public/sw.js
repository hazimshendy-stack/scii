/**
 * FODOL — Service worker.
 *
 * CRITICAL SECURITY CHANGE FROM THE PREVIOUS REVISION:
 *
 * The previous worker used a blanket cache-first strategy:
 *     const response = await fetch(request);
 *     if (response.ok && response.type === 'basic') await cache.put(request, response);
 *
 * That silently wrote every same-origin response — including the 43 MB
 * original PDF and any protected page image — into persistent Cache
 * Storage. Those bytes survived logout, were readable from DevTools, and
 * were not removed by clearing "cached images and files" in some browsers.
 * It was an unintended, persistent, on-disk copy of the protected asset.
 *
 * The rules now are:
 *   1. /api/** is NEVER cached. Protected content is fetched from network
 *      only, and the server sends `Cache-Control: private, no-store`.
 *   2. Only an explicit allow-list of static, public, non-sensitive assets
 *      is cached, and only by exact-match path patterns.
 *   3. Navigations are network-first, falling back to the offline page.
 *   4. Anything else passes straight through, untouched.
 */

const CACHE_NAME = 'sci-infinity-v8';
const scopedUrl = (asset) => new URL(asset, self.registration.scope).toString();

/** Offline shell only. No content, no protected material. */
const PRECACHE_ASSETS = ['offline.html', 'manifest.json'];

/**
 * Static asset allow-list. Deliberately narrow: a request is cached only if
 * it matches one of these. Anything not listed is never written to disk.
 * Notably absent: *.pdf, /api/**, and the magazine image directory.
 */
const CACHEABLE_PATTERNS = [
  /\/assets\/[A-Za-z0-9._-]+\.(js|css|woff2?|ttf)$/,
  /\/images\/[A-Za-z0-9._-]+\.webp$/,
  /\/activity-photos\/[A-Za-z0-9._-]+\.webp$/,
  /\/partners\/[^/]+\.webp$/,
  /\/podcast-thumbnails\/[A-Za-z0-9._-]+\.webp$/,
  /\/forum_posters_images\/[A-Za-z0-9._-]+\.webp$/,
];

function isCacheable(url) {
  // Hard deny: the API surface, which serves all protected content.
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) return false;
  // Hard deny: never cache a PDF under any circumstances.
  if (/\.pdf$/i.test(url.pathname)) return false;
  return CACHEABLE_PATTERNS.some((re) => re.test(url.pathname));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS.map(scopedUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => n.startsWith('sci-infinity-') && n !== CACHE_NAME)
            .map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GETs. Everything else is untouched.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Protected content and any PDF: go straight to the network, never cache,
  // never serve a stored copy.
  if (url.pathname.includes('/api/') || /\.pdf$/i.test(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // Navigations: network-first with an offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (
          (await cache.match(scopedUrl('offline.html'))) ||
          (await cache.match(scopedUrl('index.html'))) ||
          new Response('Offline', { status: 503, statusText: 'Offline' })
        );
      })
    );
    return;
  }

  // Everything else: only the explicitly allow-listed static assets are
  // cached. Unknown paths pass through to the network uncached.
  if (!isCacheable(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
      }
      return response;
    })
  );
});
