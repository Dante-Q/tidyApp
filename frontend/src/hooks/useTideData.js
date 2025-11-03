import { useEffect, useState, useRef } from "react";
import { fetchBeachTideData } from "../services/tideService.js";

/**
 * Custom hook to fetch tide data for a specific beach
 * Note: This data is served from a static file updated 2-3 times per day
 * No real-time caching needed since backend file doesn't change frequently
 */
export default function useTideData(beachName = "muizenberg") {
  const [data, setData] = useState(null);
  const [extremes, setExtremes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
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

        const json = await fetchBeachTideData(beachName);

        // Validate response structure
        if (!json?.extremes) {
          throw new Error("Invalid tide data response: missing extremes");
        }

        setData(json);
        setExtremes(json.extremes || []);
        setLoading(false);
      } catch (err) {
        // Ignore abort errors
        if (err.name === "AbortError") {
          return;
        }

        console.error("Tide data fetch error:", err);
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

  return { data, extremes, loading, error };
}
