# FlashFusion Studio - PWA & Workbox Specification

## Overview

This document specifies the Progressive Web App (PWA) implementation for FlashFusion Studio, including offline capabilities, caching strategies, and background sync using Workbox.

**Goal:** Enable view-only offline access to projects while maintaining performance and respecting storage constraints.

**Last Updated:** January 2025  
**Owner:** FlashFusion Engineering Team

---

## 1. PWA Capabilities

### 1.1 Offline Scope

**What Works Offline:**
✅ View saved projects (metadata and waveforms)  
✅ Browse project library  
✅ View chord progressions  
✅ Read lyrics  
✅ Access user profile  
✅ Review analytics dashboard  

**What Requires Online:**
❌ Generate new songs (AI processing)  
❌ Audio playback (streaming)  
❌ Export/download files  
❌ Publish to platforms  
❌ Real-time collaboration  
❌ Marketplace browsing  

---

### 1.2 User Experience

**Offline Indicator:**
```typescript
// Show banner when offline
if (!navigator.onLine) {
  toast('You're offline. You can view projects but cannot edit or play audio.', {
    icon: '📡',
    duration: 5000,
  });
}

// Disable offline-incompatible features
<Button 
  disabled={!navigator.onLine}
  onClick={generateSong}
>
  {navigator.onLine ? 'Generate Song' : 'Offline - Cannot Generate'}
</Button>
```

---

## 2. Service Worker Architecture

### 2.1 Service Worker Registration

**Location:** `/public/sw.js`

```typescript
// /src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}
```

---

### 2.2 Workbox Configuration

**Installation:**
```bash
npm install workbox-webpack-plugin workbox-window workbox-precaching workbox-routing workbox-strategies workbox-expiration --save
```

**Webpack Plugin:**
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          // Strategies defined below
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        // Manifest defined in section 4
      },
    }),
  ],
});
```

---

## 3. Caching Strategies

### 3.1 Stale-While-Revalidate (UI Components)

**Use Case:** HTML, CSS, JS bundles

```javascript
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

registerRoute(
  ({ request }) => 
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'studio-ui-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);
```

**Behavior:**
1. Return cached version immediately (if available)
2. Fetch fresh version in background
3. Update cache with fresh version
4. Next request gets updated version

**Pros:** Fast initial load, always eventually consistent  
**Cons:** May show stale content briefly

---

### 3.2 Cache-First (Static Assets)

**Use Case:** Images, fonts, icons

```javascript
registerRoute(
  ({ request }) => 
    request.destination === 'image' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'studio-assets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        purgeOnQuotaError: true,
      }),
    ],
  })
);
```

**Behavior:**
1. Check cache first
2. If found, return immediately
3. If not found, fetch from network
4. Cache for future use

**Pros:** Fastest possible load for static assets  
**Cons:** Never updates unless cache is cleared

---

### 3.3 Network-First (API Calls)

**Use Case:** Project data, user profile, analytics

```javascript
import { NetworkFirst } from 'workbox-strategies';

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/studio/'),
  new NetworkFirst({
    cacheName: 'studio-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
    networkTimeoutSeconds: 10,
  })
);
```

**Behavior:**
1. Try network first
2. If network succeeds, return and update cache
3. If network fails or times out (10s), return cached version
4. If no cached version, fail

**Pros:** Always fresh data when online, fallback when offline  
**Cons:** Slower initial load (waits for network)

---

### 3.4 Network-Only (Non-Cacheable)

**Use Case:** Song generation, audio playback, publishing

```javascript
import { NetworkOnly } from 'workbox-strategies';

registerRoute(
  ({ url }) => 
    url.pathname.startsWith('/api/studio/generate-song') ||
    url.pathname.startsWith('/api/studio/export') ||
    url.pathname.startsWith('/api/studio/publish'),
  new NetworkOnly()
);

// Also for WebSocket connections
registerRoute(
  ({ url }) => url.protocol === 'wss:',
  new NetworkOnly()
);
```

**Behavior:**
1. Always fetch from network
2. Never cache
3. Fail if offline

**Pros:** No stale data for critical operations  
**Cons:** Completely unavailable offline

---

## 4. Cache Budgets & Eviction

### 4.1 Cache Size Limits

**Per-Origin Quota:**
- **Desktop:** ~60% of available disk space
- **Mobile:** ~20-50 MB typically
- **FlashFusion Studio Target:** Max 50 MB total

**Cache Budget Allocation:**
```typescript
const CACHE_BUDGETS = {
  'studio-ui-cache': {
    maxEntries: 60,
    maxSize: 20 * 1024 * 1024, // 20 MB
  },
  'studio-assets-cache': {
    maxEntries: 100,
    maxSize: 15 * 1024 * 1024, // 15 MB
  },
  'studio-api-cache': {
    maxEntries: 50,
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  'studio-audio-previews': {
    maxEntries: 10,
    maxSize: 5 * 1024 * 1024, // 5 MB (short previews only)
  },
};
```

---

### 4.2 Eviction Policy (LRU)

**Least Recently Used (LRU):**
```javascript
import { ExpirationPlugin } from 'workbox-expiration';

// Automatically evicts oldest entries when limits exceeded
new ExpirationPlugin({
  maxEntries: 50,                        // Max number of cached items
  maxAgeSeconds: 30 * 24 * 60 * 60,      // Max age: 30 days
  purgeOnQuotaError: true,               // Auto-cleanup on quota exceeded
})
```

**Manual Cache Cleanup:**
```typescript
// Clear old caches on app startup
const clearOldCaches = async () => {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('studio-') && 
    !name.includes(VERSION)  // Current version
  );
  
  await Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
  
  console.log('Cleared old caches:', oldCaches);
};

