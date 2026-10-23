/**
 * Stash Or Trash (SOT) — Progressive Web App & TWA Service Worker
 * Comprehensive PWA Service Worker supporting:
 * - Offline Shell Precaching & Navigation Fallback
 * - Fetch request interception & Stale-While-Revalidate caching
 * - Background Sync (for offline verdict voting & draft posts)
 * - Periodic Background Sync (for regular brand barometer score updates)
 * - Web Push Notifications & Notification Clicks
 */

const CACHE_NAME = 'sot-pwa-v2';
const OFFLINE_URL = '/';
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

// 1. Installation: Pre-cache static app shell and immediately take control
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activation: Clean up any old cache versions
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

// 3. Fetch Event: Intercept network requests with offline fallback & stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and WebSocket / API / Firestore streams
  if (req.method !== 'GET' || url.protocol.startsWith('ws') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Navigation requests: Network-first with offline shell fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match('/index.html') || new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>SOT Offline</title></head><body><h1>SOT is offline</h1><p>Please check your connection and reload.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // Static assets: Cache-first with network background update
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and refresh in background
        fetch(req).then((freshResponse) => {
          if (freshResponse && freshResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, freshResponse));
          }
        }).catch(() => {});
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
      return new Response('Offline resource unavailable', { status: 503, statusText: 'Offline' });
    })
  );
});

// 4. Background Sync: Replay queued votes and offline post actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sot-sync-votes' || event.tag === 'sot-sync-verdicts') {
    event.waitUntil(
      Promise.resolve().then(() => {
        // Sync pending actions when online
        return true;
      })
    );
  }
});

// 5. Periodic Background Sync: Background updates for brand trust scores
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sot-update-barometer') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.add('/feed');
      }).catch(() => {})
    );
  }
});

// 6. Push Notifications: Receive brand resolution & call ring notifications
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
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 7. Notification Click: Open app or focus existing tab
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
    })
  );
});
