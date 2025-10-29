/**
 * Reusable LRU (Least Recently Used) cache manager
 * Can be used for any API data caching needs
 */

/**
 * Create a new LRU cache instance
 * @param {Object} options - Cache configuration
 * @param {number} options.maxSize - Maximum number of cache entries (default: 20)
 * @param {number} options.ttl - Time to live in milliseconds (default: 15 minutes)
 * @returns {Object} Cache instance with get/set/clear methods
 */
export function createCache({ maxSize = 20, ttl = 15 * 60 * 1000 } = {}) {
  const cache = new Map();

  return {
    /**
     * Get value from cache if not expired
     * @param {string} key - Cache key
     * @returns {any} Cached value or null if expired/not found
     */
    get(key) {
      const cached = cache.get(key);
      const now = Date.now();

      if (!cached) return null;

      // Check if expired
      if (now - cached.timestamp >= ttl) {
        cache.delete(key);
        return null;
      }

      // LRU: Move to end by delete + re-add
      cache.delete(key);
      cache.set(key, cached);

      return cached.data;
    },

    /**
     * Set value in cache with automatic LRU eviction
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    set(key, data) {
      const now = Date.now();

      // Evict least recently used entry if cache is full
      if (cache.size >= maxSize && !cache.has(key)) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      // Delete and re-set to move to end (LRU)
      cache.delete(key);
      cache.set(key, { data, timestamp: now });
    },

    /**
     * Clear all cache entries
     */
    clear() {
      cache.clear();
    },

    /**
     * Get current cache size
     * @returns {number} Number of cached entries
     */
    size() {
      return cache.size;
    },
  };
}
