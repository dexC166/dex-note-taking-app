/**
 * @fileoverview Navbar component for the Dex Note Taking App frontend.
 *
 * This component provides the main navigation header for the application,
 * featuring the app branding and primary navigation action. It serves as
 * a consistent header element that appears across different pages and
 * provides users with easy access to the note creation functionality.
 *
 * Key Features:
 * - App branding with responsive typography
 * - Primary action button for note creation
 * - Responsive design for all screen sizes
 * - Consistent styling with DaisyUI theme
 * - Mobile-optimized button text and sizing
 * - Clean, minimal design focused on functionality
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';

/**
 * Navbar component that provides the main navigation header.
 *
 * This component serves as the primary navigation element in the application,
 * displaying the app title and providing quick access to the note creation
 * functionality. It's designed with a clean, minimal approach that focuses
 * on essential navigation while maintaining visual consistency across the app.
 *
 * Why this component structure?
 * - Single responsibility: Focuses solely on navigation and branding
 * - Consistent placement: Appears at the top of pages for easy access
 * - User experience: Provides clear app identity and primary action
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 * - Visual hierarchy: Establishes clear branding and navigation patterns
 *
 * Design Philosophy:
 * - Minimalist approach: Only essential elements for clean interface
 * - Brand consistency: App title establishes clear app identity
 * - Action-oriented: Primary button for most common user action (creating notes)
 * - Mobile-first: Responsive design that works well on all devices
 * - Accessibility: Clear visual hierarchy and touch-friendly buttons
 *
 * Responsive Behavior:
 * - Text sizing: Scales from lg to xl to 2xl across breakpoints
 * - Button sizing: Scales from sm to md for better touch targets
 * - Button text: Shows full text on larger screens, abbreviated on mobile
 * - Icon sizing: Scales appropriately for different screen sizes
 *
 * @returns {JSX.Element} The navigation header component
 *
 * @see {@link ../pages/HomePage.jsx} HomePage component that uses this navbar
 * @see {@link ../pages/CreatePage.jsx} CreatePage that this navbar links to
 * @see {@link ../App.jsx} App component that provides routing context
 */
const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-2.5 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* App title with responsive typography and branding */}
          {/* Mobile: Shows shorter "Dex-Note" | Desktop: Shows full name */}
          <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-primary font-mono tracking-tight flex-shrink truncate">
            <span className="block sm:hidden">Dex-Note</span>
            <span className="hidden sm:block">Dex-Note-Taking-App</span>
          </h1>
          {/* Primary action button for creating new notes */}
          <Link
            to={'/create'}
            className="btn btn-primary btn-sm sm:btn-md flex-shrink-0 min-w-fit"
          >
            <PlusIcon className="size-4 sm:size-5" />
            <span className="hidden sm:inline">New Note</span>
            <span className="inline sm:hidden">New</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
