/**
 * Service Worker for Alex Rodriguez Videographer PWA
 * Provides offline functionality, caching, and performance optimization
 */

const CACHE_NAME = 'alex-rodriguez-videographer-v1.2.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/about.html', 
  '/contact.html',
  '/offline.html',
  '/css/critical.css',
  '/css/bootstrap.min.css',
  '/css/templatemo-video-catalog.css',
  '/css/lazy-loading.css',
  '/js/jquery-3.4.1.min.js',
  '/js/bootstrap.min.js',
  '/js/gallery.js',
  '/js/lazy-loading.js',
  '/js/i18n.js',
  '/js/dark-mode.js',
  '/lang/en.json',
  '/lang/es.json',
  '/fontawesome/css/all.min.css',
  '/manifest.json'
];

// Assets to cache on demand
const CACHE_ON_DEMAND = [
  '/css/modern-gallery.css',
  '/css/clean-layout.css', 
  '/css/dark-mode.css',
  '/js/analytics.js',
  '/js/background-images.js',
  '/js/css-loader.js'
];

// Image assets (cached with different strategy)
const IMAGE_CACHE = 'images-v1.0.0';

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache critical assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isCriticalAsset(request.url)) {
    event.respondWith(handleCriticalAsset(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Image request failed:', error);
    // Return placeholder image
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Navigation request failed, serving from cache:', error);
    
    // Try to serve from cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page
    return cache.match(OFFLINE_URL);
  }
}

// Handle critical assets with cache-first strategy
async function handleCriticalAsset(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache and update in background
      fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse);
        }
      }).catch(() => {
        // Ignore network errors for background updates
      });
      
      return cachedResponse;
    }

    // Not in cache, fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok && networkResponse.status < 300) {
      // Only cache complete responses (not partial 206 responses)
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Critical asset request failed:', error);
    throw error;
  }
}

// Handle generic requests with network-first strategy
async function handleGenericRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try to serve from cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Helper functions
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isCriticalAsset(url) {
  return CRITICAL_ASSETS.some(asset => url.includes(asset));
}

// Background sync for analytics (when online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync any pending analytics data when back online
  try {
    const analyticsData = await getStoredAnalytics();
    if (analyticsData.length > 0) {
      await sendAnalyticsData(analyticsData);
      await clearStoredAnalytics();
    }
  } catch (error) {
    console.log('Analytics sync failed:', error);
  }
}

// Push notification handling (optional)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Portfolio',
        icon: '/img/icons/action-view.png'
      },
      {
        action: 'contact',
        title: 'Get in Touch',
        icon: '/img/icons/action-contact.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  let url = '/';

  if (action === 'view') {
    url = '/';
  } else if (action === 'contact') {
    url = '/contact.html';
  } else if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }

  event.waitUntil(
    clients.openWindow(url)
  );
});

// Helper functions for analytics sync
async function getStoredAnalytics() {
  // Implementation would depend on your analytics storage strategy
  return [];
}

async function sendAnalyticsData(data) {
  // Implementation would send data to analytics service
  return Promise.resolve();
}

async function clearStoredAnalytics() {
  // Implementation would clear stored analytics data
  return Promise.resolve();
}
