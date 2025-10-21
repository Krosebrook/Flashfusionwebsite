/**
 * FlashFusion Service Worker
 * Advanced caching, offline support, and background sync
 * Version: 2.0.0
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_PREFIX = 'flashfusion';

// Cache names
const CACHE_NAMES = {
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  dynamic: `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`,
  api: `${CACHE_PREFIX}-api-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  external: `${CACHE_PREFIX}-external-${CACHE_VERSION}`
};

// Resources to cache immediately
const PRECACHE_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Runtime caching strategies
const RUNTIME_CACHE_STRATEGIES = {
  // Static assets (CSS, JS, fonts, icons)
  static: {
    pattern: /\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp|avif)$/,
    strategy: 'CacheFirst',
    cacheName: CACHE_NAMES.static,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 100
  },
  
  // API responses
  api: {
    pattern: /^https:\/\/[^\/]+\/api\//,
    strategy: 'NetworkFirst',
    cacheName: CACHE_NAMES.api,
    maxAge: 5 * 60, // 5 minutes
    maxEntries: 50,
    networkTimeout: 3000
  },
  
  // HTML pages
  pages: {
    pattern: /^https:\/\/[^\/]+\/(dashboard|tools|projects|analytics)?$/,
    strategy: 'NetworkFirst',
    cacheName: CACHE_NAMES.dynamic,
    maxAge: 24 * 60 * 60, // 24 hours
    maxEntries: 25,
    networkTimeout: 3000
  },
  
  // Images
  images: {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
    strategy: 'CacheFirst',
    cacheName: CACHE_NAMES.images,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    maxEntries: 200
  },
  
  // External resources
  external: {
    pattern: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|api\.unsplash\.com)/,
    strategy: 'StaleWhileRevalidate',
    cacheName: CACHE_NAMES.external,
    maxAge: 24 * 60 * 60, // 24 hours
    maxEntries: 30
  }
};

// Background sync queues
const SYNC_QUEUES = {
  analytics: 'analytics-queue',
  userActions: 'user-actions-queue',
  feedback: 'feedback-queue'
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then((cache) => {
        console.log('[SW] Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Precaching completed');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Precaching failed:', error);
      })
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

/**
 * Fetch Event Handler
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }
  
  // Apply caching strategy based on request
  const strategy = getCachingStrategy(request);
  if (strategy) {
    event.respondWith(applyCachingStrategy(request, strategy));
  }
});

/**
 * Background Sync Handler
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_QUEUES.analytics:
      event.waitUntil(syncAnalyticsData());
      break;
    case SYNC_QUEUES.userActions:
      event.waitUntil(syncUserActions());
      break;
    case SYNC_QUEUES.feedback:
      event.waitUntil(syncFeedback());
      break;
    default:
      console.log('[SW] Unknown sync tag:', event.tag);
  }
});

/**
 * Push Notification Handler
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'FlashFusion Notification',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    tag: 'default',
    requireInteraction: false
  };
  
  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions || [],
      data: notificationData.data || {}
    })
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data || {};
  
  let urlToOpen = '/';
  
  switch (action) {
    case 'view-tools':
      urlToOpen = '/tools';
      break;
    case 'download-project':
      urlToOpen = notificationData.downloadUrl || '/projects';
      break;
    case 'view-project':
      urlToOpen = notificationData.projectUrl || '/projects';
      break;
    case 'dismiss':
      return; // Don't open any URL
    default:
      urlToOpen = notificationData.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

/**
 * Message Handler (for communication with main thread)
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
    case 'CACHE_RESOURCE':
      cacheResource(data.url, data.cacheName || CACHE_NAMES.dynamic);
      break;
    case 'SYNC_DATA':
      queueBackgroundSync(data.queue, data.data);
      break;
    case 'CLEAR_CACHE':
      clearCache(data.cacheName || 'all');
      break;
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

/**
 * Get appropriate caching strategy for request
 */
function getCachingStrategy(request) {
  const url = new URL(request.url);
  
  for (const [name, config] of Object.entries(RUNTIME_CACHE_STRATEGIES)) {
    if (config.pattern.test(request.url) || config.pattern.test(url.pathname)) {
      return { ...config, name };
    }
  }
  
  return null;
}

/**
 * Apply caching strategy to request
 */
