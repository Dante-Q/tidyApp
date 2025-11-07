import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "../services/openMeteoService.js";
import { CACHE_CONFIG } from "../config/cacheConfig.js";

export default function useWeatherData(beachName = "muizenberg") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", beachName.toLowerCase()],
    queryFn: async () => {
      const json = await fetchWeatherData(beachName);
      
      // Validate API response structure
      if (!json?.current) {
        throw new Error("Invalid API response: missing current weather data");
      }
      
      return json;
    },
    staleTime: CACHE_CONFIG.weatherData.ttl, // 5 minutes - data considered fresh
    gcTime: CACHE_CONFIG.weatherData.ttl * 2, // 10 minutes - keep in cache
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
