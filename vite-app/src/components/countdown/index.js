/**
 * Countdown Component
 * Displays countdown to TARGET_DATE with glitch progression
 */

import { 
  TARGET_DATE, 
  getNow, 
  getTimeComponents, 
  pad, 
  isTargetReached,
  getDaysRemaining,
  setMockDate as setMock,
  clearMockDate as clearMock
} from '../../utils/time.js';
import { setLevel as setGlitchLevel } from '../glitch/index.js';

let countdownInterval = null;
let onZeroCallback = null;
let hasReachedZero = false;

/**
 * Initialize countdown
 * @param {string} elementId - ID of countdown container
 * @param {Function} onZero - Callback when countdown reaches zero
 */
export function initCountdown(elementId = 'countdown', onZero = null) {
  const container = document.getElementById(elementId);
  
  if (!container) {
    console.error(`Countdown element #${elementId} not found`);
    return;
  }
  
  onZeroCallback = onZero;
  
  // Initial update
  updateCountdown(container);
  
  // Update every second
  countdownInterval = setInterval(() => {
    updateCountdown(container);
  }, 1000);
  
  console.log('⏱️ Countdown initialized');
  console.log('Target:', TARGET_DATE.toISOString());
}

/**
 * Update countdown display and glitch intensity
 * @param {HTMLElement} container - Countdown container element
 */
function updateCountdown(container) {
  if (isTargetReached() && !hasReachedZero) {
    handleZeroReached(container);
    return;
  }
  
  if (hasReachedZero) return; // Already at zero, stop updating
  
  const { d, h, m, s } = getTimeComponents();
  
  // Update display
  const daysEl = container.querySelector('[data-countdown="days"]');
  const hoursEl = container.querySelector('[data-countdown="hours"]');
  const minutesEl = container.querySelector('[data-countdown="minutes"]');
  const secondsEl = container.querySelector('[data-countdown="seconds"]');
  
  if (daysEl) daysEl.textContent = pad(d);
  if (hoursEl) hoursEl.textContent = pad(h);
  if (minutesEl) minutesEl.textContent = pad(m);
  if (secondsEl) secondsEl.textContent = pad(s);
  
  // Calculate and update glitch intensity
  updateGlitchIntensity();
}

/**
 * Calculate and set glitch intensity based on days remaining
 */
function updateGlitchIntensity() {
  const daysRemaining = getDaysRemaining();
  const totalDays = 24; // Days from start to TARGET
  
  // Intensity increases from 0.10 to 1.00 over 24 days
  // When 24 days remain: 0.10
  // When 0 days remain: 1.00
  let intensity;
  
  if (daysRemaining >= totalDays) {
    intensity = 0.10;
  } else if (daysRemaining <= 0) {
    intensity = 1.00;
  } else {
    // Linear interpolation from 0.10 to 1.00
    const progress = 1 - (daysRemaining / totalDays);
    intensity = 0.10 + (progress * 0.90);
  }
  
  setGlitchLevel(intensity);
}

/**
 * Handle countdown reaching zero
 * @param {HTMLElement} container - Countdown container
 */
function handleZeroReached(container) {
  hasReachedZero = true;
  
  // Stop interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  
  // Set all to zero
  container.querySelectorAll('[data-countdown]').forEach(el => {
    el.textContent = '00';
  });
  
  // Max glitch intensity
  setGlitchLevel(1.0);
  
  // Show "SIGNAL BREACHED" message
  const message = container.querySelector('.countdown-message');
  if (message) {
    message.textContent = 'SIGNAL BREACHED';
    message.classList.add('glitch-text');
  }
  
  console.log('🚨 TARGET REACHED - T-0 EVENT');
  
  // Call callback
  if (onZeroCallback) {
    onZeroCallback();
  }
}

/**
 * Force countdown update (useful for testing)
 */
export function forceUpdate() {
  const container = document.getElementById('countdown');
  if (container) {
    updateCountdown(container);
  }
}

/**
 * Countdown API for testing
 */
export const CountdownAPI = {
  getTarget: () => TARGET_DATE,
  getDaysRemaining,
  setMockDate: (date) => {
    setMock(date);
    forceUpdate();
  },
  clearMockDate: () => {
    clearMock();
    forceUpdate();
  },
  forceUpdate,
};
