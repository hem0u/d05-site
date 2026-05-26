const store = new Map<string, { data: unknown; ts: number }>()
const TTL = 30_000 // 30 seconds

export function getCached<T>(key: string): T | null {
  const entry = store.get(key)
  if (entry && Date.now() - entry.ts < TTL) {
    return entry.data as T
  }
  return null
}

export function setCache(key: string, data: unknown) {
  store.set(key, { data, ts: Date.now() })
}
