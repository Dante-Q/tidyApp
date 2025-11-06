import { useEffect, useState, useRef } from "react";
import { fetchWeatherData } from "../services/openMeteoService.js";
import { createCache } from "../utils/cacheManager.js";
import { CACHE_CONFIG } from "../config/cacheConfig.js";

// Create cache instance for weather data
const weatherCache = createCache(CACHE_CONFIG.weatherData);

export default function useWeatherData(beachName = "muizenberg") {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Check cache first
    const cacheKey = beachName.toLowerCase();
    const cached = weatherCache.get(cacheKey);

    if (cached) {
      // Use cached data
      setData(cached);
      setCurrent(cached.current || null);
      setLoading(false);
      return;
    }

    // Fetch fresh data
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const json = await fetchWeatherData(beachName, {
          signal: abortControllerRef.current.signal,
        });

        // Validate API response structure
        if (!json?.current) {
          throw new Error("Invalid API response: missing current weather data");
        }

        // Cache the data
        weatherCache.set(cacheKey, json);

        setData(json);
        setCurrent(json.current);
        setLoading(false);
      } catch (err) {
        // Ignore abort errors
        if (err.name === "AbortError") {
          return;
        }

        console.error("Weather data fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [beachName]);

  return { data, current, loading, error };
}