// Run on SW activation
self.addEventListener('activate', event => {
  event.waitUntil(clearOldCaches());
});
```

---

### 4.3 Storage Quota API

**Check Available Storage:**
```typescript
const checkStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = ((usage / quota) * 100).toFixed(2);
    
    console.log(`Storage: ${usage} / ${quota} bytes (${percentUsed}%)`);
    
    // Warn user if > 80% full
    if (usage / quota > 0.8) {
      toast('Storage is running low. Some offline features may not work.', {
        type: 'warning',
      });
    }
    
    return { usage, quota, percentUsed };
  }
};

// Check on app load
checkStorageQuota();
```

---

## 5. Background Sync

### 5.1 Queuing Failed Requests

**Use Case:** Queue song generation requests when offline

```javascript
import { BackgroundSyncPlugin } from 'workbox-background-sync';

const bgSyncPlugin = new BackgroundSyncPlugin('studio-generation-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours (minutes)
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
        console.log('Queued request successful:', entry.request.url);
      } catch (error) {
        console.error('Queued request failed:', error);
        await queue.unshiftRequest(entry);
        throw error; // Retry later
      }
    }
  },
});

registerRoute(
  '/api/studio/generate-song',
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
```

**User Feedback:**
```typescript
// Show pending requests count
const getPendingRequests = async () => {
  const registration = await navigator.serviceWorker.ready;
  const sync = await registration.sync.getTags();
  return sync.length;
};

// Notify when request completes
navigator.serviceWorker.addEventListener('message', event => {
  if (event.data.type === 'BACKGROUND_SYNC_SUCCESS') {
    toast('Your song generation completed!', { type: 'success' });
  }
});
```

---

### 5.2 Periodic Background Sync

**Use Case:** Sync project updates periodically

```javascript
// Register periodic sync (requires permission)
const registerPeriodicSync = async () => {
  const registration = await navigator.serviceWorker.ready;
  
  try {
    await registration.periodicSync.register('sync-projects', {
      minInterval: 24 * 60 * 60 * 1000, // Once per day
    });
    console.log('Periodic sync registered');
  } catch (error) {
    console.error('Periodic sync not available:', error);
  }
};

// Handle periodic sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'sync-projects') {
    event.waitUntil(syncProjects());
  }
});

const syncProjects = async () => {
  const projects = await fetchProjectsFromAPI();
  await updateLocalCache(projects);
};
```

**Note:** Periodic Background Sync is experimental and may not be available in all browsers.

---

## 6. Push Notifications

### 6.1 Notification Types

**FlashFusion Studio Notifications:**
1. **Song generation complete** (if queued via background sync)
2. **Collaboration invite** (someone invites you to project)
3. **Publishing complete** (track published to platforms)
4. **Marketplace sale** (someone bought your asset)

---

### 6.2 Permission Request

```typescript
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Request permission after user interaction
<Button onClick={async () => {
  const granted = await requestNotificationPermission();
  if (granted) {
    toast('Notifications enabled!');
  }
}}>
  Enable Notifications
</Button>
```

---

### 6.3 Push Event Handler

```javascript
// Service Worker: /public/sw.js
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/app/studio',
      projectId: data.projectId,
    },
    actions: [
      {
        action: 'open',
        title: 'Open Studio',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'FlashFusion Studio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url;
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
```

---

## 7. App Manifest

### 7.1 manifest.json

**Location:** `/public/manifest.json`

```json
{
  "name": "FlashFusion Studio - AI Music Production",
  "short_name": "FF Studio",
  "description": "Transform musical ideas into professional productions with AI-powered tools",
  "start_url": "/app/studio",
  "scope": "/app/studio/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#FF7B00",
  "background_color": "#0F172A",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/studio-dashboard.png",
      "sizes": "1280x720",
      "type": "image/png",
      "label": "Studio Dashboard"
    },
    {
      "src": "/screenshots/song-generator.png",
      "sizes": "1280x720",
      "type": "image/png",
      "label": "AI Song Generator"
    }
  ],
  "categories": ["music", "productivity", "entertainment"],
  "shortcuts": [
    {
      "name": "New Song",
      "short_name": "New",
      "description": "Generate a new song",
      "url": "/app/studio/prompt-to-song",
      "icons": [{ "src": "/icons/shortcut-new.png", "sizes": "192x192" }]
    },
    {
      "name": "My Projects",
      "short_name": "Projects",
      "description": "View your projects",
      "url": "/app/studio/projects",
      "icons": [{ "src": "/icons/shortcut-projects.png", "sizes": "192x192" }]
    }
  ],
  "share_target": {
    "action": "/app/studio/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "audio",
          "accept": ["audio/*"]
        }
      ]
    }
  }
}
```

---

### 7.2 A2HS (Add to Home Screen)

**Install Prompt:**
```typescript
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default mini-infobar
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  setShowInstallButton(true);
});

