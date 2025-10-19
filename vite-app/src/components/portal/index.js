/**
 * Portal Gate Component
 * Time-locked form with 11 rejection phrases
 */

// 11 rejection phrases as specified
const REJECTION_PHRASES = [
  "Signal misaligned. Try again later.",
  "Temporal corridor not yet stable.",
  "Chronometric lock engaged.",
  "Phase variance exceeds threshold.",
  "Entry vector rejected by nexus.",
  "Calibration incomplete. Stand by.",
  "Temporal window is sealed.",
  "Sequence desynchronized — hold.",
  "Causality guardrails active.",
  "Phase gate denies ingress.",
  "Await synchronization pulse."
];

const REJECTION_SUFFIX = "It is not yet time.";

let containerElement = null;
let gateForm = null;
let gateInput = null;
let gateError = null;
let gateSuccess = null;
let targetUtc = null;
let nowFn = null;

/**
 * Initialize portal gate
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.containerEl - Portal container element
 * @param {Date} options.targetUtc - Target date/time in UTC
 * @param {Function} options.nowFn - Function that returns current time (for mocking)
 * @returns {Object} Portal API
 */
export function initPortal({ containerEl, targetUtc: target, nowFn: nowFunc = null }) {
  containerElement = containerEl;
  targetUtc = target;
  nowFn = nowFunc || (() => window.__MOCK_DATE__ || new Date());
  
  if (!containerElement) {
    console.error('Portal container element not found');
    return null;
  }
  
  // Get form elements
  gateForm = containerElement.querySelector('#gateForm');
  gateInput = containerElement.querySelector('#gateInput');
  gateError = containerElement.querySelector('#gateError');
  gateSuccess = containerElement.querySelector('#gateSuccess');
  
  if (!gateForm || !gateInput || !gateError || !gateSuccess) {
    console.error('Portal gate form elements not found');
    return null;
  }
  
  // Form submission handler
  gateForm.addEventListener('submit', handleFormSubmit);
  
  // Input change handler
  gateInput.addEventListener('input', handleInputChange);
  
  if (import.meta.env.DEV) {
    console.info('🌀 Portal gate initialized');
    console.info('Target:', targetUtc.toISOString());
    console.info('Rejection phrases loaded:', REJECTION_PHRASES.length);
  }
  
  return GateAPI;
}

/**
 * Show portal (unhide and focus input)
 */
export function showPortal() {
  if (!containerElement) return;
  
  // Unhide portal
  containerElement.classList.remove('hidden');
  
  // Smooth scroll to portal
  containerElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  
  // Focus input after scroll completes
  setTimeout(() => {
    if (gateInput && !gateInput.disabled) {
      gateInput.focus();
    }
  }, 600);
  
  if (import.meta.env.DEV) {
    console.info('🌀 Portal shown and input focused');
  }
}

/**
 * Check if target is reached
 * @returns {boolean}
 */
function isTargetReached() {
  if (!targetUtc || !nowFn) return false;
  const now = nowFn();
  return now >= targetUtc;
}

/**
 * Get ONE random rejection phrase from the 11-line list
 * @returns {string}
 */
function getRandomRejectionPhrase() {
  const randomIndex = Math.floor(Math.random() * REJECTION_PHRASES.length);
  return REJECTION_PHRASES[randomIndex];
}

/**
 * Handle form submission
 * Before TARGET: Block submit, show random phrase + "It is not yet time."
 * After TARGET: Allow submit, show "Temporal lock disengaged."
 * @param {Event} event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (isTargetReached()) {
    // After TARGET: Allow and show success
    showSuccessMessage();
  } else {
    // Before TARGET: Block with random rejection
    showRejectionMessage();
  }
  
  return false;
}

/**
 * Show rejection message with ONE random phrase + canonical suffix
 */
function showRejectionMessage() {
  const randomPhrase = getRandomRejectionPhrase();
  
  // Get error elements
  const phraseElement = gateError.querySelector('.error-phrase');
  const timeElement = gateError.querySelector('.error-time');
  
  if (phraseElement && timeElement) {
    phraseElement.textContent = randomPhrase;
    timeElement.textContent = REJECTION_SUFFIX;
  }
  
  // Show error, hide success
  gateError.classList.remove('hidden');
  gateSuccess.classList.add('hidden');
  
  if (import.meta.env.DEV) {
    console.info('⛔ Gate rejected:', randomPhrase);
  }
}

/**
 * Show success message and disable form
 */
function showSuccessMessage() {
  // Hide error, show success
  gateError.classList.add('hidden');
  gateSuccess.classList.remove('hidden');
  
  // Disable form inputs
  gateInput.disabled = true;
  const submitBtn = gateForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  
  if (import.meta.env.DEV) {
    console.info('✅ Temporal lock disengaged');
    
    // Log input value
    const inputValue = gateInput.value.trim();
    console.info('Gate accepted. Input:', inputValue || 'none');
  }
}

/**
 * Handle input change
 * Hides error when user starts typing again
 */
function handleInputChange() {
  // Hide error when user starts typing
  if (!gateError.classList.contains('hidden')) {
    gateError.classList.add('hidden');
  }
}

/**
 * Portal Gate API for testing and external control
 */
export const GateAPI = {
  showPortal,
  isTargetReached,
  getRandomPhrase: getRandomRejectionPhrase,
  showRejection: showRejectionMessage,
  showSuccess: showSuccessMessage,
  getTarget: () => targetUtc,
  getPhrases: () => REJECTION_PHRASES,
};
