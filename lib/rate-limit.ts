type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

/**
 * Sliding-window rate limiter backed by in-process memory.
 * Sufficient for a single-server / single-instance deployment.
 * For multi-instance deployments (e.g. Vercel with many cold starts)
 * replace with Upstash Redis.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

export function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}

export function rateLimitResponse(resetAt: number) {
  const retryAfterSec = Math.ceil((resetAt - Date.now()) / 1000)
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    }
  )
}