const handleInstallClick = async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User ${outcome} the A2HS prompt`);
  deferredPrompt = null;
  setShowInstallButton(false);
};

// UI Component
{showInstallButton && (
  <Button onClick={handleInstallClick} className="ff-btn-primary">
    <Download className="h-4 w-4" />
    Install Studio App
  </Button>
)}
```

---

## 8. Performance Optimizations

### 8.1 Precaching Critical Resources

```javascript
import { precacheAndRoute } from 'workbox-precaching';

// Automatically precache build artifacts
precacheAndRoute(self.__WB_MANIFEST);

// Additional critical resources
precacheAndRoute([
  { url: '/app/studio', revision: '1' },
  { url: '/icons/icon-192x192.png', revision: '1' },
  { url: '/fonts/sora-v12-latin-regular.woff2', revision: '1' },
]);
```

---

### 8.2 Navigation Preload

```javascript
// Enable navigation preload for faster page loads
self.addEventListener('activate', event => {
  event.waitUntil(
    self.registration.navigationPreload?.enable()
  );
});

// Use preloaded response
import { NetworkFirst } from 'workbox-strategies';

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'studio-pages',
    plugins: [
      {
        requestWillFetch: async ({ request }) => {
          const preloadResponse = await event.preloadResponse;
          return preloadResponse || request;
        },
      },
    ],
  })
);
```

---

## 9. Testing & Validation

### 9.1 Offline Testing

**Manual Testing:**
1. Open DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Reload page and verify offline functionality
4. Attempt online-only actions (should show error)

**Automated Testing:**
```typescript
// Cypress test
describe('Offline Mode', () => {
  it('should show offline indicator', () => {
    cy.visit('/app/studio');
    cy.window().then(win => {
      win.dispatchEvent(new Event('offline'));
    });
    cy.contains('You're offline').should('be.visible');
  });
  
  it('should disable generation button when offline', () => {
    cy.window().then(win => {
      win.dispatchEvent(new Event('offline'));
    });
    cy.get('[data-testid="generate-song-btn"]').should('be.disabled');
  });
});
```

---

### 9.2 PWA Audit (Lighthouse)

**Target Scores:**
- PWA Score: 100/100
- Performance: 90+/100
- Accessibility: 95+/100
- Best Practices: 95+/100
- SEO: 100/100

**Key PWA Requirements:**
- ✅ Served over HTTPS
- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Contains a web app manifest
- ✅ Has a viewport meta tag
- ✅ Has an app icon
- ✅ Provides custom offline page

---

## 10. Browser Compatibility

### 10.1 Service Worker Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 40+ | ✅ Full | Reference implementation |
| Firefox 44+ | ✅ Full | Full support |
| Safari 11.1+ | ✅ Full | iOS support since 11.3 |
| Edge 17+ | ✅ Full | Chromium-based |
| Opera 27+ | ✅ Full | Chromium-based |
| IE 11 | ❌ None | Fallback to online-only |

---

### 10.2 Fallback Strategy

```typescript
// Check for service worker support
if ('serviceWorker' in navigator) {
  // Progressive enhancement with SW
  registerServiceWorker();
} else {
  // Fallback: Traditional web app (online-only)
  console.warn('Service Workers not supported. Offline mode unavailable.');
  toast('Your browser does not support offline mode', {
    type: 'info',
  });
}
```

---

## 11. Monitoring & Analytics

### 11.1 Service Worker Metrics

**Track:**
- SW registration success/failure rate
- Cache hit/miss rate
- Offline usage statistics
- Background sync queue length
- Storage quota usage

```typescript
// Report to analytics
const reportSWMetrics = async () => {
  const caches = await window.caches.keys();
  const cacheStats = await Promise.all(
    caches.map(async name => {
      const cache = await window.caches.open(name);
      const keys = await cache.keys();
      return { name, entries: keys.length };
    })
  );
  
  analytics.track('studio_sw_metrics', {
    caches: cacheStats,
    online: navigator.onLine,
    storage: await checkStorageQuota(),
  });
};
```

---

## 12. Deployment Checklist

Before enabling PWA features in production:

- [ ] Service worker file (`/public/sw.js`) deployed
- [ ] Manifest file (`/public/manifest.json`) deployed
- [ ] All icon sizes generated and deployed
- [ ] HTTPS enabled (required for SW)
- [ ] Cache versioning strategy implemented
- [ ] Offline page created
- [ ] Background sync configured
- [ ] Push notification server set up
- [ ] Storage quota monitoring enabled
- [ ] Lighthouse PWA audit passed (100/100)
- [ ] Tested on iOS Safari, Chrome Android, Desktop Chrome
- [ ] Fallback for unsupported browsers tested

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Next Review:** Quarterly or when Workbox updates  
**Owner:** FlashFusion Frontend Team
