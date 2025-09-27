/**
 * @fileoverview Main entry point for the Dex Note Taking App React frontend.
 *
 * This file serves as the application's entry point, initializing the React
 * application and mounting it to the DOM. It sets up the core application
 * structure including routing, global notifications, and development tools.
 * The file uses React 19's modern APIs and follows current best practices
 * for React application initialization.
 *
 * Key Features:
 * - React 19 with modern createRoot API
 * - StrictMode for development warnings and checks
 * - Client-side routing with React Router
 * - Global toast notification system
 * - CSS imports for Tailwind styling
 * - Component tree initialization
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';

/**
 * React application initialization and DOM mounting.
 *
 * This code initializes the React application using the modern createRoot API
 * and mounts it to the DOM element with ID "root". The application is wrapped
 * in StrictMode for development checks and includes essential providers for
 * routing and global notifications.
 *
 * Why this approach?
 * - createRoot API: Modern React 19 API with better performance and features
 * - StrictMode: Catches potential issues and enforces best practices
 * - BrowserRouter: Enables client-side routing for single-page application
 * - Toaster: Provides global notification system for user feedback
 * - Component structure: Clean separation of concerns with App as root component
 *
 * Application Structure:
 * - StrictMode: Development warnings and additional checks
 * - BrowserRouter: Client-side routing provider
 * - App: Main application component with routes and layout
 * - Toaster: Global notification system for user feedback
 *
 * @see {@link ./App.jsx} Main application component with routing
 * @see {@link ./index.css} Main CSS file with Tailwind directives
 * @see {@link ../index.html} HTML file that provides the root element
 * @see {@link https://react.dev/reference/react-dom/client/createRoot} React 19 createRoot documentation
 * @see {@link https://react.dev/reference/react/StrictMode} React StrictMode documentation
 */
createRoot(document.getElementById('root')).render(
  /**
   * React StrictMode wrapper for development checks and warnings.
   *
   * StrictMode is a development-only tool that helps identify potential
   * problems in the application. It enables additional checks and warnings
   * for components, helping developers write better code and catch issues
   * early in the development process.
   *
   * What it does:
   * - Identifies components with unsafe lifecycles
   * - Warns about legacy string ref API usage
   * - Warns about deprecated findDOMNode usage
   * - Detects unexpected side effects
   * - Detects legacy context API usage
   * - Ensures reusable state
   *
   * Why use StrictMode?
   * - Development safety: Catches potential issues before production
   * - Best practices: Encourages modern React patterns
   * - Future compatibility: Prepares for future React versions
   * - Code quality: Helps write more robust components
   *
   */
  <StrictMode>
    {/* BrowserRouter provider for client-side routing */}
    <BrowserRouter>
      {/* Main application component containing all routes and layout */}
      <App />

      {/* Global toast notification system for user feedback */}
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
