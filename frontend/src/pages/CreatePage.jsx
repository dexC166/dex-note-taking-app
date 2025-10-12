/**
 * @fileoverview CreatePage component for the Dex Note Taking App frontend.
 *
 * This component provides a form interface for creating new notes in the
 * application. It handles form validation, API communication, error handling,
 * and user feedback through toast notifications. The component is designed
 * with a mobile-first responsive approach and provides a clean, intuitive
 * user experience for note creation.
 *
 * Key Features:
 * - Form validation for required fields
 * - API integration with error handling
 * - Rate limiting detection with custom UI feedback
 * - Loading states with visual indicators
 * - Responsive design for all screen sizes
 * - Navigation back to home page
 * - Toast notifications for user feedback
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';

/**
 * CreatePage component that provides a form for creating new notes.
 *
 * This component serves as the note creation interface in the application,
 * allowing users to input note titles and content through a responsive form.
 * It handles the complete note creation workflow including validation,
 * API communication, error handling, and user feedback.
 *
 * Why this component structure?
 * - Single responsibility: Focuses solely on note creation functionality
 * - Form management: Centralizes form state and validation logic
 * - User experience: Provides clear feedback and loading states
 * - Error handling: Distinguishes between different error types
 * - Navigation: Seamlessly integrates with React Router for navigation
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 *
 * Form Validation:
 * - Client-side: Checks for empty or whitespace-only fields
 * - Server-side: Backend validates required fields using Mongoose schema
 * - User feedback: Shows appropriate error messages for validation failures
 *
 * API Integration:
 * - POST request to /notes endpoint with title and content
 * - Handles success response with navigation to home page
 * - Handles rate limiting (429 status) with custom error message
 * - Handles other errors with generic error message
 *
 * @returns {JSX.Element} The create page component with note creation form
 *
 * @see {@link ../App.jsx} App component that renders this as the /create route
 * @see {@link ../lib/axios.js} API client used for backend communication
 * @see {@link ../../backend/src/controllers/notesController.js} Backend createNote controller
 * @see {@link ../../backend/src/models/Note.js} Note model for validation rules
 */
const CreatePage = () => {
  /**
   * State for storing the note title input value.
   *
   * This state manages the title input field value and is updated
   * as the user types. It's used for form validation and API submission.
   * The state is controlled by the input field's onChange handler.
   *
   * Why use controlled input?
   * - Form validation: Enables real-time validation of input values
   * - State management: Provides single source of truth for input value
   * - User experience: Allows for dynamic form behavior and validation
   * - API integration: Ensures clean data is sent to the backend
   *
   * @type {string}
   */
  const [title, setTitle] = useState('');

  /**
   * State for storing the note content input value.
   *
   * This state manages the content textarea value and is updated
   * as the user types. It's used for form validation and API submission.
   * The state is controlled by the textarea's onChange handler.
   *
   * Why use controlled input?
   * - Form validation: Enables real-time validation of input values
   * - State management: Provides single source of truth for input value
   * - User experience: Allows for dynamic form behavior and validation
   * - API integration: Ensures clean data is sent to the backend
   *
   * @type {string}
   */
  const [content, setContent] = useState('');

  /**
   * State for tracking the form submission loading status.
   *
   * This state is used to show a loading spinner and disable the submit
   * button while the note is being created. It provides visual feedback
   * to users and prevents multiple form submissions during API calls.
   *
   * Why track loading state?
   * - User feedback: Shows that the form is being processed
   * - UI control: Disables submit button to prevent double submissions
   * - User experience: Prevents confusion about form submission status
   * - Performance: Indicates when async operations are in progress
   *
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * React Router navigation hook for programmatic navigation.
   *
   * This hook provides the navigate function for programmatic navigation
   * to other routes. It's used to redirect users to the home page after
   * successful note creation.
   *
   * Why use useNavigate?
   * - Programmatic navigation: Allows navigation after successful operations
   * - User experience: Seamlessly redirects users after form submission
   * - React Router integration: Works with the application's routing system
   * - State management: Can pass state or parameters during navigation
   *
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * Handles form submission for creating a new note.
   *
   * This function processes the form submission by validating the input
   * data, making an API call to create the note, and handling the response.
   * It includes comprehensive error handling for different scenarios
   * including rate limiting and validation errors.
   *
   * Why this error handling approach?
   * - Rate limiting: Special handling with custom message and emoji
   * - Validation: Client-side validation before API call
   * - User feedback: Clear error messages for different error types
   * - Navigation: Redirects to home page on successful creation
   * - Loading states: Manages loading state throughout the process
   *
   * Form Validation Strategy:
   * - Client-side: Checks for empty or whitespace-only fields
   * - Server-side: Backend validates required fields using Mongoose schema
   * - User feedback: Shows appropriate error messages for validation failures
   *
   * Error Handling Strategy:
   * - 429 status: Rate limiting with custom message and emoji
   * - Other errors: Generic error message for server issues
   * - Validation: Client-side validation with immediate feedback
   * - Success: Success message and navigation to home page
   *
   * @async
   * @function handleSubmit
   * @param {Event} e - Form submission event
   * @returns {Promise<void>} Resolves when form submission is complete
   *
   * @see {@link ../lib/axios.js} API client used for the request
   * @see {@link ../../backend/src/controllers/notesController.js} Backend createNote controller
   * @see {@link ../../backend/src/middleware/rateLimiter.js} Rate limiting middleware
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/notes', {
        title,
        content,
      });

      toast.success('Note created successfully!');
      navigate('/');
    } catch (error) {
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: '💀',
        });
      } else {
        toast.error('Failed to create note');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Navigation link back to home page */}
          <Link
            to={'/'}
            className="btn btn-ghost btn-sm sm:btn-md mb-5 sm:mb-6 touch-manipulation"
          >
            <ArrowLeftIcon className="size-4 sm:size-5" />
            <span className="hidden sm:inline">Back to Notes</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Main form card container */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-5 sm:p-6 md:p-8">
              <h2 className="card-title text-xl sm:text-2xl md:text-3xl mb-5 sm:mb-6">
                Create New Note
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Title input field */}
                <div className="form-control mb-5 sm:mb-6">
                  <label className="label">
                    <span className="label-text text-base sm:text-lg font-medium">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered text-base w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content textarea field */}
                <div className="form-control mb-6 sm:mb-8">
                  <label className="label">
                    <span className="label-text text-base sm:text-lg font-medium">
                      Content
                    </span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered text-base h-40 sm:h-48 md:h-56 w-full"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Submit button with loading state */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary btn-md sm:btn-lg text-base sm:text-lg touch-manipulation"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm sm:loading-md"></span>
                        Creating...
                      </>
                    ) : (
                      'Create Note'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
