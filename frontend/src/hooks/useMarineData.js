import { useQuery } from "@tanstack/react-query";
import { fetchMarineData } from "../services/openMeteoService.js";
import { CACHE_CONFIG } from "../config/cacheConfig.js";

export default function useMarineData(beachName = "muizenberg") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["marine", beachName.toLowerCase()],
    queryFn: async () => {
      const json = await fetchMarineData(beachName);
      
      // Validate API response structure
      if (!json?.hourly?.wave_height) {
        throw new Error("Invalid API response: missing wave data");
      }
      
      return json;
    },
    staleTime: CACHE_CONFIG.marineData.ttl, // 15 minutes - data considered fresh
    gcTime: CACHE_CONFIG.marineData.ttl * 2, // 30 minutes - keep in cache
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    retry: 2, // Retry failed requests twice
    enabled: !!beachName, // Only fetch if beachName provided
  });

  return {
    data: data || null,
    current: data?.current || null,
    loading: isLoading,
    error: error?.message || null,
  };
}
