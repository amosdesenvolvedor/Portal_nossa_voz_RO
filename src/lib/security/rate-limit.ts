type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

function cleanupExpired(now: number) {
  for (const [key, value] of buckets) {
    if (now >= value.resetAt) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  cleanupExpired(now);

  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    } as const;
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    } as const;
  }

  entry.count += 1;
  buckets.set(key, entry);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  } as const;
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
