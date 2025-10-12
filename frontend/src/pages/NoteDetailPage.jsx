/**
 * @fileoverview NoteDetailPage component for the Dex Note Taking App frontend.
 *
 * This component provides a comprehensive interface for viewing, editing, and
 * deleting individual notes. It handles the complete note management workflow
 * including fetching note data, form editing, validation, API communication,
 * and user feedback through toast notifications. The component is designed
 * with a mobile-first responsive approach and provides an intuitive user
 * experience for note modification.
 *
 * Key Features:
 * - Dynamic note fetching based on URL parameters
 * - Editable form fields for title and content
 * - Form validation for required fields
 * - API integration for update and delete operations
 * - Loading states with visual indicators
 * - Confirmation dialogs for destructive actions
 * - Responsive design for all screen sizes
 * - Navigation back to home page
 * - Toast notifications for user feedback
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from 'lucide-react';

/**
 * NoteDetailPage component that provides a comprehensive note editing interface.
 *
 * This component serves as the note editing and management interface in the
 * application, allowing users to view, edit, and delete individual notes.
 * It handles the complete note management workflow including data fetching,
 * form editing, validation, API communication, and user feedback.
 *
 * Why this component structure?
 * - Single responsibility: Focuses solely on note editing and management
 * - Form management: Centralizes form state and validation logic
 * - User experience: Provides clear feedback and loading states
 * - Error handling: Distinguishes between different error types
 * - Navigation: Seamlessly integrates with React Router for navigation
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 *
 * URL Parameter Handling:
 * - Uses useParams to extract note ID from the URL
 * - Fetches note data based on the ID parameter
 * - Re-fetches data when the ID parameter changes
 *
 * Form Validation:
 * - Client-side: Checks for empty or whitespace-only fields
 * - Server-side: Backend validates required fields using Mongoose schema
 * - User feedback: Shows appropriate error messages for validation failures
 *
 * API Integration:
 * - GET request to /notes/:id for fetching note data
 * - PUT request to /notes/:id for updating note
 * - DELETE request to /notes/:id for deleting note
 * - Handles success responses with navigation to home page
 * - Handles errors with appropriate user feedback
 *
 * @returns {JSX.Element} The note detail page component with editing form
 *
 * @see {@link ../App.jsx} App component that renders this as the /note/:id route
 * @see {@link ../lib/axios.js} API client used for backend communication
 * @see {@link ../../backend/src/controllers/notesController.js} Backend note controllers
 * @see {@link ../../backend/src/routes/notesRoutes.js} Backend note routes
 */
