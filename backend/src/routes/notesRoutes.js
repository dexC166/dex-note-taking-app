/**
 * @fileoverview Express.js router for note-related API endpoints in the Dex Note Taking App.
 *
 * This router defines all CRUD (Create, Read, Update, Delete) operations for managing
 * notes in the application. It provides a RESTful API interface that the frontend
 * uses to interact with the note data stored in MongoDB.
 *
 * The router is mounted at `/api/notes` in the main server, making the endpoints
 * available at `/api/notes/` for collection operations and `/api/notes/:id` for
 * individual note operations. All routes are protected by the global rate limiting
 * middleware applied in server.js.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

/**
 * Express.js router instance for note-related API endpoints.
 *
 * This router handles all HTTP methods and paths related to note operations,
 * providing a clean separation of concerns between routing logic and business
 * logic (which is handled in the controllers).
 *
 * **Why use a separate router?**
 * - **Modularity**: Keeps route definitions organized and maintainable
 * - **Reusability**: Can be easily mounted at different base paths if needed
 * - **Separation of concerns**: Routes focus on HTTP handling, controllers on business logic
 * - **Testability**: Router can be tested independently of the main server
 *
 * **Route Structure:**
 * All routes are relative to the mounting path `/api/notes`:
 * - `GET /` → `GET /api/notes/` (retrieve all notes)
 * - `GET /:id` → `GET /api/notes/:id` (retrieve specific note)
 * - `POST /` → `POST /api/notes/` (create new note)
 * - `PUT /:id` → `PUT /api/notes/:id` (update existing note)
 * - `DELETE /:id` → `DELETE /api/notes/:id` (delete note)
 *
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route handler for retrieving all notes.
 *
 * This endpoint returns all notes in the database, sorted by creation date
 * in descending order (newest first). It's used by the frontend HomePage
 * to display the complete list of notes in a grid layout.
 *
 * **Frontend Usage:**
 * - Called by HomePage on component mount
 * - Used to populate the notes grid display
 * - Handles loading states and error scenarios
 * - Integrates with rate limiting UI for 429 responses
 *
 * @route GET /
 * @returns {Array<Object>} Array of note objects with title, content, and timestamps
 * @see {@link ../controllers/notesController.js#getAllNotes} Controller implementation
 * @see {@link ../../frontend/src/pages/HomePage.jsx} Frontend usage
 */
router.get('/', getAllNotes);

/**
 * Route handler for retrieving a specific note by ID.
 *
 * This endpoint fetches a single note by its MongoDB ObjectId. It's used
 * by the frontend NoteDetailPage to display and edit individual notes.
 * Returns a 404 status if the note is not found.
 *
 * **Frontend Usage:**
 * - Called by NoteDetailPage to load note for editing
 * - Used to populate the note detail form
 * - Handles loading states and error scenarios
 * - Provides navigation back to home page on error
 *
 * @route GET /:id
 * @param {string} id - MongoDB ObjectId of the note to retrieve
 * @returns {Object} Note object with title, content, and timestamps
 * @returns {404} Note not found error
 * @see {@link ../controllers/notesController.js#getNoteById} Controller implementation
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend usage
 */
router.get('/:id', getNoteById);

/**
 * Route handler for creating a new note.
 *
 * This endpoint creates a new note with the provided title and content.
 * It validates the required fields and returns the created note with
 * automatically generated timestamps. Used by the frontend CreatePage
 * for adding new notes to the collection.
 *
 * **Frontend Usage:**
 * - Called by CreatePage when submitting the note creation form
 * - Validates required fields before submission
 * - Shows success toast and navigates to home page
 * - Handles rate limiting with custom error message and emoji
 *
 * @route POST /
 * @param {Object} req.body - Request body containing note data
 * @param {string} req.body.title - Note title (required)
 * @param {string} req.body.content - Note content (required)
 * @returns {Object} Created note object with generated ID and timestamps
 * @returns {201} Note created successfully
 * @see {@link ../controllers/notesController.js#createNote} Controller implementation
 * @see {@link ../../frontend/src/pages/CreatePage.jsx} Frontend usage
 */
router.post('/', createNote);

/**
 * Route handler for updating an existing note.
 *
 * This endpoint updates a note's title and content by its MongoDB ObjectId.
 * It uses findByIdAndUpdate to ensure atomic updates and returns the
 * updated note. Used by the frontend NoteDetailPage for saving changes.
 *
 * **Frontend Usage:**
 * - Called by NoteDetailPage when saving note changes
 * - Validates required fields before submission
 * - Shows success toast and navigates to home page
 * - Handles loading states during save operation
 *
 * @route PUT /:id
 * @param {string} id - MongoDB ObjectId of the note to update
 * @param {Object} req.body - Request body containing updated note data
 * @param {string} req.body.title - Updated note title
 * @param {string} req.body.content - Updated note content
 * @returns {Object} Updated note object with new timestamps
 * @returns {404} Note not found error
 * @see {@link ../controllers/notesController.js#updateNote} Controller implementation
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend usage
 */
router.put('/:id', updateNote);

/**
 * Route handler for deleting a note.
 *
 * This endpoint permanently removes a note from the database by its
 * MongoDB ObjectId. It's used by both the frontend NoteDetailPage
 * and NoteCard component for note deletion with confirmation.
 *
 * **Frontend Usage:**
 * - Called by NoteDetailPage delete button with confirmation
 * - Called by NoteCard delete button with confirmation
 * - Shows success toast and updates UI state
 * - Handles error scenarios gracefully
 *
 * @route DELETE /:id
 * @param {string} id - MongoDB ObjectId of the note to delete
 * @returns {Object} Success message confirming deletion
 * @returns {404} Note not found error
 * @see {@link ../controllers/notesController.js#deleteNote} Controller implementation
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend usage
 * @see {@link ../../frontend/src/components/NoteCard.jsx} Frontend usage
 */
router.delete('/:id', deleteNote);

export default router;
