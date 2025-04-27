
/**
 * Client-side cache utility for improving application performance
 */

// Simple in-memory cache with expiration
type CacheEntry<T> = {
  value: T;
  expiry: number;
};

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Set a value in cache with optional TTL
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  // Get a value from cache if not expired
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  // Remove an item from cache
  remove(key: string): void {
    this.cache.delete(key);
  }

  // Clear all expired items
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Set default TTL for all cache entries
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Helper hook for React Query to leverage the cache manager
 */
export const getCachedQueryFn = <T>(
  key: string, 
  fetchFn: () => Promise<T>,
  ttl?: number
): (() => Promise<T>) => {
  return async () => {
    // Try to get from cache first
    const cachedValue = cacheManager.get<T>(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // If not in cache, fetch and store
    const result = await fetchFn();
    cacheManager.set(key, result, ttl);
    return result;
  };
};
