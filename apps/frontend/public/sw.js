/* sw.js - Sports Central PWA Service Worker */
const CACHE_NAME = 'sports-central-v2.1';
const DYNAMIC_CACHE = 'sports-central-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/offline-sports.html',
  '/offline-quiz.html',
  '/game/sports.js',
  '/game/sports.css',
  '/quiz/quiz.js',
  '/quiz/quiz.css',
  '/quiz/questions.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

/* INSTALL */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ACTIVATE */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(n => {
          if (n !== CACHE_NAME && n !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', n);
            return caches.delete(n);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* FETCH */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && response.type === 'basic') {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (err) {
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
      return new Response('Service unavailable', { status: 503 });
    }
  })());
});

/* PUSH NOTIFICATIONS */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const title = data.title || 'Sports Central';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: data.actions || [{ action: 'open', title: 'Open App' }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

/* NOTIFICATION CLICK */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

/* UPDATE HANDLER */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});