const NoteDetailPage = () => {
  /**
   * State for storing the current note data.
   *
   * This state holds the complete note object fetched from the API and
   * is used to populate the form fields. It's updated when the user
   * modifies the form inputs and is sent to the API for updates.
   *
   * Why use this state?
   * - Form data: Provides the source of truth for form field values
   * - Real-time updates: Allows immediate UI updates when user types
   * - API integration: Contains the data structure expected by the backend
   * - User experience: Enables seamless editing experience
   *
   * @type {Object|null}
   */
  const [note, setNote] = useState(null);

  /**
   * State for tracking the initial note fetch loading status.
   *
   * This state is used to show a loading spinner while the note is being
   * fetched from the API. It provides visual feedback to users and
   * prevents interaction with the form during the loading process.
   *
   * Why track loading state?
   * - User feedback: Shows that the note is being loaded
   * - UI control: Determines whether to show loading spinner or form
   * - User experience: Prevents confusion about why the form isn't visible
   * - Performance: Indicates when async operations are in progress
   *
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * State for tracking the note save operation loading status.
   *
   * This state is used to show a loading spinner and disable the save
   * button while the note is being updated. It provides visual feedback
   * to users and prevents multiple form submissions during API calls.
   *
   * Why track saving state separately?
   * - User feedback: Shows that the form is being saved
   * - UI control: Disables save button to prevent double submissions
   * - User experience: Prevents confusion about form submission status
   * - Performance: Indicates when async operations are in progress
   *
   * @type {boolean}
   */
  const [saving, setSaving] = useState(false);

  /**
   * React Router navigation hook for programmatic navigation.
   *
   * This hook provides the navigate function for programmatic navigation
   * to other routes. It's used to redirect users to the home page after
   * successful note operations (update or delete).
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
   * React Router hook for accessing URL parameters.
   *
   * This hook extracts the note ID from the URL parameter (:id) and
   * is used to fetch the specific note data and make API calls for
   * that particular note.
   *
   * Why use useParams?
   * - URL parameters: Extracts dynamic values from the URL
   * - API integration: Uses the ID for fetching and updating specific notes
   * - React Router integration: Works with the application's routing system
   * - Dynamic routing: Enables the component to work with any note ID
   *
   * @type {Object}
   * @property {string} id - The note ID extracted from the URL parameter
   */
  const { id } = useParams();

  /**
   * useEffect hook for fetching note data on component mount and ID changes.
   *
   * This effect runs when the component mounts and whenever the note ID
   * parameter changes. It fetches the specific note data from the API
   * and updates the component state accordingly.
   *
   * Why use useEffect for data fetching?
   * - Lifecycle management: Runs at the right time (component mount and ID changes)
   * - Dependency control: Re-runs when the ID parameter changes
   * - Error handling: Centralizes error handling for the fetch operation
   * - State management: Updates multiple state variables based on response
   *
   * @see {@link ../lib/axios.js} API client used for the request
   * @see {@link ../../backend/src/controllers/notesController.js} Backend getNoteById controller
   */
  useEffect(() => {
    /**
     * Async function to fetch a specific note from the backend API.
     *
     * This function makes a GET request to the /notes/:id endpoint and
     * handles the response appropriately. It updates the note state
     * with the fetched data and manages the loading state.
     *
     * Why this error handling approach?
     * - User feedback: Shows error message if note fetch fails
     * - State management: Updates loading state regardless of success/failure
     * - User experience: Provides clear feedback about what went wrong
     * - Error recovery: Allows users to try again or navigate away
     *
     * @async
     * @function fetchNote
     * @returns {Promise<void>} Resolves when fetch operation is complete
     */
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch {
        toast.error('Failed to fetch the note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  /**
   * Handles note deletion with confirmation dialog.
   *
   * This function processes the note deletion by showing a confirmation
   * dialog, making an API call to delete the note, and handling the
   * response. It includes user confirmation to prevent accidental deletions.
   *
   * Why this approach?
   * - User confirmation: Prevents accidental deletions with confirmation dialog
   * - User feedback: Shows success message and navigates to home page
   * - Error handling: Shows error message if deletion fails
   * - Navigation: Redirects to home page after successful deletion
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when deletion operation is complete
   *
   * @see {@link ../lib/axios.js} API client used for the request
   * @see {@link ../../backend/src/controllers/notesController.js} Backend deleteNote controller
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  /**
   * Handles note saving with validation and API communication.
   *
   * This function processes the note saving by validating the input
   * data, making an API call to update the note, and handling the
   * response. It includes comprehensive error handling and user feedback.
   *
   * Why this approach?
   * - Validation: Client-side validation before API call
   * - User feedback: Clear success/error messages
   * - Loading states: Manages saving state throughout the process
   * - Navigation: Redirects to home page on successful update
   * - Error handling: Shows appropriate error messages for different scenarios
   *
   * Form Validation Strategy:
   * - Client-side: Checks for empty or whitespace-only fields
   * - Server-side: Backend validates required fields using Mongoose schema
   * - User feedback: Shows appropriate error messages for validation failures
   *
   * @async
   * @function handleSave
   * @returns {Promise<void>} Resolves when save operation is complete
   *
   * @see {@link ../lib/axios.js} API client used for the request
   * @see {@link ../../backend/src/controllers/notesController.js} Backend updateNote controller
   */
  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error('Please add a title or content');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success('Note updated successfully');
      navigate('/');
    } catch {
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  // Loading state with centered spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Navigation and action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            {/* Back to home page link */}
            <Link
              to="/"
              className="btn btn-ghost btn-sm sm:btn-md touch-manipulation"
            >
              <ArrowLeftIcon className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Back to Notes</span>
              <span className="sm:hidden">Back</span>
            </Link>
            {/* Delete note button */}
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline btn-sm sm:btn-md touch-manipulation"
            >
              <Trash2Icon className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Delete Note</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>

          {/* Main form card container */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-5 sm:p-6 md:p-8">
              {/* Title input field */}
              <div className="form-control mb-5 sm:mb-6">
                <label className="label">
                  <span className="label-text text-base sm:text-lg font-medium">
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered text-base w-full"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
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
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              {/* Save button with loading state */}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary btn-md sm:btn-lg text-base sm:text-lg touch-manipulation"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm sm:loading-md"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
