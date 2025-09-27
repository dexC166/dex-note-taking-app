/**
 * @fileoverview ESLint configuration for the Dex Note Taking App frontend.
 *
 * This configuration file defines code quality rules and linting standards
 * for the React frontend application. It uses ESLint's modern flat config
 * format to enforce React best practices, modern JavaScript standards, and
 * consistent code style across the entire frontend codebase.
 *
 * Key Features:
 * - Modern ESLint flat config format (ESLint 9+)
 * - React 19 and JSX support with proper parsing
 * - React Hooks rules for proper hook usage
 * - React Refresh integration for development workflow
 * - Modern JavaScript features (ES2020+)
 * - Custom rules for unused variables and component exports
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * ESLint configuration array using the modern flat config format.
 *
 * This configuration uses ESLint's new flat config system introduced in
 * ESLint 9, which provides better performance and more intuitive configuration
 * structure. The configuration is specifically tailored for a React 19
 * application with modern JavaScript features and development workflow integration.
 *
 * Why this approach?
 * - Flat config: Modern ESLint configuration format with better performance
 * - React-focused: Specialized rules for React components and hooks
 * - Development integration: Works seamlessly with Vite and hot module replacement
 * - Code quality: Enforces best practices and prevents common React mistakes
 * - Consistency: Ensures uniform code style across all frontend files
 *
 * Configuration Structure:
 * - Ignores: Excludes build output and generated files
 * - File patterns: Targets all JavaScript and JSX files
 * - Language options: Modern JavaScript with JSX support
 * - Plugins: React-specific linting rules and development tools
 * - Rules: Combines recommended rules with custom configurations
 *
 * @type {Array<Object>}
 *
 * @see {@link ./package.json} Build scripts that use this configuration
 * @see {@link ./vite.config.js} Vite configuration that integrates with ESLint
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files} ESLint configuration documentation
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files-new} ESLint flat config documentation
 */
