import { useEffect, useState, useRef } from "react";
import { fetchMarineData } from "../services/openMeteoService.js";
import { createCache } from "../utils/cacheManager.js";
import { CACHE_CONFIG } from "../config/cacheConfig.js";

// Create cache instance for surf data
const surfCache = createCache(CACHE_CONFIG.surfData);

export default function useSurfData(beachName = "muizenberg") {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Check cache first
    const cacheKey = beachName.toLowerCase();
    const cached = surfCache.get(cacheKey);

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

        const json = await fetchMarineData(beachName, {
          signal: abortControllerRef.current.signal,
        });

        // Validate API response structure
        if (!json?.hourly?.wave_height) {
          throw new Error("Invalid API response: missing wave data");
        }

        // Cache the raw API response
        surfCache.set(cacheKey, json);

        setData(json);
        setCurrent(json.current || null);
      } catch (err) {
        // Don't set error if request was aborted
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Cleanup function to abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [beachName]);

  return { data, current, loading, error };
}
