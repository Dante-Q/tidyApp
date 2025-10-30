import { QueryClient } from "@tanstack/react-query";

// Create React Query client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data becomes stale immediately (will show cached but refetch)
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      retry: 1, // Retry failed requests once
      refetchOnMount: true, // Always refetch when component mounts
      gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 0, // Don't retry mutations (POST/PUT/DELETE)
    },
  },
});
