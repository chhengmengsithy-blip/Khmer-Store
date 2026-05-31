/**
 * Rate Limiter - Upstash Redis-backed sliding window implementation
 *
 * Uses @upstash/ratelimit with a Redis backend for distributed rate limiting.
 * State is shared across all instances and survives restarts.
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars.
 * If env vars are missing, falls back to allowing all requests (with a warning).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxTokens: number;
  /** Time window in milliseconds for token refill */
  refillInterval: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Unix timestamp when tokens will be fully replenished
  retryAfter?: number; // Seconds until next available request
}

/** Default configurations for common endpoint types */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  api_general: {
    maxTokens: 100,
    refillInterval: 60_000, // 1 minute
  },
  api_auth: {
    maxTokens: 5,
    refillInterval: 900_000, // 15 minutes
  },
  api_payment: {
    maxTokens: 10,
    refillInterval: 60_000, // 1 minute
  },
  api_upload: {
    maxTokens: 20,
    refillInterval: 3600_000, // 1 hour
  },
  api_webhook: {
    maxTokens: 200,
    refillInterval: 60_000, // 1 minute
  },
};

// Track whether we have already warned about missing env vars
let warnedMissingEnv = false;

/**
 * Check if Upstash env vars are configured.
 */
function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Create a Redis client for Upstash.
 * Only call when env vars are confirmed present.
 */
function createRedisClient(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/**
 * Cache of Ratelimit instances keyed by config signature.
 * Each unique combination of maxTokens + refillInterval gets its own instance.
 */
const ratelimitCache = new Map<string, Ratelimit>();

function getConfigKey(config: RateLimitConfig): string {
  return `${config.maxTokens}:${config.refillInterval}`;
}

function getRatelimitInstance(config: RateLimitConfig): Ratelimit {
  const key = getConfigKey(config);
  const cached = ratelimitCache.get(key);
  if (cached) return cached;

  const windowMs = config.refillInterval;
  const windowStr = `${Math.round(windowMs / 1000)} s` as `${number} s`;

  const instance = new Ratelimit({
    redis: createRedisClient(),
    limiter: Ratelimit.slidingWindow(config.maxTokens, windowStr),
    prefix: `ratelimit:${key}`,
  });

  ratelimitCache.set(key, instance);
  return instance;
}

/**
 * Check if a request is allowed under the rate limit.
 * The key typically combines the identifier (IP/user ID) and endpoint.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api_general
): Promise<RateLimitResult> {
  if (!isUpstashConfigured()) {
    if (!warnedMissingEnv) {
      console.warn(
        "[rate-limiter] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. " +
          "Rate limiting is disabled. All requests will be allowed."
      );
      warnedMissingEnv = true;
    }
    return {
      allowed: true,
      remaining: config.maxTokens,
      limit: config.maxTokens,
      resetAt: Date.now() + config.refillInterval,
    };
  }

  const ratelimit = getRatelimitInstance(config);
  const result = await ratelimit.limit(key);

  const rateLimitResult: RateLimitResult = {
    allowed: result.success,
    remaining: result.remaining,
    limit: result.limit,
    resetAt: result.reset,
  };

  if (!result.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    );
    rateLimitResult.retryAfter = retryAfter;
  }

  return rateLimitResult;
}

/**
 * Create rate limit headers for the response.
 */
export function getRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
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
 * With Upstash, TTL-based expiration handles cleanup automatically.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resetRateLimit(_key: string): void {
  // No-op: Upstash handles TTL-based expiration automatically
}

/**
 * Clear all rate limit buckets.
 * With Upstash, TTL-based expiration handles cleanup automatically.
 */
export function clearAllRateLimits(): void {
  // No-op: Upstash handles TTL-based expiration automatically
}
