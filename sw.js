/* LingoPop service worker
   - App shell is precached on install (works offline right after the first visit).
   - Same-origin files: network-first (always fresh when online, 4s timeout, falls back to cache).
   - Fonts and images are self-hosted (fonts/), so everything is available offline after the first visit.
   To force every device to drop old files: bump VERSION. */
const VERSION = 'lingopop-shell-v3';
const CRITICAL = ['./', 'index.html', 'game.html', 'app.css', 'app.js', 'install.js', 'manifest.webmanifest',
  'fonts/rubik-hebrew.woff2', 'fonts/rubik-latin.woff2', 'fonts/material-symbols-subset.woff2'];
const OPTIONAL = ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

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
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function networkFirst(req) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (r) => { if (!done && r) { done = true; resolve(r); } };
    const fromCache = () => caches.match(req, { ignoreSearch: true })
      .then((r) => r || (req.mode === 'navigate' ? caches.match(new URL(req.url).pathname.endsWith('game.html') ? 'game.html' : 'index.html') : null));
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
  }
});
