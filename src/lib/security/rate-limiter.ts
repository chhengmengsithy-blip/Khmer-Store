/**
 * Rate Limiter
 *
 * In-memory token bucket rate limiter, configurable per endpoint.
 * For production, consider using Redis-backed implementation.
 */

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxTokens: number;
  /** Time window in milliseconds for token refill */
  refillInterval: number;
  /** Number of tokens added per refill interval */
  refillRate: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Unix timestamp when tokens will be fully replenished
  retryAfter?: number; // Seconds until next available request
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

/** Default configurations for common endpoint types */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  api_general: {
    maxTokens: 100,
    refillInterval: 60_000, // 1 minute
    refillRate: 100,
  },
  api_auth: {
    maxTokens: 5,
    refillInterval: 900_000, // 15 minutes
    refillRate: 5,
  },
  api_payment: {
    maxTokens: 10,
    refillInterval: 60_000, // 1 minute
    refillRate: 10,
  },
  api_upload: {
    maxTokens: 20,
    refillInterval: 3600_000, // 1 hour
    refillRate: 20,
  },
  api_webhook: {
    maxTokens: 200,
    refillInterval: 60_000, // 1 minute
    refillRate: 200,
  },
};

// In-memory store (per-process; use Redis for multi-instance deployments)
const buckets = new Map<string, TokenBucket>();

function getOrCreateBucket(key: string, config: RateLimitConfig): TokenBucket {
  const existing = buckets.get(key);
  if (existing) return existing;

  const bucket: TokenBucket = {
    tokens: config.maxTokens,
    lastRefill: Date.now(),
  };
  buckets.set(key, bucket);
  return bucket;
}

function refillTokens(bucket: TokenBucket, config: RateLimitConfig): void {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  const refillCount = Math.floor(elapsed / config.refillInterval) * config.refillRate;

  if (refillCount > 0) {
    bucket.tokens = Math.min(config.maxTokens, bucket.tokens + refillCount);
    bucket.lastRefill = now;
  }
}

/**
 * Check if a request is allowed under the rate limit.
 * The key typically combines the identifier (IP/user ID) and endpoint.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api_general
): RateLimitResult {
  const bucket = getOrCreateBucket(key, config);
  refillTokens(bucket, config);

  const resetAt = bucket.lastRefill + config.refillInterval;

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: bucket.tokens,
      limit: config.maxTokens,
      resetAt,
    };
  }

  const retryAfter = Math.ceil((config.refillInterval - (Date.now() - bucket.lastRefill)) / 1000);

  return {
    allowed: false,
    remaining: 0,
    limit: config.maxTokens,
    resetAt,
    retryAfter: Math.max(1, retryAfter),
  };
}

/**
 * Create rate limit headers for the response.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };

  if (!result.allowed && result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Reset the rate limit for a specific key.
 */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Clear all rate limit buckets (useful for testing).
 */
export function clearAllRateLimits(): void {
  buckets.clear();
}
