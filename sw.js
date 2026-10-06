/* LingoPop service worker
   - App shell is precached on install (works offline right after the first visit).
   - Same-origin files: network-first (always fresh when online, 4s timeout, falls back to cache).
   - Google Fonts + external images: stale-while-revalidate into a capped runtime cache.
   To force every device to drop old files: bump VERSION. */
const VERSION = 'lingopop-shell-v1';
const RUNTIME = 'lingopop-runtime-v1';
const RUNTIME_MAX = 80;
const CRITICAL = ['./', 'index.html', 'app.css', 'app.js', 'manifest.webmanifest'];
const OPTIONAL = ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(CRITICAL);
    await Promise.all(OPTIONAL.map((u) => cache.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION && k !== RUNTIME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isRuntimeHost(url) {
  return url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         url.hostname.endsWith('.googleusercontent.com');
}

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length > RUNTIME_MAX) await Promise.all(keys.slice(0, keys.length - RUNTIME_MAX).map((k) => cache.delete(k)));
}

function staleWhileRevalidate(req) {
  return caches.open(RUNTIME).then(async (cache) => {
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()).then(() => trim(cache)); }
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  });
}

function networkFirst(req) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (r) => { if (!done && r) { done = true; resolve(r); } };
    const fromCache = () => caches.match(req, { ignoreSearch: true })
      .then((r) => r || (req.mode === 'navigate' ? caches.match('index.html') : null));
    const timer = setTimeout(() => fromCache().then(finish), 4000);
    fetch(req).then((res) => {
      clearTimeout(timer);
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
      }
      finish(res);
    }).catch(() => {
      clearTimeout(timer);
      fromCache().then((r) => finish(r || Response.error()));
    });
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
  } else if (isRuntimeHost(url)) {
    event.respondWith(staleWhileRevalidate(req));
  }
});
