/**
 * @fileoverview Database connection configuration for the Dex Note Taking App.
 *
 * This module handles the MongoDB database connection using Mongoose ODM. It provides
 * a centralized way to establish and manage the database connection that is used
 * throughout the application for storing and retrieving note data.
 *
 * The connection uses MongoDB Atlas (cloud database) and follows a fail-fast approach
 * where the application terminates if it cannot connect to the database, ensuring
 * that the server only starts when database access is guaranteed.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose ODM.
 *
 * This function is critical to the application's startup sequence and must be called
 * before the Express server starts listening for requests. It uses the MONGO_URI
 * environment variable to connect to the MongoDB Atlas cloud database.
 *
 * **Why this approach?**
 * - **Fail-fast strategy**: If the database is unavailable, the application exits immediately
 *   rather than starting and potentially serving requests that will fail
 * - **Environment-based configuration**: Uses MONGO_URI environment variable for different
 *   database instances (development, staging, production)
 * - **Centralized connection management**: All database operations throughout the app
 *   rely on this single connection established here
 *
 * **Connection Details:**
 * - Database: MongoDB Atlas (cloud-hosted MongoDB)
 * - ODM: Mongoose for schema validation and query building
 * - Data Model: Notes with title, content, and automatic timestamps
 * - Environment Variable: MONGO_URI (set in .env file and deployment environment)
 *
 * **Error Handling:**
 * - Connection failures result in process.exit(1) to prevent the server from starting
 * - This ensures the application only runs when database access is guaranteed
 * - No retry logic is implemented - the application expects the database to be available
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established successfully
 * @throws {Error} Throws and exits process if connection fails
 *
 * @example
 * // Called in server.js before starting the Express server
 * connectDB().then(() => {
 *   app.listen(PORT, () => {
 *     console.log('Server started successfully');
 *   });
 * });
 *
 * @see {@link ../server.js} Server startup sequence that calls this function
 * @see {@link ../models/Note.js} Note model that uses this connection
 * @see {@link https://mongoosejs.com/docs/connections.html} Mongoose connection documentation
 * @see {@link https://www.mongodb.com/atlas} MongoDB Atlas cloud database
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    process.exit(1); // exit with failure
  }
};
