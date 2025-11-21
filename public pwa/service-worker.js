const CACHE_NAME = 'littera-static-v1';
const PRECACHE_URLS = [
  '.',
  '192.jpeg',
  '512.jpeg',
  'buscar.html',
  'carrinho.png',
  'favorito.png',
  'index.html',
  'instagram.png',
  'logo lt.png',
  'logo.png',
  'offline.html',
  'twitter.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(resp => {
      if (resp) return resp;
      return fetch(event.request).then(fetchResp => {
        // optionally cache dynamic content
        return fetchResp;
      }).catch(() => {
        // fallback to offline page if request is for a navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});