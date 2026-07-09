// In-memory stale-while-revalidate cache for page data. Screens render the
// last thing they showed instantly, then refresh from Supabase in the
// background. Cleared on sign-out (module state dies with the tab anyway).

const cache = new Map<string, unknown>();

export function getCached<T>(key: string): T | null {
  return (cache.get(key) as T | undefined) ?? null;
}

export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}

export function clearCache(): void {
  cache.clear();
}
