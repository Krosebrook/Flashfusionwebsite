/**
 * Memory-Aware Cache System
 * Automatically manages cache size based on available memory
 */

import { memoryOptimizer } from './memory-optimizer';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size: number; // Estimated size in bytes
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
}

class MemoryAwareCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;
  private hits = 0;
  private misses = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(maxSizeMB: number = 10, defaultTTLMs: number = 5 * 60 * 1000) {
    this.maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    this.defaultTTL = defaultTTLMs;
    this.startCleanupSchedule();
  }
  
  /**
   * Set cache entry with automatic size estimation
   */
  set(key: string, data: T, ttl?: number): void {
    const memoryStats = memoryOptimizer.getMemoryStats();
    
    // Don't cache anything if memory is critical
    if (memoryStats && memoryStats.percentage > 90) {
      console.warn('Memory critical - skipping cache set for:', key);
      return;
    }
    
    const size = this.estimateSize(data);
    const now = Date.now();
    
    // Check if adding this entry would exceed memory limits
    if (this.shouldEvictForMemory(size)) {
      this.evictLRU();
    }
    
    // Update existing entry or create new one
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      size,
      accessCount: 1,
      lastAccessed: now
    };
    
    this.cache.set(key, entry);
    
    // Aggressive cleanup if memory is high
    if (memoryStats && memoryStats.percentage > 75) {
      this.aggressiveCleanup();
    }
  }
  
  /**
   * Get cache entry with LRU tracking
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    // Check if expired
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    // Update access tracking
    entry.accessCount++;
    entry.lastAccessed = now;
    this.hits++;
    
    return entry.data;
  }
  
  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalSize = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
    const hitRate = this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0;
    
    const memoryStats = memoryOptimizer.getMemoryStats();
    let memoryPressure: CacheStats['memoryPressure'] = 'low';
    
    if (memoryStats) {
      if (memoryStats.percentage > 90) memoryPressure = 'critical';
      else if (memoryStats.percentage > 75) memoryPressure = 'high';
      else if (memoryStats.percentage > 60) memoryPressure = 'medium';
    }
    
    return {
      totalSize,
      entryCount: this.cache.size,
      hitRate,
      memoryPressure
    };
  }
  
  /**
   * Force memory cleanup based on current memory pressure
   */
  forceCleanup(): void {
    const memoryStats = memoryOptimizer.getMemoryStats();
    
    if (!memoryStats) return;
    
    if (memoryStats.percentage > 95) {
      // Critical - clear all cache
      this.clear();
    } else if (memoryStats.percentage > 85) {
      // High pressure - aggressive cleanup
      this.aggressiveCleanup();
    } else if (memoryStats.percentage > 75) {
      // Medium pressure - standard cleanup
      this.cleanup();
    }
  }
  
  /**
   * Estimate size of data in bytes
   */
  private estimateSize(data: T): number {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      // Fallback estimation
      return 1024; // 1KB default
    }
  }
  
  /**
   * Check if we should evict entries for memory
   */
  private shouldEvictForMemory(newEntrySize: number): boolean {
    const currentSize = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
    const memoryStats = memoryOptimizer.getMemoryStats();
    
    // If adding this entry would exceed max size
    if (currentSize + newEntrySize > this.maxSize) return true;
    
    // If memory pressure is high
    if (memoryStats && memoryStats.percentage > 75) return true;
    
    return false;
  }
  
  /**
   * Evict least recently used entries
   */
  private evictLRU(): void {
    if (this.cache.size === 0) return;
    
    // Sort by last accessed time (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed
    );
    
    // Remove oldest 25% of entries
    const toRemove = Math.max(1, Math.floor(entries.length * 0.25));
    
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
  
  /**
   * Standard cleanup - remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Aggressive cleanup for high memory pressure
   */
  private aggressiveCleanup(): void {
    const now = Date.now();
    const shortTTL = this.defaultTTL * 0.5; // 50% of normal TTL
    
    // Remove entries that are half-expired
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > shortTTL || entry.accessCount < 2) {
        this.cache.delete(key);
      }
    }
    
    // If still too many entries, remove LRU
    if (this.cache.size > 50) {
      this.evictLRU();
    }
  }
  
  /**
   * Start periodic cleanup
   */
  private startCleanupSchedule(): void {
    this.cleanupInterval = setInterval(() => {
      const stats = this.getStats();
      
      if (stats.memoryPressure === 'critical') {
        this.clear();
      } else if (stats.memoryPressure === 'high') {
        this.aggressiveCleanup();
      } else {
        this.cleanup();
      }
    }, 30000); // Every 30 seconds
  }
  
  /**
   * Stop cleanup schedule
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Global cache instance
export const globalCache = new MemoryAwareCache(5); // 5MB max

// Specialized caches for different data types
export const componentCache = new MemoryAwareCache(2); // 2MB for components
export const dataCache = new MemoryAwareCache(3); // 3MB for API data
export const imageCache = new MemoryAwareCache(10); // 10MB for images

// Cache management utilities
export const cacheManager = {
  /**
   * Get all cache statistics
   */
  getAllStats() {
    return {
      global: globalCache.getStats(),
      component: componentCache.getStats(),
      data: dataCache.getStats(),
      image: imageCache.getStats(),
    };
  },
  
  /**
   * Force cleanup on all caches
   */
  forceCleanupAll() {
    globalCache.forceCleanup();
    componentCache.forceCleanup();
    dataCache.forceCleanup();
    imageCache.forceCleanup();
  },
  
  /**
   * Clear all caches
   */
  clearAll() {
    globalCache.clear();
    componentCache.clear();
    dataCache.clear();
    imageCache.clear();
  },
  
  /**
   * Destroy all caches
   */
  destroyAll() {
    globalCache.destroy();
    componentCache.destroy();
    dataCache.destroy();
    imageCache.destroy();
  }
};

export default MemoryAwareCache;