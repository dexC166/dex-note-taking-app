/**
 * @fileoverview Centralized Axios configuration for the Dex Note Taking App frontend.
 *
 * This module provides a pre-configured Axios instance for making HTTP requests
 * to the backend API. It handles environment-specific URL configuration and
 * provides a consistent interface for all API communication throughout the
 * application. The configuration automatically switches between development
 * and production API endpoints based on the current environment.
 *
 * Key Features:
 * - Environment-aware base URL configuration
 * - Centralized API client for consistent requests
 * - Development/production URL switching
 * - Integration with Vite's environment variables
 * - Support for all CRUD operations on notes
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * Environment-specific base URL for API requests.
 *
 * This configuration dynamically determines the correct API endpoint based on
 * the current environment. In development, it points to the local backend
 * server, while in production, it uses relative paths that work with the
 * deployment configuration.
 *
 * Why this approach?
 * - Development flexibility: Allows local backend development on port 8080
 * - Production compatibility: Uses relative paths that work with Vercel's API proxying
 * - Environment isolation: Prevents accidental production calls from development
 * - Deployment simplicity: No need to change URLs between environments
 *
 * URL Configuration:
 * - Development: http://localhost:8080/api (local backend server)
 * - Production: /api (relative path, proxied by Vercel to Fly.io backend)
 *
 * @type {string}
 *
 * @see {@link ../vercel.json} Vercel configuration that proxies /api to backend
 * @see {@link https://vitejs.dev/guide/env-and-mode.html} Vite environment variables
 */
const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:8080/api' : '/api';

/**
 * Pre-configured Axios instance for API communication.
 *
 * This Axios instance is configured with the appropriate base URL and can be
 * used throughout the application for making HTTP requests to the backend API.
 * It provides a consistent interface for all API operations and handles
 * environment-specific URL resolution automatically.
 *
 * Why use a pre-configured instance?
 * - Consistency: Same configuration across all API calls
 * - Maintainability: Centralized configuration for easy updates
 * - Reusability: Can be imported and used anywhere in the application
 * - Environment handling: Automatically uses correct URLs for each environment
 *
 * API Endpoints Used:
 * - GET /notes - Retrieve all notes (HomePage)
 * - POST /notes - Create new note (CreatePage)
 * - GET /notes/:id - Retrieve specific note (NoteDetailPage)
 * - PUT /notes/:id - Update existing note (NoteDetailPage)
 * - DELETE /notes/:id - Delete note (NoteDetailPage, NoteCard)
 *
 * Error Handling:
 * - Components handle 429 status codes for rate limiting
 * - Toast notifications show success/error messages
 * - Graceful fallbacks for network failures
 *
 * @type {AxiosInstance}
 *
 * @see {@link ../pages/HomePage.jsx} HomePage that uses GET /notes
 * @see {@link ../pages/CreatePage.jsx} CreatePage that uses POST /notes
 * @see {@link ../pages/NoteDetailPage.jsx} NoteDetailPage that uses GET/PUT/DELETE /notes/:id
 * @see {@link ../components/NoteCard.jsx} NoteCard that uses DELETE /notes/:id
 * @see {@link https://axios-http.com/docs/instance} Axios instance documentation
 */
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
