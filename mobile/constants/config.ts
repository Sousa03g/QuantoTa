const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const config = {
  apiBaseUrl: API_BASE_URL,
  cache: {
    /** Stale time for live-updating queries (30 seconds) */
    liveStaleTime: 30 * 1000,
    /** Refetch interval for live scores (30 seconds) */
    liveRefetchInterval: 30 * 1000,
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
