/**
 * Custom hook for fetching sea level data
 * Returns hourly tide height predictions for a specific beach
 */

import { useState, useEffect } from "react";
import { fetchBeachSeaLevelData } from "../services/seaLevelService";

/**
 * Hook to fetch sea level data for a beach
 * @param {string} beachName - Name of the beach to fetch data for
 * @returns {Object} { data, seaLevel, loading, error }
 */
export default function useSeaLevelData(beachName = "muizenberg") {
  const [data, setData] = useState(null);
  const [seaLevel, setSeaLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const json = await fetchBeachSeaLevelData(beachName);

        if (!controller.signal.aborted) {
          setData(json);
          setSeaLevel(json.seaLevel || []);
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching sea level data:", err);
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchData();

    // Cleanup function to abort fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, [beachName]);

  return { data, seaLevel, loading, error };
}