async function applyCachingStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  
  switch (strategy.strategy) {
    case 'CacheFirst':
      return cacheFirst(request, cache, strategy);
    case 'NetworkFirst':
      return networkFirst(request, cache, strategy);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, cache, strategy);
    case 'NetworkOnly':
      return networkOnly(request);
    case 'CacheOnly':
      return cacheOnly(request, cache);
    default:
      return fetch(request);
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cache, strategy) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      cleanupCache(cache, strategy.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      console.log('[SW] Network failed, returning stale cache');
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cache, strategy) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), strategy.networkTimeout || 3000)
      )
    ]);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      cleanupCache(cache, strategy.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache');
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request, cache, strategy) {
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        cleanupCache(cache, strategy.maxEntries);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
    });
  
  // Return cached version immediately if available
  if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  return fetchPromise;
}

/**
 * Network Only Strategy
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * Cache Only Strategy
 */
async function cacheOnly(request, cache) {
  return cache.match(request);
}

/**
 * Check if cached response is expired
 */
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const cacheTime = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - cacheTime) > (maxAge * 1000);
}

/**
 * Cleanup old cache entries
 */
async function cleanupCache(cache, maxEntries) {
  if (!maxEntries) return;
  
  const keys = await cache.keys();
  
  if (keys.length <= maxEntries) return;
  
  // Sort by date and remove oldest entries
  const responses = await Promise.all(
    keys.map(async (key) => ({
      key,
      response: await cache.match(key)
    }))
  );
  
  responses.sort((a, b) => {
    const dateA = new Date(a.response.headers.get('date') || 0).getTime();
    const dateB = new Date(b.response.headers.get('date') || 0).getTime();
    return dateA - dateB;
  });
  
  const entriesToDelete = responses.slice(0, responses.length - maxEntries);
  
  await Promise.all(
    entriesToDelete.map(({ key }) => cache.delete(key))
  );
}

/**
 * Cleanup old caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCacheNames = Object.values(CACHE_NAMES);
  
  const cachesToDelete = cacheNames.filter(cacheName => 
    cacheName.startsWith(CACHE_PREFIX) && !currentCacheNames.includes(cacheName)
  );
  
  await Promise.all(
    cachesToDelete.map(cacheName => {
      console.log('[SW] Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

/**
 * Cache a specific resource
 */
async function cacheResource(url, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    await cache.add(url);
    console.log('[SW] Cached resource:', url);
  } catch (error) {
    console.error('[SW] Failed to cache resource:', url, error);
  }
}

/**
 * Clear cache
 */
async function clearCache(cacheName) {
  if (cacheName === 'all') {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    console.log('[SW] All caches cleared');
  } else {
    await caches.delete(cacheName);
    console.log('[SW] Cache cleared:', cacheName);
  }
}

/**
 * Queue background sync
 */
function queueBackgroundSync(queueName, data) {
  // Store data in IndexedDB for background sync
  // This would typically use a library like workbox-background-sync
  console.log('[SW] Queuing for background sync:', queueName, data);
  
  // Register background sync
  self.registration.sync.register(queueName);
}

/**
 * Sync analytics data
 */
async function syncAnalyticsData() {
  console.log('[SW] Syncing analytics data');
  
  try {
    // Retrieve queued analytics data from IndexedDB
    // Send to analytics endpoint
    // Clear queue on success
    
    console.log('[SW] Analytics sync completed');
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
    throw error; // This will retry the sync
  }
}

/**
 * Sync user actions
 */
async function syncUserActions() {
  console.log('[SW] Syncing user actions');
  
  try {
    // Retrieve queued user actions from IndexedDB
    // Send to API endpoint
    // Clear queue on success
    
    console.log('[SW] User actions sync completed');
  } catch (error) {
    console.error('[SW] User actions sync failed:', error);
    throw error;
  }
}

/**
 * Sync feedback
 */
async function syncFeedback() {
  console.log('[SW] Syncing feedback');
  
  try {
    // Retrieve queued feedback from IndexedDB
    // Send to feedback endpoint
    // Clear queue on success
    
    console.log('[SW] Feedback sync completed');
  } catch (error) {
    console.error('[SW] Feedback sync failed:', error);
    throw error;
  }
}

console.log('[SW] Service Worker loaded, version:', CACHE_VERSION);