export default [
  /**
   * Global ignore patterns for files that should not be linted.
   *
   * This configuration excludes the dist directory from linting because
   * it contains generated files from the Vite build process. Linting
   * build output would be unnecessary and could cause performance issues.
   *
   * Why ignore dist?
   * - Build output: Contains minified and processed files
   * - Performance: Avoids linting thousands of generated files
   * - Relevance: Generated code doesn't need style enforcement
   * - Clean separation: Keeps linting focused on source code only
   *
   * @type {Object}
   * @property {string[]} ignores - Array of glob patterns to ignore
   */
  { ignores: ['dist'] },

  /**
   * Main ESLint configuration for JavaScript and JSX files.
   *
   * This configuration object defines the core linting rules and settings
   * for all JavaScript and JSX files in the frontend. It combines ESLint's
   * recommended rules with React-specific plugins to ensure code quality
   * and consistency across the entire React application.
   *
   * Why this configuration?
   * - Comprehensive coverage: Lints all source files with appropriate rules
   * - React optimization: Specialized rules for React components and hooks
   * - Modern JavaScript: Supports latest ECMAScript features and syntax
   * - Development workflow: Integrates with Vite and hot module replacement
   * - Code quality: Prevents common mistakes and enforces best practices
   *
   * @type {Object}
   */
  {
    /**
     * File patterns that this configuration applies to.
     *
     * This array specifies which files should be linted using this configuration.
     * The pattern covers all JavaScript and JSX files in the project, ensuring
     * comprehensive code quality enforcement across the entire frontend codebase.
     *
     * Why these patterns?
     * - All JS/JSX files: Covers all JavaScript and JSX files recursively
     * - Source files only: Excludes build output and configuration files
     * - React support: Includes JSX files for React component linting
     * - Comprehensive: Ensures no source files are missed
     *
     * @type {string[]}
     */
    files: ['**/*.{js,jsx}'],

    /**
     * Language options for JavaScript parsing and execution environment.
     *
     * This configuration defines the JavaScript environment and parsing options
     * for ESLint. It sets up modern JavaScript support with JSX capabilities
     * and browser globals, ensuring proper parsing of React components and
     * modern JavaScript features.
     *
     * Why these settings?
     * - ecmaVersion 2020: Supports modern JavaScript features used in the app
     * - browser globals: Provides access to window, document, and other browser APIs
     * - JSX support: Enables proper parsing of React component syntax
     * - Module system: Supports ES6 import/export syntax
     *
     * @type {Object}
     */
    languageOptions: {
      /**
       * ECMAScript version for JavaScript parsing.
       *
       * Set to 2020 to support modern JavaScript features like optional chaining,
       * nullish coalescing, and other ES2020 features used throughout the application.
       *
       * @type {number}
       */
      ecmaVersion: 2020,

      /**
       * Global variables available in the browser environment.
       *
       * Provides access to browser-specific globals like window, document,
       * console, and other browser APIs that are commonly used in React
       * applications for DOM manipulation and debugging.
       *
       * @type {Object}
       */
      globals: globals.browser,

      /**
       * Parser options for advanced JavaScript features.
       *
       * This configuration enables support for the latest JavaScript features
       * and JSX syntax, ensuring proper parsing of modern React components
       * and ES6+ code patterns used throughout the application.
       *
       * @type {Object}
       */
      parserOptions: {
        /**
         * Latest ECMAScript version for parser features.
         *
         * Uses 'latest' to ensure support for the most recent JavaScript
         * features and syntax, providing the best development experience
         * with modern JavaScript patterns.
         *
         * @type {string}
         */
        ecmaVersion: 'latest',

        /**
         * ECMAScript features to enable during parsing.
         *
         * Enables JSX support for proper parsing of React component syntax,
         * allowing ESLint to understand and lint JSX elements, components,
         * and React-specific patterns.
         *
         * @type {Object}
         * @property {boolean} jsx - Enable JSX syntax support
         */
        ecmaFeatures: { jsx: true },

        /**
         * Source type for module system support.
         *
         * Set to 'module' to support ES6 import/export syntax used throughout
         * the application, ensuring proper parsing of modern JavaScript
         * module patterns.
         *
         * @type {string}
         */
        sourceType: 'module',
      },
    },

    /**
     * ESLint plugins for React-specific linting rules.
     *
     * This configuration includes plugins that provide specialized linting
     * rules for React applications, ensuring proper usage of React hooks,
     * component patterns, and development workflow integration.
     *
     * Why these plugins?
     * - react-hooks: Enforces proper React hooks usage and dependencies
     * - react-refresh: Integrates with Vite's hot module replacement
     * - React best practices: Prevents common React mistakes and anti-patterns
     * - Development workflow: Enhances the development experience with React
     *
     * @type {Object}
     */
    plugins: {
      /**
       * React Hooks plugin for enforcing hooks rules.
       *
       * This plugin provides essential rules for proper React hooks usage,
       * including dependency array validation, hook call order, and other
       * hooks-specific best practices that prevent common React mistakes.
       *
       * @type {Object}
       */
      'react-hooks': reactHooks,

      /**
       * React Refresh plugin for development workflow integration.
       *
       * This plugin integrates with Vite's hot module replacement system,
       * ensuring that React components can be safely updated during development
       * without losing component state or causing runtime errors.
       *
       * @type {Object}
       */
      'react-refresh': reactRefresh,
    },

    /**
     * ESLint rules configuration combining recommended and custom rules.
     *
     * This configuration combines ESLint's recommended rules with React-specific
     * rules and custom configurations to ensure comprehensive code quality
     * enforcement. The rules are designed to prevent common mistakes while
     * maintaining development productivity.
     *
     * Why these rules?
     * - Recommended rules: Industry-standard JavaScript best practices
     * - React hooks rules: Prevents common hooks mistakes and anti-patterns
     * - Custom configurations: Tailored for the specific needs of this application
     * - Development workflow: Balances strictness with developer productivity
     *
     * @type {Object}
     */
    rules: {
      /**
       * Spread operator to include all recommended JavaScript rules.
       *
       * This includes ESLint's recommended rules which provide a solid
       * foundation of JavaScript best practices and common error prevention.
       * These rules catch potential bugs and enforce consistent coding patterns.
       *
       * @type {Object}
       */
      ...js.configs.recommended.rules,

      /**
       * Spread operator to include all recommended React hooks rules.
       *
       * This includes the recommended rules from the react-hooks plugin,
       * which enforce proper usage of React hooks including dependency
       * arrays, hook call order, and other hooks-specific best practices.
       *
       * @type {Object}
       */
      ...reactHooks.configs.recommended.rules,

      /**
       * Custom rule for unused variables with exceptions for constants.
       *
       * This rule prevents unused variables while allowing constants that
       * start with uppercase letters or underscores. This is useful for
       * allowing unused constants that might be used in the future or
       * are part of the public API.
       *
       * Configuration:
       * - Error level: Treats unused variables as errors
       * - Ignore pattern: Allows variables starting with A-Z or underscore
       *
       * @type {Array}
       */
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      /**
       * React Refresh rule for component export validation.
       *
       * This rule ensures that only React components are exported from
       * files, which is important for Vite's hot module replacement to
       * work correctly. It prevents non-component exports that could
       * interfere with the refresh process.
       *
       * Configuration:
       * - Warning level: Shows warnings for non-component exports
       * - Allow constants: Permits constant exports that don't interfere
       *
       * @type {Array}
       */
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
