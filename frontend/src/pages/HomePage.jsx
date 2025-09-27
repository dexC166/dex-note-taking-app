/**
 * @fileoverview HomePage component for the Dex Note Taking App frontend.
 *
 * This component serves as the main landing page of the application, displaying
 * all notes in a responsive grid layout. It handles the complete note management
 * workflow including fetching notes from the API, managing loading states,
 * handling rate limiting, and providing a clean user interface for note browsing.
 *
 * Key Features:
 * - Responsive grid layout for note display
 * - Rate limiting detection and user feedback
 * - Loading states with visual indicators
 * - Empty state handling with custom UI
 * - Real-time note updates through state management
 * - Mobile-first responsive design
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import { useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';

/**
 * HomePage component that displays all notes in a responsive grid layout.
 *
 * This component is the main landing page of the application and serves as the
 * central hub for note management. It fetches all notes from the backend API,
 * displays them in a responsive grid, and handles various states including
 * loading, rate limiting, and empty states.
 *
 * Why this component structure?
 * - Single responsibility: Focuses on displaying and managing the notes list
 * - State management: Centralizes note state for real-time updates
 * - Error handling: Provides specific handling for rate limiting vs other errors
 * - User experience: Shows appropriate UI for each state (loading, empty, rate limited)
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 *
 * Component States:
 * - Loading: Shows loading spinner while fetching notes
 * - Rate Limited: Shows RateLimitedUI component when API returns 429 status
 * - Empty: Shows NotesNotFound component when no notes exist
 * - Success: Shows grid of NoteCard components with all notes
 *
 * State Management:
 * - notes: Array of note objects from the API
 * - loading: Boolean indicating if notes are being fetched
 * - isRateLimited: Boolean indicating if user has hit rate limits
 *
 * @returns {JSX.Element} The home page component with notes grid and navigation
 *
 * @see {@link ../App.jsx} App component that renders this as the root route
 * @see {@link ../components/NoteCard.jsx} NoteCard component for individual notes
 * @see {@link ../components/RateLimitedUI.jsx} RateLimitedUI component for rate limiting
 * @see {@link ../components/NotesNotFound.jsx} NotesNotFound component for empty state
 * @see {@link ../lib/axios.js} API client for backend communication
 */
const HomePage = () => {
  /**
   * State for tracking rate limiting status.
   *
   * This state is set to true when the API returns a 429 status code,
   * indicating that the user has exceeded the rate limit. When true,
   * the component displays the RateLimitedUI component instead of
   * the notes grid.
   *
   * Why track this separately?
   * - User feedback: Provides clear indication when rate limits are hit
   * - UI control: Determines which component to render
   * - Error distinction: Separates rate limiting from other API errors
   * - User experience: Prevents confusion about why notes aren't loading
   *
   * @type {boolean}
   */
  const [isRateLimited, setIsRateLimited] = useState(false);

  /**
   * State for storing the array of notes from the API.
   *
   * This state holds all notes fetched from the backend API and is
   * used to render the NoteCard components in the grid. The state
   * is updated when notes are successfully fetched and can be
   * modified by child components (like NoteCard) for real-time updates.
   *
   * Why use this state?
   * - Real-time updates: Allows immediate UI updates when notes change
   * - Component communication: Enables child components to update the list
   * - Performance: Avoids unnecessary re-fetches from the API
   * - User experience: Provides instant feedback for user actions
   *
   * @type {Array<Object>}
   */
  const [notes, setNotes] = useState([]);

  /**
   * State for tracking the loading status of the notes fetch operation.
   *
   * This state is used to show a loading spinner while notes are being
   * fetched from the API. It provides visual feedback to users and
   * prevents interaction with the notes list during the loading process.
   *
   * Why track loading state?
   * - User feedback: Shows that the app is working and not frozen
   * - UI control: Determines whether to show loading spinner or notes
   * - User experience: Prevents confusion about why notes aren't visible
   * - Performance: Indicates when async operations are in progress
   *
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * useEffect hook for fetching notes on component mount.
   *
   * This effect runs once when the component mounts and fetches all
   * notes from the backend API. It handles both successful responses
   * and errors, including specific handling for rate limiting (429 status).
   *
   * Why use useEffect for data fetching?
   * - Lifecycle management: Runs at the right time (component mount)
   * - Dependency control: Empty dependency array ensures it runs only once
   * - Error handling: Centralizes error handling for the fetch operation
   * - State management: Updates multiple state variables based on response
   *
   * Error Handling Strategy:
   * - 429 status: Sets isRateLimited to true, shows RateLimitedUI
   * - Other errors: Shows toast notification, keeps isRateLimited false
   * - Success: Updates notes state, resets isRateLimited to false
   *
   * @see {@link ../lib/axios.js} API client used for the request
   * @see {@link ../components/RateLimitedUI.jsx} Component shown when rate limited
   */
  useEffect(() => {
    /**
     * Async function to fetch notes from the backend API.
     *
     * This function makes a GET request to the /notes endpoint and handles
     * the response appropriately. It distinguishes between rate limiting
     * errors (429 status) and other errors, providing appropriate user
     * feedback for each case.
     *
     * Why this error handling approach?
     * - Rate limiting: Special handling with dedicated UI component
     * - Other errors: Generic error message with toast notification
     * - User experience: Clear feedback about what went wrong
     * - State management: Updates relevant state variables based on response
     *
     * @async
     * @function fetchNotes
     * @returns {Promise<void>} Resolves when fetch operation is complete
     */
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error('Failed to load notes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation bar with app title and new note button */}
      <Navbar />

      {/* Rate limiting UI shown when user exceeds API rate limits */}
      {isRateLimited && <RateLimitedUI />}

      {/* Main content area with responsive container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Loading state with spinner and message */}
        {loading && (
          <div className="text-center text-primary py-8 sm:py-10">
            <span className="loading loading-dots loading-lg"></span>
            <p className="mt-2 text-sm sm:text-base">Loading notes...</p>
          </div>
        )}

        {/* Empty state shown when no notes exist and not rate limited */}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {/* Notes grid shown when notes exist and not rate limited */}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
