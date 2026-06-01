const store = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60_000).unref?.()

export function rateLimit(
  ip: string,
  endpoint: string,
  maxRequests = 5,
  windowMs = 60_000, // 1 minute
): { ok: boolean; remaining: number } {
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: maxRequests - 1 }
  }

  entry.count++
  if (entry.count > maxRequests) {
    return { ok: false, remaining: 0 }
  }

  return { ok: true, remaining: maxRequests - entry.count }
}
