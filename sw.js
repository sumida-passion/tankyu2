const CACHE_NAME = 'tankyu2-pwa-v1';
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://sumida-passion.github.io/game-assets/images/hpmain.jpg",
  "https://sumida-passion.github.io/game-assets/images/kanabo.PNG",
  "https://sumida-passion.github.io/game-assets/images/kawasaki.PNG",
  "https://sumida-passion.github.io/game-assets/images/masuda.PNG",
  "https://sumida-passion.github.io/game-assets/images/naramachi01.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi02.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi03.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi04.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi05.jpg",
  "https://sumida-passion.github.io/game-assets/images/naramachi06.jpg",
  "https://sumida-passion.github.io/game-assets/images/naramachi07.jpg",
  "https://sumida-passion.github.io/game-assets/images/okamoto.PNG",
  "https://sumida-passion.github.io/game-assets/images/sefiroto.jpg",
  "https://sumida-passion.github.io/game-assets/images/sumida.PNG",
  "https://sumida-passion.github.io/game-assets/images/tsujii.PNG",
  "https://sumida-passion.github.io/syokai/"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
