/**
 * @fileoverview Main Express.js server for the Dex Note Taking App backend API.
 *
 * This server provides a RESTful API for managing notes with the following features:
 * - Environment-specific CORS configuration (development vs production)
 * - Rate limiting using Upstash Redis to prevent abuse
 * - MongoDB integration for persistent note storage
 * - Health check endpoint for Fly.io deployment monitoring
 * - Comprehensive error handling and middleware stack
 *
 * The server is designed to be deployed on Fly.io with the frontend on Vercel,
 * requiring careful CORS configuration to handle cross-origin requests properly.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

// Load environment variables from .env file
// This must be called before accessing process.env variables
dotenv.config();

/**
 * Express application instance for the Dex Note Taking App API.
 *
 * This app instance is configured with middleware for CORS, JSON parsing,
 * rate limiting, and routing for the notes API endpoints.
 *
 * @type {express.Application}
 */
const app = express();

/**
 * Server port configuration with fallback for local development.
 *
 * In production (Fly.io), this is set to 8080 as configured in fly.toml.
 * In development, it defaults to 8080 but can be overridden via environment variables.
 *
 * @type {string|number}
 */
const PORT = process.env.PORT || 8080;

/**
 * Resolved directory path for the current module.
 *
 * This is used to resolve file paths relative to the server's location,
 * though it's not actively used in the current implementation.
 *
 * @type {string}
 */
const __dirname = path.resolve();

/**
 * CORS (Cross-Origin Resource Sharing) configuration with environment-specific settings.
 *
 * This middleware is crucial for allowing the frontend (hosted on Vercel) to communicate
 * with this backend API (hosted on Fly.io). The configuration differs between environments:
 *
 * Development: Allows requests from localhost:5173 (Vite dev server)
 * Production: Allows requests from the deployed Vercel domains with credentials support
 *
 * The production configuration includes both the main domain and the git-main branch domain
 * because Vercel creates separate deployments for different branches.
 *
 * @see {@link https://expressjs.com/en/resources/middleware/cors.html} Express CORS documentation
 */
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
    })
  );
} else {
  app.use(
    cors({
      origin: [
        'https://dex-note-taking-app.vercel.app',
        'https://dex-note-taking-app-git-main.vercel.app',
      ],
      credentials: true,
    })
  );
}

/**
 * Express JSON parsing middleware.
 *
 * This middleware parses incoming requests with JSON payloads and makes the parsed
 * data available on req.body. It's essential for handling POST and PUT requests
 * that send note data in JSON format.
 *
 * @see {@link https://expressjs.com/en/api.html#express.json} Express JSON middleware documentation
 */
app.use(express.json());

/**
 * Rate limiting middleware using Upstash Redis.
 *
 * This middleware prevents API abuse by limiting the number of requests per client.
 * It uses Redis for distributed rate limiting, which is essential for production
 * deployments where multiple server instances might be running.
 *
 * The rate limiter is applied globally to all routes, providing protection against
 * both intentional abuse and accidental high-frequency requests.
 *
 * @see {@link ./middleware/rateLimiter.js} Rate limiter implementation
 */
app.use(rateLimiter);

/**
 * Health check endpoint for Fly.io deployment monitoring.
 *
 * This endpoint is specifically designed for Fly.io's health check system as configured
 * in fly.toml. Fly.io uses this endpoint to determine if the application is running
 * properly and can handle requests. The endpoint returns a simple OK status with a
 * timestamp to confirm the server is responsive.
 *
 * The health check configuration in fly.toml specifies:
 * - Grace period: 10 seconds
 * - Check interval: 30 seconds
 * - Timeout: 5 seconds
 * - Method: GET
 * - Path: /health
 *
 * @route GET /health
 * @returns {Object} Health status object with status and timestamp
 * @returns {string} returns.status - Always "OK" when server is running
 * @returns {string} returns.timestamp - ISO 8601 timestamp of the check
 *
 * @see {@link ../fly.toml} Fly.io configuration for health check settings
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Notes API routes configuration.
 *
 * This mounts all note-related routes under the /api/notes path. The notesRoutes
 * module provides CRUD operations for managing notes:
 * - GET /api/notes - Retrieve all notes
 * - GET /api/notes/:id - Retrieve a specific note by ID
 * - POST /api/notes - Create a new note
 * - PUT /api/notes/:id - Update an existing note
 * - DELETE /api/notes/:id - Delete a note
 *
 * All routes are protected by the rate limiting middleware applied earlier.
 *
 * @see {@link ./routes/notesRoutes.js} Notes routes implementation
 */
app.use('/api/notes', notesRoutes);

/**
 * Root API endpoint providing API information and available endpoints.
 *
 * This endpoint serves as the main entry point for API discovery and provides
 * information about the available endpoints. It's useful for:
 * - API documentation and discovery
 * - Verifying the API is running correctly
 * - Providing a simple way to test connectivity
 *
 * The response includes a descriptive message, available endpoints, and a timestamp
 * to confirm the API is active and responsive.
 *
 * @route GET /
 * @returns {Object} API information object
 * @returns {string} returns.message - Descriptive API name and purpose
 * @returns {Object} returns.endpoints - Available API endpoints
 * @returns {string} returns.endpoints.health - Health check endpoint path
 * @returns {string} returns.endpoints.notes - Notes API endpoint path
 * @returns {string} returns.timestamp - ISO 8601 timestamp of the response
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Dex Note Taking App Backend API',
    endpoints: {
      health: '/health',
      notes: '/api/notes',
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Database connection and server startup sequence.
 *
 * This code block handles the critical startup sequence for the application:
 * 1. First connects to the MongoDB database using the connectDB function
 * 2. Only starts the Express server after successful database connection
 * 3. This ensures the application doesn't start serving requests without database access
 *
 * The connectDB function is imported from ./config/db.js and handles:
 * - MongoDB connection using the MONGO_URI environment variable
 * - Error handling with process.exit(1) on connection failure
 * - Graceful error handling for database connection issues
 *
 * Once the database connection is established, the server starts listening on the
 * configured PORT, making the API available for incoming requests.
 *
 * @see {@link ./config/db.js} Database connection implementation
 * @see {@link https://mongoosejs.com/docs/connections.html} Mongoose connection documentation
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    // Server started successfully
  });
});
