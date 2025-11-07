import { useQuery } from "@tanstack/react-query";
import { fetchBeachTideData } from "../services/tideService.js";

/**
 * Custom hook to fetch tide data for a specific beach
 * Note: This data is served from backend static file updated 2-3 times per day
 * Long cache time since data doesn't change frequently
 */
export default function useTideData(beachName = "muizenberg") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tides", beachName.toLowerCase()],
    queryFn: async () => {
      const json = await fetchBeachTideData(beachName);
      
      // Validate response structure
      if (!json?.extremes) {
        throw new Error("Invalid tide data response: missing extremes");
      }
      
      return json;
    },
    staleTime: 2 * 60 * 60 * 1000, // 2 hours - tide data updated infrequently
    gcTime: 4 * 60 * 60 * 1000, // 4 hours - keep in cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!beachName,
  });

  return {
    data: data || null,
    extremes: data?.extremes || [],
    loading: isLoading,
    error: error?.message || null,
  };
}
