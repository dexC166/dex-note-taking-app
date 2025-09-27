/**
 * @fileoverview Tailwind CSS configuration for the Dex Note Taking App frontend.
 *
 * This configuration file defines how Tailwind CSS processes and generates utility
 * classes for the React frontend application. It integrates with DaisyUI component
 * library to provide a comprehensive design system with pre-built components and
 * a consistent dark theme. The configuration is optimized for a modern note-taking
 * application with responsive design and accessibility features.
 *
 * Key Features:
 * - Utility-first CSS framework with custom configuration
 * - DaisyUI component library integration for pre-built components
 * - Night theme for consistent dark mode styling
 * - Content scanning for optimal CSS purging
 * - PostCSS integration for build-time processing
 * - Responsive design support for all device sizes
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import daisyui from 'daisyui';

/**
 * Tailwind CSS configuration object for the React frontend application.
 *
 * This configuration uses Tailwind's utility-first approach combined with
 * DaisyUI's component library to create a cohesive design system. The
 * configuration is optimized for a note-taking application with emphasis
 * on readability, accessibility, and responsive design.
 *
 * **Why this approach?**
 * - **Utility-first**: Rapid development with consistent spacing, colors, and typography
 * - **DaisyUI integration**: Pre-built components reduce development time and ensure consistency
 * - **Night theme**: Dark mode provides better user experience for note-taking
 * - **Content scanning**: Optimized CSS purging for smaller bundle sizes
 * - **Responsive design**: Mobile-first approach with breakpoint utilities
 *
 * **Design System:**
 * - **Theme**: Night theme for dark mode with semantic color tokens
 * - **Components**: DaisyUI provides buttons, cards, loading states, and form elements
 * - **Typography**: Tailwind's typography utilities for consistent text styling
 * - **Spacing**: Consistent spacing scale for layout and component spacing
 * - **Colors**: Semantic color system with primary, secondary, and neutral variants
 *
 * **Build Integration:**
 * - **PostCSS**: Processes Tailwind classes during Vite build
 * - **CSS Purging**: Removes unused styles for optimal bundle size
 * - **Development**: Hot reloading for instant style updates
 * - **Production**: Optimized CSS output with vendor prefixes
 *
 * @type {import('tailwindcss').Config}
 *
 * @see {@link ./postcss.config.js} PostCSS configuration for Tailwind processing
 * @see {@link ./vite.config.js} Vite configuration that processes this file
 * @see {@link ./src/index.css} Main CSS file that imports Tailwind directives
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS configuration documentation
 * @see {@link https://daisyui.com/docs/config/} DaisyUI configuration documentation
 */
export default {
  /**
   * Content paths for Tailwind CSS class scanning and purging.
   *
   * This array tells Tailwind which files to scan for CSS classes. During
   * the build process, Tailwind will only include the utility classes that
   * are actually used in these files, resulting in a smaller CSS bundle.
   *
   * Why these paths?
   * - index.html: Contains the main HTML structure and any inline classes
   * - src directory: All JavaScript/TypeScript files in the src directory
   * - File extensions: Covers all possible file types that might contain Tailwind classes
   * - Recursive scanning: The pattern ensures all subdirectories are included
   *
   * Optimization Benefits:
   * - CSS Purging: Unused styles are automatically removed
   * - Bundle Size: Smaller CSS files for faster loading
   * - Performance: Only necessary styles are included in production
   * - Maintenance: No need to manually manage which styles to include
   *
   * @type {string[]}
   */
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  /**
   * Tailwind theme configuration with custom extensions.
   *
   * The theme object allows customization of Tailwind's default design tokens.
   * Currently using the default theme with no extensions, which means the
   * application relies on Tailwind's well-designed default values and DaisyUI's
   * theme system for customization.
   *
   * Why minimal theme configuration?
   * - Default values: Tailwind's defaults are well-researched and consistent
   * - DaisyUI theming: DaisyUI provides comprehensive theme customization
   * - Maintainability: Less custom configuration means easier updates
   * - Consistency: Standard values ensure predictable behavior
   *
   * Future Extensions:
   * - Custom colors, fonts, or spacing can be added here if needed
   * - DaisyUI theme system handles most customization requirements
   * - Tailwind's extend property allows adding new values without overriding defaults
   *
   * @type {Object}
   */
  theme: {
    extend: {},
  },

  /**
   * Tailwind CSS plugins configuration.
   *
   * This array includes the DaisyUI plugin, which extends Tailwind with
   * pre-built component classes and a comprehensive design system. DaisyUI
   * provides semantic component classes that work seamlessly with Tailwind's
   * utility classes.
   *
   * DaisyUI Benefits:
   * - Pre-built components: Buttons, cards, modals, forms, and more
   * - Semantic classes: Meaningful class names like btn-primary and card
   * - Theme integration: Components automatically adapt to the selected theme
   * - Accessibility: Built-in accessibility features and ARIA attributes
   * - Consistency: Unified design language across all components
   *
   * Component Examples Used in App:
   * - btn btn-primary: Primary action buttons like "New Note" button
   * - loading loading-dots: Loading spinners and states
   * - card: Note cards and content containers
   * - bg-base-300: Background colors for navigation and sections
   * - text-primary: Primary text color for headings and accents
   *
   * @type {Array<Plugin>}
   *
   * @see {@link https://daisyui.com/components/} DaisyUI component documentation
   * @see {@link https://daisyui.com/docs/install/} DaisyUI installation and setup
   */
  plugins: [daisyui],

  /**
   * DaisyUI-specific configuration options.
   *
   * This object configures DaisyUI's behavior and theme selection. The
   * configuration is minimal but essential for the application's visual
   * consistency and user experience.
   *
   * Theme Selection:
   * - Night theme: Dark mode theme optimized for note-taking applications
   * - Consistent colors: Semantic color tokens that work across all components
   * - Accessibility: High contrast ratios for better readability
   * - User experience: Dark mode reduces eye strain during extended use
   *
   * Why Night Theme?
   * - Note-taking context: Dark backgrounds are easier on the eyes for reading
   * - Modern aesthetic: Dark themes are popular in modern applications
   * - Battery life: Dark themes can save battery on OLED displays
   * - Focus: Dark backgrounds help users focus on content
   *
   * Theme Features:
   * - Semantic colors: primary, secondary, accent, neutral, base
   * - Component variants: Different styles for buttons, cards, and form elements
   * - Responsive design: Theme works across all device sizes
   * - Accessibility: WCAG compliant color contrasts and focus states
   *
   * @type {Object}
   * @property {string[]} themes - Array of theme names to enable
   *
   * @see {@link https://daisyui.com/docs/themes/} DaisyUI theme documentation
   * @see {@link https://daisyui.com/docs/config/} DaisyUI configuration options
   */
  daisyui: {
    themes: ['night'],
  },
};
