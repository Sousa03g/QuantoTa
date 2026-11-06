const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-theta-red-63.vercel.app/api";

export const config = {
  apiBaseUrl: API_BASE_URL,
  cache: {
    /** Stale time for live-updating queries (15 seconds) */
    liveStaleTime: 15 * 1000,
    /** Refetch interval for live scores (15 seconds) */
    liveRefetchInterval: 15 * 1000,
    /** Stale time for static data like standings (5 minutes) */
    staticStaleTime: 5 * 60 * 1000,
    /** Stale time for match list queries (2 minutes) */
    matchListStaleTime: 2 * 60 * 1000,
    /** Garbage collection time (30 minutes) */
    gcTime: 30 * 60 * 1000,
  },
  pagination: {
    defaultPageSize: 20,
  },
} as const;
