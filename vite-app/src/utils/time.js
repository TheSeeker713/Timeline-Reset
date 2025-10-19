/**
 * Time Utilities
 * Handles TARGET_DATE constants and mock date for testing
 */

// Target date: 2025-11-11 11:11 AM MT (18:11 UTC)
export const TARGET_DATE = new Date('2025-11-11T18:11:00Z');

/**
 * Get current time (real or mocked)
 * Uses window.__MOCK_DATE__ if set, otherwise returns real time
 * @returns {Date} Current date or mock date if set
 */
export function getNow() {
  return window.__MOCK_DATE__ || new Date();
}

/**
 * Set mock date for testing
 * @param {string|Date} date - Date to mock
 */
export function setMockDate(date) {
  mockDate = typeof date === 'string' ? new Date(date) : date;
  console.log('🕒 Mock date set:', mockDate.toISOString());
}

/**
 * Clear mock date (use real time)
 */
export function clearMockDate() {
  mockDate = null;
  console.log('🕒 Mock date cleared, using real time');
}

/**
 * Check if we've reached the target date
 * @returns {boolean} True if current time >= TARGET_DATE
 */
export function isTargetReached() {
  return getNow() >= TARGET_DATE;
}

/**
 * Get milliseconds until target
 * @returns {number} Milliseconds remaining (negative if past target)
 */
export function getTimeUntilTarget() {
  return TARGET_DATE.getTime() - getNow().getTime();
}

/**
 * Get days remaining until target
 * @returns {number} Days remaining (can be fractional)
 */
export function getDaysRemaining() {
  const msRemaining = getTimeUntilTarget();
  return msRemaining / (1000 * 60 * 60 * 24);
}

/**
 * Get time components (days, hours, minutes, seconds) until target
 * @returns {Object} Object with d, h, m, s properties
 */
export function getTimeComponents() {
  let totalSeconds = Math.max(0, Math.floor(getTimeUntilTarget() / 1000));
  
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return { d: days, h: hours, m: minutes, s: seconds };
}

/**
 * Format time component with leading zero
 * @param {number} num - Number to format
 * @returns {string} Formatted string (e.g., "05")
 */
export function pad(num) {
  return String(num).padStart(2, '0');
}
