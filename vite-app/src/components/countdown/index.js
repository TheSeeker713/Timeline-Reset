/**
 * Countdown Component
 * Displays countdown to TARGET_DATE with glitch progression
 */

import { getNow } from '../../utils/time.js';

let countdownInterval = null;
let onTickCallback = null;
let onZeroCallback = null;
let hasReachedZero = false;
let targetUtc = null;
let containerElement = null;

/**
 * Initialize countdown
 * @param {Object} options - Configuration options
 * @param {Date} options.targetUtc - Target date/time in UTC
 * @param {Function} options.onTick - Called every second with { level } (0-1 glitch intensity)
 * @param {Function} options.onZero - Called when countdown reaches zero
 * @returns {Object} API for controlling countdown
 */
export function initCountdown({ targetUtc: target, onTick = null, onZero = null }) {
  containerElement = document.getElementById('countdown');
  
  if (!containerElement) {
    console.error('Countdown element #countdown not found');
    return null;
  }
  
  targetUtc = target;
  onTickCallback = onTick;
  onZeroCallback = onZero;
  hasReachedZero = false;
  
  // Initial update
  updateCountdown();
  
  // Update every second
  countdownInterval = setInterval(() => {
    updateCountdown();
  }, 1000);
  
  console.log('⏱️ Countdown initialized');
  console.log('Target:', targetUtc.toISOString());
  
  return CountdownAPI;
}

/**
 * Update countdown display and glitch intensity
 */
function updateCountdown() {
  if (!containerElement || !targetUtc) return;
  
  const now = getNow();
  
  // Check if target reached
  if (now >= targetUtc && !hasReachedZero) {
    handleZeroReached();
    return;
  }
  
  if (hasReachedZero) return; // Already at zero, stop updating
  
  // Calculate time remaining
  const msRemaining = targetUtc.getTime() - now.getTime();
  const { d, h, m, s } = getTimeComponentsFromMs(msRemaining);
  
  // Update display
  const daysEl = containerElement.querySelector('[data-countdown="days"]');
  const hoursEl = containerElement.querySelector('[data-countdown="hours"]');
  const minutesEl = containerElement.querySelector('[data-countdown="minutes"]');
  const secondsEl = containerElement.querySelector('[data-countdown="seconds"]');
  
  if (daysEl) daysEl.textContent = pad(d);
  if (hoursEl) hoursEl.textContent = pad(h);
  if (minutesEl) minutesEl.textContent = pad(m);
  if (secondsEl) secondsEl.textContent = pad(s);
  
  // Calculate daily glitch level and trigger onTick
  if (onTickCallback) {
    const glitchLevel = computeDailyGlitchLevel(msRemaining);
    onTickCallback({ level: glitchLevel });
  }
}

/**
 * Convert milliseconds to time components
 * @param {number} ms - Milliseconds
 * @returns {Object} { d, h, m, s }
 */
function getTimeComponentsFromMs(ms) {
  let totalSeconds = Math.max(0, Math.floor(ms / 1000));
  
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return { d: days, h: hours, m: minutes, s: seconds };
}

/**
 * Compute daily glitch level (0.0 to 1.0) based on time remaining
 * Increases from 0.12 (24+ days) to 1.00 (T-0)
 * @param {number} msRemaining - Milliseconds until target
 * @returns {number} Glitch level (0.0 to 1.0)
 */
function computeDailyGlitchLevel(msRemaining) {
  const totalDays = 24; // Days from start to TARGET
  const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
  
  // Base level when far from target
  const baseLevel = 0.12;
  const maxLevel = 1.00;
  
  if (daysRemaining >= totalDays) {
    return baseLevel;
  } else if (daysRemaining <= 0) {
    return maxLevel;
  } else {
    // Linear interpolation from baseLevel to maxLevel
    const progress = 1 - (daysRemaining / totalDays);
    return baseLevel + (progress * (maxLevel - baseLevel));
  }
}

/**
 * Format number with leading zero
 * @param {number} num - Number to pad
 * @returns {string} Padded string
 */
function pad(num) {
  return String(num).padStart(2, '0');
}

/**
 * Handle countdown reaching zero (T-0 event)
 */
function handleZeroReached() {
  hasReachedZero = true;
  
  // Stop interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  
  // Set all to zero
  containerElement.querySelectorAll('[data-countdown]').forEach(el => {
    el.textContent = '00';
  });
  
  // Show "SIGNAL BREACHED" message
  const message = containerElement.querySelector('.countdown-message');
  if (message) {
    message.textContent = 'SIGNAL BREACHED';
    message.classList.add('glitch-text');
  }
  
  console.log('🚨 TARGET REACHED - T-0 EVENT');
  
  // Trigger onTick with max glitch level
  if (onTickCallback) {
    onTickCallback({ level: 1.0 });
  }
  
  // Call onZero callback
  if (onZeroCallback) {
    onZeroCallback();
  }
}

/**
 * Force countdown update (useful for testing)
 */
function forceUpdate() {
  if (containerElement) {
    updateCountdown();
  }
}

/**
 * Get days remaining until target
 * @returns {number} Days remaining (fractional)
 */
function getDaysRemaining() {
  if (!targetUtc) return 0;
  const now = getNow();
  const msRemaining = targetUtc.getTime() - now.getTime();
  return msRemaining / (1000 * 60 * 60 * 24);
}

/**
 * Countdown API for testing
 */
export const CountdownAPI = {
  getTarget: () => targetUtc,
  getDaysRemaining,
  setMockDate: (date) => {
    const mockDate = typeof date === 'string' ? new Date(date) : date;
    window.__MOCK_DATE__ = mockDate;
    forceUpdate();
    console.log('🕒 Mock date set:', mockDate.toISOString());
  },
  clearMockDate: () => {
    window.__MOCK_DATE__ = null;
    forceUpdate();
    console.log('🕒 Mock date cleared, using real time');
  },
  forceUpdate,
};
