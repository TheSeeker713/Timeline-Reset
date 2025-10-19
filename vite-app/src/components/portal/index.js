/**
 * Portal Gate Component
 * Time-locked form with rejection phrases
 */

import { TARGET_DATE, getNow } from '../../utils/time.js';

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

let gateForm = null;
let gateInput = null;
let gateError = null;
let gateSuccess = null;

/**
 * Initialize portal gate
 * @param {string} formId - ID of gate form
 */
export function initPortal(formId = 'gateForm') {
  gateForm = document.getElementById(formId);
  gateInput = document.getElementById('gateInput');
  gateError = document.getElementById('gateError');
  gateSuccess = document.getElementById('gateSuccess');
  
  if (!gateForm || !gateInput || !gateError || !gateSuccess) {
    console.error('Portal gate elements not found');
    return;
  }
  
  // Form submission handler
  gateForm.addEventListener('submit', handleFormSubmit);
  
  // Input change handler
  gateInput.addEventListener('input', handleInputChange);
  
  console.log('🌀 Portal gate initialized');
  console.log('Target:', TARGET_DATE.toISOString());
  console.log('Rejection phrases loaded:', REJECTION_PHRASES.length);
}

/**
 * Check if target is reached
 * @returns {boolean}
 */
function isTargetReached() {
  return getNow() >= TARGET_DATE;
}

/**
 * Get random rejection phrase
 * @returns {string}
 */
function getRandomRejectionPhrase() {
  const randomIndex = Math.floor(Math.random() * REJECTION_PHRASES.length);
  return REJECTION_PHRASES[randomIndex];
}

/**
 * Handle form submission
 * @param {Event} event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  if (isTargetReached()) {
    showSuccessMessage();
  } else {
    showRejectionMessage();
  }
  
  return false;
}

/**
 * Show rejection message with random phrase
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
  
  // Show error
  gateError.classList.remove('hidden');
  gateSuccess.classList.add('hidden');
  
  console.log('⛔ Gate rejected:', randomPhrase);
}

/**
 * Show success message
 */
function showSuccessMessage() {
  // Hide error, show success
  gateError.classList.add('hidden');
  gateSuccess.classList.remove('hidden');
  
  // Disable form
  gateInput.disabled = true;
  const submitBtn = gateForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  
  console.log('✅ Temporal lock disengaged');
  
  // Log input value
  const inputValue = gateInput.value.trim();
  console.log('Gate accepted. Input:', inputValue || 'none');
}

/**
 * Handle input change
 */
function handleInputChange() {
  // Hide error when user starts typing
  if (!gateError.classList.contains('hidden')) {
    gateError.classList.add('hidden');
  }
}

/**
 * Portal Gate API for testing
 */
export const GateAPI = {
  isTargetReached,
  getRandomPhrase: getRandomRejectionPhrase,
  showRejection: showRejectionMessage,
  showSuccess: showSuccessMessage,
  getTarget: () => TARGET_DATE,
  getPhrases: () => REJECTION_PHRASES,
};
