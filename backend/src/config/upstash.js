/**
 * @fileoverview Upstash Redis rate limiter configuration for the Dex Note Taking App.
 *
 * This module configures a distributed rate limiter using Upstash Redis to prevent
 * API abuse and ensure fair usage of the note-taking API. The rate limiter uses a
 * sliding window algorithm to allow 100 requests per minute per client.
 *
 * The rate limiter is essential for production deployments where multiple server
 * instances might be running, as it provides centralized rate limiting across all
 * instances using Redis as the shared state store.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import dotenv from 'dotenv';

// Load environment variables from .env file
// This must be called before accessing process.env variables
dotenv.config();

/**
 * Upstash Redis rate limiter instance configured for the Dex Note Taking App.
 *
 * This rate limiter uses a sliding window algorithm to allow 100 requests per minute
 * per client, providing protection against both intentional abuse and accidental
 * high-frequency requests. The configuration is designed to balance API protection
 * with reasonable usage limits for legitimate users.
 *
 * **Why this configuration?**
 * - **100 requests/minute**: Generous enough for normal note-taking usage patterns
 *   while preventing abuse (typical user might make 10-20 requests per minute)
 * - **Sliding window**: More accurate than fixed windows as it provides smoother
 *   rate limiting without burst allowances at window boundaries
 * - **Distributed**: Uses Redis for shared state across multiple server instances
 * - **Environment-based**: Uses Upstash Redis credentials from environment variables
 *
 * **Rate Limiting Strategy:**
 * - **Algorithm**: Sliding window (more precise than fixed windows)
 * - **Limit**: 100 requests per 60-second window
 * - **Storage**: Upstash Redis (cloud-hosted, globally distributed)
 * - **Scope**: Per-client (based on IP address or user identifier)
 *
 * **Environment Variables Required:**
 * - `UPSTASH_REDIS_REST_URL`: Upstash Redis REST API endpoint
 * - `UPSTASH_REDIS_REST_TOKEN`: Authentication token for Upstash Redis
 *
 * **Integration Flow:**
 * 1. This instance is imported by `rateLimiter.js` middleware
 * 2. Middleware calls `ratelimit.limit('my-rate-limit')` for each request
 * 3. Returns `{ success: boolean }` indicating if request is allowed
 * 4. Failed requests return HTTP 429 status with user-friendly message
 * 5. Frontend handles 429 responses by showing `RateLimitedUI` component
 *
 * @type {Ratelimit}
 *
 * @example
 * // Used in middleware/rateLimiter.js
 * const { success } = await ratelimit.limit('my-rate-limit');
 * if (!success) {
 *   return res.status(429).json({
 *     message: 'Too many requests, please try again later'
 *   });
 * }
 *
 * @see {@link ../middleware/rateLimiter.js} Rate limiter middleware implementation
 * @see {@link ../server.js} Global middleware registration
 * @see {@link ../../frontend/src/components/RateLimitedUI.jsx} Frontend rate limit UI
 * @see {@link https://upstash.com/docs/redis/sdks/js/ratelimit} Upstash Rate Limit documentation
 * @see {@link https://upstash.com/docs/redis/sdks/js/redis} Upstash Redis documentation
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});

export default ratelimit;
