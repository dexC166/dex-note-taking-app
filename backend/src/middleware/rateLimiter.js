/**
 * @fileoverview Express.js rate limiting middleware for the Dex Note Taking App.
 *
 * This middleware implements distributed rate limiting using Upstash Redis to prevent
 * API abuse and ensure fair usage across all clients. It uses a sliding window
 * algorithm to allow 100 requests per minute per client, providing protection
 * against both intentional abuse and accidental high-frequency requests.
 *
 * The middleware is applied globally to all routes and integrates seamlessly with
 * the frontend's error handling system, providing a smooth user experience when
 * rate limits are exceeded.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import ratelimit from '../config/upstash.js';

/**
 * Express.js middleware function that enforces rate limiting on incoming requests.
 *
 * This middleware acts as a gatekeeper for all API requests, checking if the client
 * has exceeded the rate limit before allowing the request to proceed to the actual
 * route handlers. It uses Upstash Redis for distributed rate limiting, ensuring
 * consistent limits across multiple server instances.
 *
 * **Why this approach?**
 * - **Global protection**: Applied to all routes to prevent any endpoint from being abused
 * - **Distributed limiting**: Uses Redis for shared state across multiple server instances
 * - **User-friendly responses**: Returns clear error messages instead of generic failures
 * - **Graceful error handling**: Passes Redis connection errors to Express error middleware
 * - **Non-blocking**: Uses async/await to avoid blocking the event loop
 *
 * **Rate Limiting Details:**
 * - **Algorithm**: Sliding window (100 requests per 60-second window)
 * - **Scope**: Per-client (based on IP address or user identifier)
 * - **Storage**: Upstash Redis (cloud-hosted, globally distributed)
 * - **Response**: HTTP 429 with user-friendly JSON message
 *
 * **Frontend Integration:**
 * - Frontend detects 429 status codes and shows appropriate UI
 * - HomePage shows `RateLimitedUI` component for visual feedback
 * - CreatePage shows toast notification with emoji for immediate feedback
 * - All pages handle rate limiting gracefully without breaking user flow
 *
 * **Error Handling Strategy:**
 * - Redis connection errors are passed to Express error middleware
 * - This ensures the app doesn't crash if Redis is temporarily unavailable
 * - Error middleware can log issues and potentially fall back to alternative limiting
 *
 * @async
 * @function rateLimiter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Resolves when rate limit check is complete
 *
 * @example
 * // Applied globally in server.js
 * app.use(rateLimiter);
 *
 * // For individual routes (if needed)
 * app.get('/api/notes', rateLimiter, getAllNotes);
 *
 * @see {@link ../config/upstash.js} Upstash Redis rate limiter configuration
 * @see {@link ../server.js} Global middleware registration
 * @see {@link ../../frontend/src/components/RateLimitedUI.jsx} Frontend rate limit UI
 * @see {@link ../../frontend/src/pages/HomePage.jsx} Frontend rate limit handling
 * @see {@link ../../frontend/src/pages/CreatePage.jsx} Frontend rate limit handling
 * @see {@link https://expressjs.com/en/guide/using-middleware.html} Express middleware documentation
 */
const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit('my-rate-limit');

    if (!success) {
      return res.status(429).json({
        message: 'Too many requests, please try again later',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default rateLimiter;
