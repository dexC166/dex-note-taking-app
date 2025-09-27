/**
 * @fileoverview Controller functions for note-related operations in the Dex Note Taking App.
 *
 * This module contains all the business logic for handling note operations including
 * CRUD (Create, Read, Update, Delete) functionality. These controllers act as the
 * bridge between the Express.js routes and the MongoDB database, handling data
 * validation, transformation, and error management.
 *
 * All functions follow the Express.js controller pattern with async/await for
 * database operations and consistent error handling strategies. The controllers
 * work with the Note Mongoose model to perform database operations and return
 * appropriate HTTP responses to the frontend.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import Note from '../models/Note.js';

/**
 * Retrieves all notes from the database, sorted by creation date (newest first).
 *
 * This function fetches all notes from the MongoDB collection and returns them
 * in descending order by creation date. It's designed to provide the most recent
 * notes first, which aligns with typical note-taking app user expectations where
 * users want to see their latest notes at the top of the list.
 *
 * **Why this approach?**
 * - **User experience**: Most recent notes are most relevant to users
 * - **Performance**: Simple query without complex filtering or pagination
 * - **Consistency**: Predictable ordering makes the UI more intuitive
 * - **Error handling**: Graceful fallback to 500 error for any database issues
 *
 * **Database Operation:**
 * - Uses `Note.find()` to retrieve all documents
 * - Sorts by `createdAt: -1` for descending order (newest first)
 * - No filtering or pagination (suitable for personal note-taking app)
 *
 * **Error Handling:**
 * - Catches any database connection or query errors
 * - Returns generic 500 error to avoid exposing internal details
 * - Maintains consistent error response format across all endpoints
 *
 * @async
 * @function getAllNotes
 * @param {Object} _ - Express request object (unused, hence underscore)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with notes array or error
 *
 * @example
 * // Called by GET /api/notes route
 * // Returns: [{ _id: "...", title: "Note 1", content: "...", createdAt: "...", updatedAt: "..." }]
 *
 * @see {@link ../routes/notesRoutes.js} Route that calls this function
 * @see {@link ../../frontend/src/pages/HomePage.jsx} Frontend that consumes this data
 * @see {@link ../models/Note.js} Note model used for database operations
 */
