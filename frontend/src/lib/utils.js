/**
 * @fileoverview Utility functions for the Dex Note Taking App frontend.
 *
 * This module provides reusable utility functions that are used throughout
 * the application for common operations like date formatting, data transformation,
 * and other helper functions. These utilities promote code reuse and maintain
 * consistency across the application.
 *
 * Key Features:
 * - Date formatting for user-friendly display
 * - Consistent formatting across all components
 * - Localization support for international users
 * - Reusable utility functions for common operations
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Formats a Date object into a user-friendly string format.
 *
 * This function converts a JavaScript Date object into a readable date string
 * using the US English locale format. It's specifically designed to display
 * note creation dates in a consistent, user-friendly format throughout the
 * application.
 *
 * Why this format?
 * - User-friendly: "Jan 15, 2024" is more readable than "2024-01-15"
 * - Consistent: Same format used across all note displays
 * - Compact: Fits well in note cards and UI components
 * - Familiar: Users recognize this common date format
 * - Localized: Uses en-US locale for consistent formatting
 *
 * Format Details:
 * - Month: Short name (Jan, Feb, Mar, etc.)
 * - Day: Numeric without leading zeros (1, 2, 15, etc.)
 * - Year: Full 4-digit year (2024, 2025, etc.)
 * - Example output: "Jan 15, 2024", "Dec 3, 2023"
 *
 * Usage Context:
 * - NoteCard component: Displays creation date for each note
 * - Note timestamps: Shows when notes were created
 * - UI consistency: Ensures all dates look the same
 *
 * @param {Date} date - The Date object to format
 * @returns {string} Formatted date string in "MMM DD, YYYY" format
 *
 * @example
 * // Format a note creation date
 * const noteDate = new Date('2024-01-15T10:30:00Z');
 * const formattedDate = formatDate(noteDate);
 * console.log(formattedDate); // "Jan 15, 2024"
 *
 * @see {@link ../components/NoteCard.jsx} NoteCard component that uses this function
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString} MDN toLocaleDateString documentation
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
