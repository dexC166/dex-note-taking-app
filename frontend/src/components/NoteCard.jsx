/**
 * @fileoverview NoteCard component for the Dex Note Taking App frontend.
 *
 * This component provides a reusable card interface for displaying individual
 * notes in a grid layout. It handles note preview display, navigation to the
 * detail page, and note deletion functionality. The component is designed
 * with a mobile-first responsive approach and provides an intuitive user
 * experience for note management.
 *
 * Key Features:
 * - Note preview with title and content truncation
 * - Navigation to note detail page on click
 * - Delete functionality with confirmation dialog
 * - Responsive design for all screen sizes
 * - Real-time state updates through parent component
 * - Visual indicators for edit and delete actions
 * - Formatted date display using utility functions
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate } from '../lib/utils';
import api from '../lib/axios';
import toast from 'react-hot-toast';

/**
 * NoteCard component that displays individual notes in a card format.
 *
 * This component serves as a reusable card interface for displaying notes
 * in the application's grid layout. It provides note preview functionality,
 * navigation to the detail page, and delete functionality with real-time
 * state updates. The component is designed to work seamlessly within
 * responsive grid layouts and provides an intuitive user experience.
 *
 * Why this component structure?
 * - Reusability: Can be used in any grid layout for note display
 * - Single responsibility: Focuses solely on note card functionality
 * - State management: Updates parent component's notes state when deleting
 * - User experience: Provides clear visual feedback and intuitive interactions
 * - Responsive design: Adapts to different screen sizes with mobile-first approach
 * - Navigation: Seamlessly integrates with React Router for page navigation
 *
 * Props Interface:
 * - note: Complete note object with all fields from the API
 * - setNotes: Function to update the parent component's notes state
 *
 * Note Object Structure:
 * - _id: MongoDB ObjectId for unique identification
 * - title: Note title (required field)
 * - content: Note content/body (required field)
 * - createdAt: Creation timestamp (automatically generated)
 * - updatedAt: Last modification timestamp (automatically generated)
 *
 * @param {Object} props - Component props
 * @param {Object} props.note - Note object containing all note data
 * @param {string} props.note._id - MongoDB ObjectId for unique identification
 * @param {string} props.note.title - Note title for display
 * @param {string} props.note.content - Note content for preview
 * @param {string} props.note.createdAt - Creation timestamp for display
 * @param {string} props.note.updatedAt - Last modification timestamp
 * @param {Function} props.setNotes - Function to update parent component's notes state
 * @returns {JSX.Element} The note card component with preview and actions
 *
 * @see {@link ../pages/HomePage.jsx} HomePage component that uses this card
 * @see {@link ../lib/utils.js} formatDate utility function for date formatting
 * @see {@link ../lib/axios.js} API client for delete operations
 * @see {@link ../../backend/src/models/Note.js} Note model for data structure
 */
const NoteCard = ({ note, setNotes }) => {
  /**
   * Handles note deletion with confirmation dialog and state updates.
   *
   * This function processes the note deletion by preventing the default
   * navigation behavior, showing a confirmation dialog, making an API
   * call to delete the note, and updating the parent component's state
   * to reflect the deletion immediately.
   *
   * Why this approach?
   * - Event prevention: Prevents navigation when delete button is clicked
   * - User confirmation: Prevents accidental deletions with confirmation dialog
   * - State management: Updates parent component's notes state immediately
   * - User feedback: Shows success/error messages for operation feedback
   * - Real-time updates: Provides immediate UI feedback without page refresh
   *
   * State Update Strategy:
   * - Filters out the deleted note from the parent's notes array
   * - Uses functional update to ensure state consistency
   * - Provides immediate UI feedback without API refetch
   * - Maintains data consistency between parent and child components
   *
   * @async
   * @function handleDelete
   * @param {Event} e - Click event from the delete button
   * @param {string} id - MongoDB ObjectId of the note to delete
   * @returns {Promise<void>} Resolves when deletion operation is complete
   *
   * @see {@link ../lib/axios.js} API client used for the delete request
   * @see {@link ../../backend/src/controllers/notesController.js} Backend deleteNote controller
   */
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success('Note deleted successfully');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#66d9e8] h-full"
    >
      <div className="card-body p-3 sm:p-4">
        {/* Note title with responsive typography and text truncation */}
        <h3 className="card-title text-base sm:text-lg line-clamp-2">
          {note.title}
        </h3>
        {/* Note content preview with responsive typography and text truncation */}
        <p className="text-base-content/70 line-clamp-3 text-xs sm:text-sm">
          {note.content}
        </p>
        {/* Card actions with date display and action buttons */}
        <div className="card-actions justify-between items-center mt-3 sm:mt-4">
          {/* Formatted creation date */}
          <span className="text-xs sm:text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          {/* Action buttons for edit indicator and delete */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Edit icon indicator */}
            <PenSquareIcon className="size-3 sm:size-4 text-base-content/60" />
            {/* Delete button with confirmation */}
            <button
              className="btn btn-ghost btn-xs text-error p-1 sm:p-2"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-3 sm:size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
