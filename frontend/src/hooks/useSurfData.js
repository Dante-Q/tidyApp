import { useEffect, useState, useRef } from "react";

// Coordinates for Cape Town surf spots
const beachCoords = {
  muizenberg: { lat: -34.105, lon: 18.472 },
  bloubergstrand: { lat: -33.808, lon: 18.464 },
  strand: { lat: -34.11, lon: 18.827 },
  clifton: { lat: -33.951, lon: 18.377 },
  kalkbay: { lat: -34.127, lon: 18.449 },
  milnerton: { lat: -33.885, lon: 18.495 },
};

// Cache with 15-minute expiry to avoid spamming the API
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const cache = new Map();

export default function useSurfData(beachName = "muizenberg") {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const beach = beachCoords[beachName.toLowerCase()];
    if (!beach) {
      setError("Unknown beach name");
      setLoading(false);
      return;
    }

    // Check cache first
    const cacheKey = beachName.toLowerCase();
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      // Use cached data
      setData(cached.data);
      setCurrent(cached.current);
      setLoading(false);
      return;
    }

    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&current=wave_height,wave_direction,wave_period&timezone=Africa/Johannesburg`;

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

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json = await response.json();

        // Cache the result
        cache.set(cacheKey, {
          data: json,
          current: json.current || null,
          timestamp: now,
        });

        setData(json);

        // Set current conditions if available
        if (json.current) {
          setCurrent(json.current);
        }
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
