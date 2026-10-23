/**
 * Stash Or Trash (SOT) — Progressive Web App & TWA Service Worker
 * Provides offline navigation resilience, shell precaching, and network fallback
 */

const CACHE_NAME = 'sot-pwa-v1';
const PRECACHE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and WebSocket / API calls
  if (req.method !== 'GET' || url.protocol.startsWith('ws') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Network first for dynamic navigation, falling back to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  // Cache first for static assets, falling back to network
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    })
  );
});
