/**
 * @fileoverview RateLimitedUI component for the Dex Note Taking App frontend.
 *
 * This component provides a specialized error state interface that displays when
 * the user has exceeded the API rate limits. It serves as a user-friendly way
 * to handle rate limiting scenarios by providing clear visual feedback, helpful
 * messaging, and guidance on what users should do next. The component is designed
 * with a mobile-first responsive approach and provides an engaging user experience
 * even during error states.
 *
 * Key Features:
 * - Rate limiting error state with clear visual indicators
 * - User-friendly messaging explaining the rate limit situation
 * - Guidance on when to try again for better user experience
 * - Responsive design for all screen sizes
 * - Consistent styling with application theme
 * - Warning visual design with appropriate iconography
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { ZapIcon } from 'lucide-react';

/**
 * RateLimitedUI component that displays a rate limiting error state.
 *
 * This component serves as a specialized error state interface that appears
 * when the user has exceeded the API rate limits (100 requests per minute).
 * It provides clear visual feedback, helpful messaging, and guidance on what
 * users should do next. The component is designed to be informative and
 * reassuring rather than just showing a generic error message.
 *
 * Why this component structure?
 * - Error state handling: Provides a better user experience than generic error messages
 * - User guidance: Helps users understand what happened and what to do next
 * - Visual appeal: Uses warning colors and iconography to indicate the situation
 * - Rate limiting context: Specifically designed for rate limiting scenarios
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 * - Consistent branding: Maintains visual consistency with the application theme
 *
 * Design Philosophy:
 * - User-centric: Focuses on helping users understand and resolve the situation
 * - Informative: Clearly explains what rate limiting means and why it happened
 * - Reassuring: Uses positive messaging to encourage users to try again
 * - Visual hierarchy: Clear structure with icon, heading, and explanatory text
 * - Accessibility: Proper contrast and touch-friendly design elements
 * - Responsive: Adapts gracefully to different screen sizes
 *
 * Rate Limiting Context:
 * - Backend uses Upstash Redis for distributed rate limiting
 * - Rate limit: 100 requests per 60-second sliding window
 * - Applied globally to all API endpoints for protection
 * - 429 HTTP status code indicates rate limit exceeded
 * - Component appears when HomePage detects 429 status in API responses
 *
 * Error State Best Practices:
 * - Clear messaging: Explains what the error means in user-friendly terms
 * - Visual indicator: Uses appropriate icon (lightning bolt) to represent urgency
 * - Action guidance: Provides clear next steps for users
 * - Encouraging tone: Motivates users to try again rather than giving up
 * - Consistent styling: Matches the application's design system
 *
 * @returns {JSX.Element} The rate limiting error state component with icon, message, and guidance
 *
 * @see {@link ../pages/HomePage.jsx} HomePage component that displays this error state
 * @see {@link ../../backend/src/middleware/rateLimiter.js} Backend rate limiting middleware
 * @see {@link ../../backend/src/config/upstash.js} Upstash Redis rate limiter configuration
 * @see {@link ../lib/axios.js} API client that handles 429 status codes
 */
const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 w-full">
      {/* Main error state card with warning styling */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg shadow-md w-full">
        <div className="flex flex-col md:flex-row items-center p-4 sm:p-6">
          {/* Icon container with warning background and lightning bolt icon */}
          <div className="flex-shrink-0 bg-primary/20 p-3 sm:p-4 rounded-full mb-3 sm:mb-4 md:mb-0 md:mr-6">
            <ZapIcon className="size-8 sm:size-10 text-primary" />
          </div>
          {/* Content area with responsive text alignment */}
          <div className="flex-1 text-center md:text-left">
            {/* Main heading with responsive typography */}
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
              Rate Limit Reached
            </h3>
            {/* Primary explanation message with responsive typography */}
            <p className="text-base-content mb-1 text-sm sm:text-base">
              You've made too many requests in a short period. Please wait a
              moment.
            </p>
            {/* Secondary guidance message with smaller typography */}
            <p className="text-xs sm:text-sm text-base-content/70">
              Try again in a few seconds for the best experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
