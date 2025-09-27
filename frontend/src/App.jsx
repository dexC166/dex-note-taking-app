/**
 * @fileoverview Main App component for the Dex Note Taking App frontend.
 *
 * This component serves as the root of the application's component tree and
 * defines the main layout structure, routing configuration, and visual design.
 * It acts as the central hub that orchestrates all page components and provides
 * a consistent layout and navigation experience throughout the application.
 *
 * Key Features:
 * - Client-side routing with React Router
 * - Custom radial gradient background design
 * - Responsive layout with full-screen coverage
 * - Three main application routes (Home, Create, Note Detail)
 * - Consistent visual design across all pages
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { Route, Routes } from 'react-router';

import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';

/**
 * Main App component that serves as the root of the application.
 *
 * This component defines the overall structure and routing for the note-taking
 * application. It provides a consistent layout with a custom background gradient
 * and handles navigation between the three main pages: notes list, note creation,
 * and note editing.
 *
 * Why this structure?
 * - Single responsibility: Focuses on routing and layout, delegates functionality to pages
 * - Consistent design: Provides unified background and layout across all pages
 * - Clean separation: Each page component handles its own specific functionality
 * - Responsive design: Uses Tailwind classes for mobile-first responsive layout
 * - Visual hierarchy: Background gradient creates depth and visual interest
 *
 * Application Routes:
 * - "/" (HomePage): Displays list of notes with navigation and rate limiting
 * - "/create" (CreatePage): Form for creating new notes with validation
 * - "/note/:id" (NoteDetailPage): Edit and delete individual notes
 *
 * @returns {JSX.Element} The main application component with routing and layout
 *
 * @see {@link ./pages/HomePage.jsx} Home page component for notes list
 * @see {@link ./pages/CreatePage.jsx} Create page component for new notes
 * @see {@link ./pages/NoteDetailPage.jsx} Detail page component for note editing
 * @see {@link ../main.jsx} Main entry point that renders this component
 */
const App = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Custom radial gradient background for visual appeal */}
      <div className="fixed inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#1864ab_100%)]" />

      {/* Main routing configuration for the application */}
      <Routes>
        {/* Home page route - displays notes list and navigation */}
        <Route path="/" element={<HomePage />} />

        {/* Create page route - form for creating new notes */}
        <Route path="/create" element={<CreatePage />} />

        {/* Note detail page route - edit and delete individual notes */}
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
