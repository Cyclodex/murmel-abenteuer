// Service Worker, damit Chrome (Android) das Spiel als App anbietet (src/install.js). Speichert absichtlich nichts:
// jede Anfrage geht ans Netz wie ohne Service Worker, damit Updates (src/update.js, ?v= aus .github/stempel.mjs) sofort ankommen.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request));
});
