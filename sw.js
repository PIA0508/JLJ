const CACHE_NAME = 'jinlingjie-v2';
const ASSETS = ['./', './index.html', './css/game.css', './js/config.js', './js/dice.js', './js/story.js', './js/ai-agent.js', './js/engine.js', './js/ui.js', './manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { if (e.request.url.includes('api.deepseek.com')) return; e.respondWith(caches.match(e.request).then(c => c || fetch(e.request))); });
