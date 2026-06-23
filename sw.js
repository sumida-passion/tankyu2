const CACHE_NAME = "tankyu2-complete-offline-v2-20260623-nozoom";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://sumida-passion.github.io/game-assets/images/sefiroto.jpg",
  "https://sumida-passion.github.io/game-assets/images/naramachi03.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi01.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi06.jpg",
  "https://sumida-passion.github.io/game-assets/images/naramachi02.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi05.jpg",
  "https://sumida-passion.github.io/game-assets/images/naramachi04.png",
  "https://sumida-passion.github.io/game-assets/images/naramachi07.jpg",
  "https://sumida-passion.github.io/game-assets/images/tsujii.PNG",
  "https://sumida-passion.github.io/game-assets/images/okamoto.PNG",
  "https://sumida-passion.github.io/game-assets/images/kawasaki.PNG",
  "https://sumida-passion.github.io/game-assets/images/masuda.PNG",
  "https://sumida-passion.github.io/game-assets/images/kanabo.PNG",
  "https://sumida-passion.github.io/game-assets/images/sumida.PNG",
  "https://sumida-passion.github.io/game-assets/images/hpmain.jpg"
];


self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        CORE_ASSETS.map(url => cache.add(new Request(url, {cache: 'reload'})))
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // HTML本体は、オンライン時は更新を取りに行き、失敗時はキャッシュを使う
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy)).catch(() => {});
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        const copy = response.clone();
        if (response && (response.ok || response.type === 'opaque')) {
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return response;
      }).catch(() => new Response('', {status: 504, statusText: 'Offline asset not cached yet'}));
    })
  );
});
