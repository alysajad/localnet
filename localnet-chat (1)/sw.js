
// sw.js

const CACHE_NAME = 'localnet-chat-cache-v2';
// This list should include all the essential files for your app's shell.
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/icon.svg',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/hooks/useOnlineStatus.ts',
  '/components/Sidebar.tsx',
  '/components/ChatWindow.tsx',
  '/components/Message.tsx',
  '/components/MessageInput.tsx',
  '/components/AiImageModal.tsx',
  '/components/AdminScreen.tsx',
  '/components/icons.tsx',
  '/services/geminiService.ts'
];

// Install event: opens a cache and adds the core files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // addAll() is atomic - if one file fails, the whole operation fails.
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache files during install:', error);
        });
      })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serves cached content when offline.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For requests to external resources (like the esm.sh CDN), use a network-first strategy.
  if (event.request.url.startsWith('https://esm.sh')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If the network fails, we can't do much for these scripts, but you could potentially serve a fallback.
        console.error('Failed to fetch from CDN:', event.request.url);
      })
    );
    return;
  }

  // For app's own assets, use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cache
        if (response) {
          return response;
        }

        // Not in cache - fetch from the network, and then cache it for next time.
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || !['basic', 'cors'].includes(networkResponse.type)) {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetching failed:', error);
            // You could return a custom offline page here if you have one.
            throw error;
        });
      })
  );
});
