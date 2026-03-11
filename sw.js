// Service Worker - 金陵劫 PWA离线支持
const CACHE_NAME = 'jinlingjie-v1';
const ASSETS = [
  './',
  './index.html',
  './css/game.css',
  './js/config.js',
  './js/dice.js',
  './js/story.js',
  './js/ai-agent.js',
  './js/engine.js',
  './js/ui.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // API请求不缓存
  if (event.request.url.includes('api.deepseek.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
