/**
 * Cache utility for storing and retrieving user data
 * Uses localStorage with expiration for simple client-side caching
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_PREFIX = 'flashfusion_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  USER_PROFILE: {
    key: 'user_profile',
    ttl: DEFAULT_TTL,
  },
  USER_PREFERENCES: {
    key: 'user_preferences',
    ttl: DEFAULT_TTL,
  },
};

/**
 * Sets a value in cache with expiration
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 */
export function setCacheItem<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };
    
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
  } catch (error) {
    // Fail silently if localStorage is not available or quota exceeded
    console.warn('Failed to set cache item:', error);
  }
}

/**
 * Gets a value from cache if it exists and hasn't expired
 * @param key - Cache key
 * @returns Cached data or null if not found or expired
 */
export function getCacheItem<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(CACHE_PREFIX + key);
    
    if (!itemStr) {
      return null;
    }
    
    const cacheItem: CacheItem<T> = JSON.parse(itemStr);
    
    // Check if cache has expired
    if (Date.now() > cacheItem.expiresAt) {
      // Remove expired item
      removeCacheItem(key);
      return null;
    }
    
    return cacheItem.data;
  } catch (error) {
    // Fail silently if localStorage is not available or data is corrupted
    console.warn('Failed to get cache item:', error);
    return null;
  }
}

/**
 * Removes a specific item from cache
 * @param key - Cache key
 */
export function removeCacheItem(key: string): void {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to remove cache item:', error);
  }
}

/**
 * Clears all cache items with the FlashFusion prefix
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Checks if a cache item exists and is still valid
 * @param key - Cache key
 * @returns True if cache is valid, false otherwise
 */
export function isCacheValid(key: string): boolean {
  try {
    const itemStr = localStorage.getItem(CACHE_PREFIX + key);
    
    if (!itemStr) {
      return false;
    }
    
    const cacheItem: CacheItem<unknown> = JSON.parse(itemStr);
    return Date.now() <= cacheItem.expiresAt;
  } catch {
    return false;
  }
}

/**
 * Gets cache statistics for debugging
 */
export function getCacheStats(): {
  totalItems: number;
  validItems: number;
  expiredItems: number;
} {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    
    let validItems = 0;
    let expiredItems = 0;
    
    keys.forEach(key => {
      const plainKey = key.replace(CACHE_PREFIX, '');
      if (isCacheValid(plainKey)) {
        validItems++;
      } else {
        expiredItems++;
      }
    });
    
    return {
      totalItems: keys.length,
      validItems,
      expiredItems,
    };
  } catch {
    return {
      totalItems: 0,
      validItems: 0,
      expiredItems: 0,
    };
  }
}
