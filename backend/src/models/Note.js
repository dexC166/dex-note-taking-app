/**
 * @fileoverview Mongoose model definition for Note documents in the Dex Note Taking App.
 *
 * This module defines the Note schema and model using Mongoose ODM for MongoDB.
 * The schema establishes the structure, validation rules, and behavior for note
 * documents stored in the database. It serves as the foundation for all note-related
 * database operations throughout the application.
 *
 * The schema is designed to be simple yet effective for a personal note-taking
 * application, focusing on essential fields while leveraging Mongoose's built-in
 * features for data validation and automatic timestamp management.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import mongoose from 'mongoose';

/**
 * Mongoose schema definition for Note documents.
 *
 * This schema defines the structure and validation rules for note documents
 * in the MongoDB database. It establishes the required fields and their types,
 * ensuring data integrity at the database level. The schema is designed to
 * be simple yet comprehensive for a personal note-taking application.
 *
 * **Why this schema design?**
 * - **Simplicity**: Only essential fields for a note-taking app (title, content)
 * - **Validation**: Required fields prevent empty or invalid notes
 * - **Timestamps**: Automatic tracking of creation and modification times
 * - **Flexibility**: String types allow for various content lengths and formats
 * - **Consistency**: Standardized structure across all note operations
 *
 * **Schema Fields:**
 * - **title**: Required string field for note titles
 * - **content**: Required string field for note content/body
 * - **createdAt**: Automatically added timestamp when note is created
 * - **updatedAt**: Automatically updated timestamp when note is modified
 * - **_id**: Automatically generated MongoDB ObjectId (primary key)
 *
 * **Validation Rules:**
 * - Both title and content are required fields
 * - Mongoose will throw validation errors if either field is missing
 * - Empty strings are considered valid (client-side validation handles this)
 * - No length limits (suitable for personal note-taking use case)
 *
 * **Automatic Features:**
 * - **Timestamps**: Mongoose automatically manages createdAt and updatedAt
 * - **ObjectId**: MongoDB automatically generates unique _id for each document
 * - **Validation**: Mongoose validates data before saving to database
 *
 * @type {mongoose.Schema}
 *
 * @example
 * // Creating a new note
 * const note = new Note({
 *   title: "My Note Title",
 *   content: "This is the note content..."
 * });
 *
 * // The resulting document will have:
 * // {
 * //   _id: ObjectId("..."),
 * //   title: "My Note Title",
 * //   content: "This is the note content...",
 * //   createdAt: Date("..."),
 * //   updatedAt: Date("...")
 * // }
 *
 * @see {@link ../controllers/notesController.js} Controllers that use this model
 * @see {@link ../../frontend/src/pages/HomePage.jsx} Frontend that displays this data
 * @see {@link ../../frontend/src/components/NoteCard.jsx} Frontend component that uses note data
 * @see {@link https://mongoosejs.com/docs/guide.html} Mongoose schema documentation
 */
const noteSchema = new mongoose.Schema(
  {
    /**
     * Note title field.
     *
     * This field stores the title or heading of the note. It's required
     * to ensure every note has a descriptive identifier. The frontend
     * uses this field for display in note cards and detail views.
     *
     * @type {String}
     * @required
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * Note content field.
     *
     * This field stores the main body content of the note. It's required
     * to ensure every note has actual content. The frontend uses this field
     * for displaying note content in cards and detail views.
     *
     * @type {String}
     * @required
     */
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

/**
 * Mongoose model for Note documents.
 *
 * This model provides the interface for interacting with note documents
 * in the MongoDB database. It's used by all controller functions to perform
 * CRUD operations on notes. The model automatically handles validation,
 * timestamps, and provides methods for database operations.
 *
 * **Model Features:**
 * - **Validation**: Enforces schema rules before saving to database
 * - **Methods**: Provides find, create, update, delete operations
 * - **Timestamps**: Automatically manages createdAt and updatedAt fields
 * - **Type Safety**: Ensures data consistency across the application
 *
 * **Common Operations:**
 * - `Note.find()` - Retrieve multiple notes
 * - `Note.findById()` - Retrieve a single note by ID
 * - `new Note({...}).save()` - Create a new note
 * - `Note.findByIdAndUpdate()` - Update an existing note
 * - `Note.findByIdAndDelete()` - Delete a note
 *
 * @type {mongoose.Model}
 *
 * @example
 * // Find all notes
 * const notes = await Note.find().sort({ createdAt: -1 });
 *
 * // Create a new note
 * const note = new Note({ title: "Title", content: "Content" });
 * await note.save();
 *
 * // Find by ID
 * const note = await Note.findById(noteId);
 *
 * @see {@link ../controllers/notesController.js} Controllers that use this model
 * @see {@link ../../frontend/src/pages/HomePage.jsx} Frontend that consumes note data
 * @see {@link ../../frontend/src/pages/NoteDetailPage.jsx} Frontend that displays individual notes
 * @see {@link https://mongoosejs.com/docs/models.html} Mongoose model documentation
 */
const Note = mongoose.model('Note', noteSchema);

export default Note;
