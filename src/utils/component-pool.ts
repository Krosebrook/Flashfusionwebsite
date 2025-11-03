/**
 * Component Pool System
 * Reuses React components to reduce memory allocation/deallocation
 */

import React, { ComponentType, ReactElement } from 'react';
import { memoryOptimizer } from './memory-optimizer';

interface PooledComponent {
  component: ReactElement;
  id: string;
  type: string;
  inUse: boolean;
  lastUsed: number;
  createdAt: number;
}

interface PoolConfig {
  maxPoolSize: number;
  maxIdleTime: number; // ms
  preWarmCount: number;
}

class ComponentPool {
  private pools = new Map<string, PooledComponent[]>();
  private config: PoolConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      maxPoolSize: 20,
      maxIdleTime: 5 * 60 * 1000, // 5 minutes
      preWarmCount: 5,
      ...config
    };
    
    this.startCleanupSchedule();
  }
  
  /**
   * Get a component from the pool or create new one
   */
  getComponent<P extends object>(
    ComponentType: ComponentType<P>,
    props: P,
    poolKey?: string
  ): ReactElement {
    const key = poolKey || ComponentType.name || 'unknown';
    const pool = this.pools.get(key) || [];
    
    // Find an available component in the pool
    const available = pool.find(item => !item.inUse);
    
    if (available) {
      available.inUse = true;
      available.lastUsed = Date.now();
      
      // Clone the component with new props
      return React.cloneElement(available.component, props as any);
    }
    
    // Create new component if pool is not full
    if (pool.length < this.config.maxPoolSize) {
      const newComponent = this.createPooledComponent(ComponentType, props, key);
      pool.push(newComponent);
      this.pools.set(key, pool);
      
      return React.cloneElement(newComponent.component, props as any);
    }
    
    // Pool is full, create component without pooling
    return React.createElement(ComponentType, props);
  }
  
  /**
   * Return a component to the pool
   */
  returnComponent(componentId: string, poolKey: string): void {
    const pool = this.pools.get(poolKey);
    if (!pool) return;
    
    const component = pool.find(item => item.id === componentId);
    if (component) {
      component.inUse = false;
      component.lastUsed = Date.now();
    }
  }
  
  /**
   * Pre-warm a pool with components
   */
  preWarm<P extends object>(
    ComponentType: ComponentType<P>,
    defaultProps: P,
    poolKey?: string,
    count?: number
  ): void {
    const key = poolKey || ComponentType.name || 'unknown';
    const pool = this.pools.get(key) || [];
    const targetCount = count || this.config.preWarmCount;
    
    // Check memory before pre-warming
    const memoryStats = memoryOptimizer.getMemoryStats();
    if (memoryStats && memoryStats.percentage > 70) {
      console.warn('High memory usage - skipping component pre-warming');
      return;
    }
    
    for (let i = pool.length; i < targetCount; i++) {
      const component = this.createPooledComponent(ComponentType, defaultProps, key);
      pool.push(component);
    }
    
    this.pools.set(key, pool);
  }
  
  /**
   * Clear a specific pool
   */
  clearPool(poolKey: string): void {
    const pool = this.pools.get(poolKey);
    if (pool) {
      // Only remove unused components
      const inUseComponents = pool.filter(item => item.inUse);
      this.pools.set(poolKey, inUseComponents);
    }
  }
  
  /**
   * Clear all pools
   */
  clearAllPools(): void {
    for (const [key, pool] of this.pools.entries()) {
      const inUseComponents = pool.filter(item => item.inUse);
      this.pools.set(key, inUseComponents);
    }
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    const stats = new Map<string, {
      total: number;
      inUse: number;
      available: number;
      avgIdleTime: number;
    }>();
    
    const now = Date.now();
    
    for (const [key, pool] of this.pools.entries()) {
      const inUse = pool.filter(item => item.inUse).length;
      const available = pool.length - inUse;
      const avgIdleTime = available > 0 
        ? pool
            .filter(item => !item.inUse)
            .reduce((sum, item) => sum + (now - item.lastUsed), 0) / available
        : 0;
      
      stats.set(key, {
        total: pool.length,
        inUse,
        available,
        avgIdleTime
      });
    }
    
    return stats;
  }
  
  /**
   * Force memory cleanup based on memory pressure
   */
  forceCleanup(): void {
    const memoryStats = memoryOptimizer.getMemoryStats();
    
    if (!memoryStats) return;
    
    if (memoryStats.percentage > 90) {
      // Critical - clear all pools
      this.clearAllPools();
    } else if (memoryStats.percentage > 75) {
      // High pressure - aggressive cleanup
      this.aggressiveCleanup();
    } else {
      // Normal cleanup
      this.cleanup();
    }
  }
  
  /**
   * Create a pooled component instance
   */
  private createPooledComponent<P extends object>(
    ComponentType: ComponentType<P>,
    props: P,
    poolKey: string
  ): PooledComponent {
    const id = `${poolKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    return {
      component: React.createElement(ComponentType, props),
      id,
      type: poolKey,
      inUse: true,
      lastUsed: now,
      createdAt: now
    };
  }
  
  /**
   * Standard cleanup - remove old unused components
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, pool] of this.pools.entries()) {
      const cleanedPool = pool.filter(item => {
        // Keep if in use or recently used
        return item.inUse || (now - item.lastUsed) < this.config.maxIdleTime;
      });
      
      this.pools.set(key, cleanedPool);
    }
  }
  
  /**
   * Aggressive cleanup for high memory pressure
   */
  private aggressiveCleanup(): void {
    const shortIdleTime = this.config.maxIdleTime * 0.3; // 30% of normal idle time
    const now = Date.now();
    
    for (const [key, pool] of this.pools.entries()) {
      const cleanedPool = pool.filter(item => {
        // Only keep components in use or very recently used
        return item.inUse || (now - item.lastUsed) < shortIdleTime;
      });
      
      // Also limit pool size more aggressively
      const maxSize = Math.max(2, Math.floor(this.config.maxPoolSize * 0.5));
      if (cleanedPool.length > maxSize) {
        // Sort by last used time and keep most recent
        cleanedPool.sort((a, b) => b.lastUsed - a.lastUsed);
        this.pools.set(key, cleanedPool.slice(0, maxSize));
      } else {
        this.pools.set(key, cleanedPool);
      }
    }
  }
  
  /**
   * Start periodic cleanup
   */
  private startCleanupSchedule(): void {
    this.cleanupInterval = setInterval(() => {
      const memoryStats = memoryOptimizer.getMemoryStats();
      
      if (memoryStats && memoryStats.percentage > 85) {
        this.aggressiveCleanup();
      } else {
        this.cleanup();
      }
    }, 60000); // Every minute
  }
  
  /**
   * Destroy the pool system
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.pools.clear();
  }
}

// Global component pool instance
export const componentPool = new ComponentPool({
  maxPoolSize: 15,
  maxIdleTime: 3 * 60 * 1000, // 3 minutes
  preWarmCount: 3
});

// High-level utility functions
export const pooledComponent = {
  /**
   * Get a component from the pool
   */
  get<P extends object>(
    ComponentType: ComponentType<P>,
    props: P,
    poolKey?: string
  ): ReactElement {
    return componentPool.getComponent(ComponentType, props, poolKey);
  },
  
  /**
   * Return component to pool
   */
  return(componentId: string, poolKey: string): void {
    componentPool.returnComponent(componentId, poolKey);
  },
  
  /**
   * Pre-warm components for better performance
   */
  preWarm<P extends object>(
    ComponentType: ComponentType<P>,
    defaultProps: P,
    poolKey?: string,
    count?: number
  ): void {
    componentPool.preWarm(ComponentType, defaultProps, poolKey, count);
  },
  
  /**
   * Get pool statistics
   */
  getStats() {
    return componentPool.getStats();
  },
  
  /**
   * Force cleanup
   */
  cleanup() {
    componentPool.forceCleanup();
  }
};

// React hook for using pooled components
export const usePooledComponent = <P extends object>(
  ComponentType: ComponentType<P>,
  props: P,
  poolKey?: string
) => {
  return React.useMemo(() => {
    return componentPool.getComponent(ComponentType, props, poolKey);
  }, [ComponentType, props, poolKey]);
};

export default ComponentPool;