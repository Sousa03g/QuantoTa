/**
 * @file lib/cache.ts
 * @description Simple in-memory TTL cache backed by a Map.
 *
 * Suitable for serverless environments where a cold start resets the
 * cache. For production at scale, swap this with Redis / Upstash.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // Unix ms
}

/** Default TTL values in seconds. */
export const TTL = {
  /** Live match data — very short. */
  LIVE: 60,
  /** Standings — moderate. */
  STANDINGS: 300,
  /** Relatively static data (teams, leagues). */
  STATIC: 3600,
} as const;

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Retrieve a cached value.
 * Returns `null` if the key is missing or expired.
 */
export function get<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value as T;
}

/**
 * Store a value with an explicit TTL (seconds).
 */
export function set<T>(key: string, value: T, ttlSeconds: number): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Delete a single cache key.
 */
export function del(key: string): void {
  store.delete(key);
}

/**
 * Flush the entire cache.
 */
export function flush(): void {
  store.clear();
}