export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // -1 will sort in desc. order (newest first)
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Retrieves a specific note by its MongoDB ObjectId.
 *
 * This function fetches a single note from the database using the ID provided
 * in the URL parameters. It's used for displaying and editing individual notes
 * in the frontend. The function includes proper error handling for both
 * "note not found" scenarios and database connection issues.
 *
 * **Why this approach?**
 * - **Direct lookup**: Uses MongoDB's efficient `findById` method
 * - **Explicit 404 handling**: Distinguishes between "not found" and server errors
 * - **Consistent responses**: Returns the note object directly for easy frontend consumption
 * - **Error safety**: Catches invalid ObjectId formats and database errors
 *
 * **Database Operation:**
 * - Uses `Note.findById()` for efficient single document retrieval
 * - Handles both valid ObjectIds that don't exist and invalid ObjectId formats
 * - Returns the complete note object with all fields (title, content, timestamps)
 *
 * **Error Handling:**
 * - Returns 404 for notes that don't exist (valid ObjectId but no match)
 * - Returns 500 for database connection issues or invalid ObjectId formats
 * - Maintains consistent error message format across all endpoints
 *
 * @async
 * @function getNoteById
 * @param {Object} req - Express request object
 * @param {string} req.params.id - MongoDB ObjectId of the note to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with note object or error
 *
 * @example
 * // Called by GET /api/notes/:id route
 * // Returns: { _id: "...", title: "Note Title", content: "...", createdAt: "...", updatedAt: "..." }
 * // Or 404: { message: "Note not found!" }
 *
 * @see {@link ../routes/notesRoutes.js} Route that calls this function
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend that consumes this data
 * @see {@link ../models/Note.js} Note model used for database operations
 */
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found!' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Creates a new note in the database with the provided title and content.
 *
 * This function creates a new note instance using the Mongoose model and saves
 * it to the database. It extracts the title and content from the request body
 * and relies on Mongoose schema validation to ensure data integrity. The function
 * returns the complete saved note object including the generated MongoDB ObjectId
 * and automatic timestamps.
 *
 * **Why this approach?**
 * - **Schema validation**: Leverages Mongoose schema to validate required fields
 * - **Automatic timestamps**: Mongoose automatically adds createdAt and updatedAt
 * - **Complete response**: Returns the full saved object for frontend state management
 * - **Error handling**: Catches validation errors and database connection issues
 *
 * **Database Operation:**
 * - Creates new Note instance with provided title and content
 * - Uses `note.save()` to persist to database with validation
 * - Mongoose automatically generates ObjectId and timestamps
 * - Returns the complete saved document for frontend consumption
 *
 * **Data Validation:**
 * - Title and content are required fields (enforced by Mongoose schema)
 * - Mongoose will throw validation errors for missing required fields
 * - These validation errors are caught and returned as 500 errors
 *
 * **Error Handling:**
 * - Catches Mongoose validation errors (missing required fields)
 * - Catches database connection and save operation errors
 * - Returns generic 500 error to avoid exposing internal validation details
 *
 * @async
 * @function createNote
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing note data
 * @param {string} req.body.title - Note title (required by schema)
 * @param {string} req.body.content - Note content (required by schema)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with created note or error
 *
 * @example
 * // Called by POST /api/notes route
 * // Request body: { title: "My Note", content: "Note content here" }
 * // Returns: { _id: "...", title: "My Note", content: "...", createdAt: "...", updatedAt: "..." }
 *
 * @see {@link ../routes/notesRoutes.js} Route that calls this function
 * @see {@link ../../frontend/src/pages/CreatePage.jsx} Frontend that calls this endpoint
 * @see {@link ../models/Note.js} Note model used for validation and persistence
 */
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Updates an existing note's title and content by its MongoDB ObjectId.
 *
 * This function updates a note using MongoDB's `findByIdAndUpdate` method, which
 * provides atomic updates and ensures data consistency. The function updates
 * both title and content fields and returns the updated document with fresh
 * timestamps. It handles both "note not found" scenarios and database errors.
 *
 * **Why this approach?**
 * - **Atomic updates**: `findByIdAndUpdate` ensures the update operation is atomic
 * - **Return updated document**: `new: true` option returns the updated document
 * - **Automatic timestamps**: Mongoose automatically updates the `updatedAt` field
 * - **Explicit 404 handling**: Distinguishes between "not found" and server errors
 *
 * **Database Operation:**
 * - Uses `Note.findByIdAndUpdate()` for atomic update operation
 * - Updates both title and content fields in a single operation
 * - `new: true` option returns the updated document instead of the original
 * - Mongoose automatically updates the `updatedAt` timestamp
 *
 * **Update Strategy:**
 * - Updates only the fields provided in the request body
 * - Preserves other fields (like createdAt) that aren't being updated
 * - Uses MongoDB's atomic update to prevent race conditions
 * - Returns the complete updated document for frontend state management
 *
 * **Error Handling:**
 * - Returns 404 if the note with the given ID doesn't exist
 * - Returns 500 for database connection issues or invalid ObjectId formats
 * - Maintains consistent error message format across all endpoints
 *
 * @async
 * @function updateNote
 * @param {Object} req - Express request object
 * @param {string} req.params.id - MongoDB ObjectId of the note to update
 * @param {Object} req.body - Request body containing updated note data
 * @param {string} req.body.title - Updated note title
 * @param {string} req.body.content - Updated note content
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with updated note or error
 *
 * @example
 * // Called by PUT /api/notes/:id route
 * // Request body: { title: "Updated Title", content: "Updated content" }
 * // Returns: { _id: "...", title: "Updated Title", content: "...", createdAt: "...", updatedAt: "..." }
 * // Or 404: { message: "Note not found" }
 *
 * @see {@link ../routes/notesRoutes.js} Route that calls this function
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend that calls this endpoint
 * @see {@link ../models/Note.js} Note model used for database operations
 */
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      {
        new: true,
      }
    );

    if (!updatedNote)
      return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Permanently deletes a note from the database by its MongoDB ObjectId.
 *
 * This function removes a note from the database using MongoDB's `findByIdAndDelete`
 * method, which provides atomic deletion and ensures data consistency. The function
 * handles both "note not found" scenarios and database errors, returning appropriate
 * HTTP status codes and messages.
 *
 * **Why this approach?**
 * - **Atomic deletion**: `findByIdAndDelete` ensures the deletion operation is atomic
 * - **Explicit 404 handling**: Distinguishes between "not found" and server errors
 * - **Confirmation response**: Returns success message to confirm deletion
 * - **Error safety**: Catches invalid ObjectId formats and database errors
 *
 * **Database Operation:**
 * - Uses `Note.findByIdAndDelete()` for atomic deletion operation
 * - Deletes the document and returns the deleted document (if found)
 * - Handles both valid ObjectIds that don't exist and invalid ObjectId formats
 * - Provides immediate feedback on whether the deletion was successful
 *
 * **Deletion Strategy:**
 * - Permanently removes the note from the database
 * - No soft delete or recovery mechanism (suitable for simple note-taking app)
 * - Returns confirmation message for frontend state management
 * - Handles cases where the note might have been deleted by another process
 *
 * **Error Handling:**
 * - Returns 404 if the note with the given ID doesn't exist
 * - Returns 500 for database connection issues or invalid ObjectId formats
 * - Maintains consistent error message format across all endpoints
 *
 * @async
 * @function deleteNote
 * @param {Object} req - Express request object
 * @param {string} req.params.id - MongoDB ObjectId of the note to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success message or error
 *
 * @example
 * // Called by DELETE /api/notes/:id route
 * // Returns: { message: "Note deleted successfully!" }
 * // Or 404: { message: "Note not found" }
 *
 * @see {@link ../routes/notesRoutes.js} Route that calls this function
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend that calls this endpoint
 * @see {@link ../../frontend/src/components/NoteCard.jsx} Frontend that calls this endpoint
 * @see {@link ../models/Note.js} Note model used for database operations
 */
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ message: 'Note deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
