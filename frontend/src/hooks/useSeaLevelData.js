/**
 * Custom hook for fetching sea level data
 * Returns hourly tide height predictions for a specific beach
 */

import { useQuery } from "@tanstack/react-query";
import { fetchBeachSeaLevelData } from "../services/seaLevelService";

/**
 * Hook to fetch sea level data for a beach
 * @param {string} beachName - Name of the beach to fetch data for
 * @returns {Object} { data, seaLevel, loading, error }
 */
export default function useSeaLevelData(beachName = "muizenberg") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["seaLevel", beachName.toLowerCase()],
    queryFn: () => fetchBeachSeaLevelData(beachName),
    staleTime: 60 * 60 * 1000, // 1 hour - sea level data is predictable
    gcTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!beachName,
  });

  return {
    data: data || null,
    seaLevel: data?.seaLevel || [],
    loading: isLoading,
    error: error?.message || null,
  };
}
