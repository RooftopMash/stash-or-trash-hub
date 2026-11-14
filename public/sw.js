/**
 * Stash Or Trash (SOT) — Progressive Web App & TWA Service Worker
 * Version 4: Never intercepts Vite dev modules/chunks and purges legacy dev caches.
 */

const CACHE_NAME = 'sot-pwa-v4';
const OFFLINE_URL = '/';
const PRECACHE_ASSETS = [
  '/site.webmanifest',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-96x96.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png',
];

function isDevEnvironmentHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('ais-dev-')
  );
}

function isViteOrDynamicModuleRequest(url) {
  const path = url.pathname;
  return (
    path.startsWith('/api/') ||
    path.startsWith('/src/') ||
    path.startsWith('/node_modules/') ||
    path.startsWith('/@') ||
    path.startsWith('/__') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    /\.(tsx?|jsx?|mjs|map)$/i.test(path)
  );
}

// 1. Installation: Pre-cache static icon/manifest assets and take control immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// 2. Activation: Purge ALL older cache versions (including legacy sot-pwa-v2 dev caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// 3. Fetch Event: Never intercept Vite dev requests; network-first for navigation; cache immutable production assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (
    req.method !== 'GET' ||
    url.protocol.startsWith('ws') ||
    isDevEnvironmentHost(url.hostname) ||
    isViteOrDynamicModuleRequest(url)
  ) {
    return;
  }

  // Navigation requests: Network-first with offline shell fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return (
          caches.match(OFFLINE_URL) ||
          caches.match('/index.html') ||
          new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>SOT Offline</title></head><body><h1>SOT is offline</h1><p>Please check your connection and reload.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } },
          )
        );
      }),
    );
    return;
  }

  // Static immutable production assets only
  if (
    url.pathname.startsWith('/assets/') ||
    PRECACHE_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches
        .match(req)
        .then((cachedResponse) => {
          if (cachedResponse) {
            fetch(req)
              .then((freshResponse) => {
                if (freshResponse && freshResponse.status === 200) {
                  caches.open(CACHE_NAME).then((cache) => cache.put(req, freshResponse));
                }
              })
              .catch(() => {});
            return cachedResponse;
          }

          return fetch(req).then((networkResponse) => {
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== 'basic'
            ) {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
            return networkResponse;
          });
        })
        .catch(() => new Response('Offline resource unavailable', { status: 503, statusText: 'Offline' })),
    );
  }
});

// 4. Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sot-sync-votes' || event.tag === 'sot-sync-verdicts') {
    event.waitUntil(Promise.resolve().then(() => true));
  }
});

// 5. Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sot-update-barometer') {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.add('/feed'))
        .catch(() => {}),
    );
  }
});

// 6. Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'SOT — Stash Or Trash', body: 'New brand update received.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/favicon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 7. Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
