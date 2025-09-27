/**
 * @fileoverview NotesNotFound component for the Dex Note Taking App frontend.
 *
 * This component provides an empty state interface that displays when no notes
 * exist in the application. It serves as a user-friendly way to handle the
 * empty state scenario by providing visual feedback, encouraging messaging,
 * and a clear call-to-action to create the first note. The component is
 * designed with a mobile-first responsive approach and provides an engaging
 * user experience for new users.
 *
 * Key Features:
 * - Empty state visual design with icon and messaging
 * - Encouraging copy to motivate note creation
 * - Call-to-action button linking to note creation
 * - Responsive design for all screen sizes
 * - Consistent styling with application theme
 * - User-friendly guidance for new users
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { NotebookIcon } from 'lucide-react';
import { Link } from 'react-router';

/**
 * NotesNotFound component that displays an empty state when no notes exist.
 *
 * This component serves as a user-friendly empty state interface that appears
 * when the user has no notes in their collection. It provides visual feedback,
 * encouraging messaging, and a clear path forward for users to create their
 * first note. The component is designed to be engaging and helpful rather
 * than just showing a blank space.
 *
 * Why this component structure?
 * - Empty state handling: Provides a better user experience than blank space
 * - User guidance: Helps new users understand what to do next
 * - Visual appeal: Uses icons and styling to create an engaging interface
 * - Call-to-action: Provides a clear path forward for users
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 * - Consistent branding: Maintains visual consistency with the application theme
 *
 * Design Philosophy:
 * - User-centric: Focuses on helping users understand and take action
 * - Encouraging: Uses positive messaging to motivate note creation
 * - Visual hierarchy: Clear structure with icon, heading, description, and action
 * - Accessibility: Proper contrast and touch-friendly button sizing
 * - Responsive: Adapts gracefully to different screen sizes
 *
 * Empty State Best Practices:
 * - Clear messaging: Explains what the empty state means
 * - Visual indicator: Uses an icon to represent the empty state
 * - Action guidance: Provides a clear next step for users
 * - Encouraging tone: Motivates users to take action
 * - Consistent styling: Matches the application's design system
 *
 * @returns {JSX.Element} The empty state component with icon, message, and action
 *
 * @see {@link ../pages/HomePage.jsx} HomePage component that displays this empty state
 * @see {@link ../pages/CreatePage.jsx} CreatePage that this component links to
 * @see {@link ../App.jsx} App component that provides routing context
 */
const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 sm:space-y-6 max-w-md mx-auto text-center px-4">
      {/* Icon container with primary color background */}
      <div className="bg-primary/10 rounded-full p-6 sm:p-8">
        <NotebookIcon className="size-8 sm:size-10 text-primary" />
      </div>
      {/* Main heading with responsive typography */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold">No notes yet</h3>
      {/* Encouraging description with responsive typography */}
      <p className="text-base-content/70 text-sm sm:text-base">
        Ready to organize your thoughts? Create your first note to get started
        on your journey.
      </p>
      {/* Call-to-action button linking to note creation */}
      <Link to="/create" className="btn btn-primary">
        Create Your First Note
      </Link>
    </div>
  );
};

export default NotesNotFound;
