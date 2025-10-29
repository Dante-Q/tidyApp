/**
 * Cache configuration for different data sources
 * Centralized settings for cache TTL (time-to-live) and size limits
 */

export const CACHE_CONFIG = {
  // Surf/marine data from Open-Meteo API
  surfData: {
    maxSize: 20, // Maximum number of beaches to cache
    ttl: 15 * 60 * 1000, // 15 minutes - surf conditions change gradually
  },

  // Future: Weather data
  // weatherData: {
  //   maxSize: 10,
  //   ttl: 5 * 60 * 1000, // 5 minutes - weather changes faster
  // },

  // Future: Tide data
  // tideData: {
  //   maxSize: 15,
  //   ttl: 60 * 60 * 1000, // 1 hour - tides are predictable
  // },
};
