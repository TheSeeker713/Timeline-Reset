/**
 * Audio Player Component
 * Manages click-to-play audio with portal reveal, secret message, and cookie persistence
 */

const COOKIE_NAME = 'timeline_reset_audio_played';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

let audioElement = null;
let playButton = null;
let secretMessage = null;
let isPlaying = false;
let hasPlayed = false;
let isUnlocked = false;
let onEndedCallback = null;
let ariaLiveRegion = null;

/**
 * Initialize audio player
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.audioEl - Audio element
 * @param {HTMLElement} options.playBtnEl - Play button element
 * @param {Function} options.onEnded - Callback when audio ends
 * @returns {Object} Audio API
 */
export function initPlayer({ audioEl, playBtnEl, onEnded = null }) {
  audioElement = audioEl;
  playButton = playBtnEl;
  onEndedCallback = onEnded;
  
  if (!audioElement || !playButton) {
    console.error('Audio element or button not found');
    return null;
  }
  
  // Get secret message element
  secretMessage = document.getElementById('secretMessage');
  
  // Create aria-live region for status updates
  createAriaLiveRegion();
  
  // Check if user has already played audio (cookie check)
  const hasPlayedBefore = getCookie(COOKIE_NAME);
  if (hasPlayedBefore === 'true') {
    // User has played before - show message and portal immediately
    hasPlayed = true;
    showSecretMessage();
    
    // Reveal portal after short delay
    setTimeout(() => {
      revealPortal();
    }, 1000);
    
    // Update button state to indicate already played
    if (playButton) {
      playButton.classList.add('played');
      playButton.style.opacity = '0.5';
      playButton.style.cursor = 'default';
      playButton.setAttribute('aria-label', 'Audio already played');
    }
    
    if (import.meta.env.DEV) {
      console.info('🔄 Returning user - audio already played, restoring state');
    }
  }
  
  // Play button click handler
  playButton.addEventListener('click', handlePlayClick);
  
  // Keyboard accessibility: Space and Enter keys
  playButton.addEventListener('keydown', handleKeydown);
  
  // Audio ended handler
  audioElement.addEventListener('ended', handleAudioEnded);
  
  // iOS audio unlock
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
  
  // Set initial ARIA attributes
  playButton.setAttribute('aria-pressed', hasPlayed ? 'true' : 'false');
  playButton.setAttribute('role', 'button');
  playButton.setAttribute('tabindex', '0');
  
  if (import.meta.env.DEV) {
    console.info('🔊 Audio player initialized with cookie persistence');
  }
  
  return AudioAPI;
}

/**
 * Create hidden aria-live region for screen reader announcements
 */
function createAriaLiveRegion() {
  ariaLiveRegion = document.createElement('div');
  ariaLiveRegion.setAttribute('aria-live', 'polite');
  ariaLiveRegion.setAttribute('aria-atomic', 'true');
  ariaLiveRegion.className = 'sr-only';
  ariaLiveRegion.style.position = 'absolute';
  ariaLiveRegion.style.left = '-10000px';
  ariaLiveRegion.style.width = '1px';
  ariaLiveRegion.style.height = '1px';
  ariaLiveRegion.style.overflow = 'hidden';
  document.body.appendChild(ariaLiveRegion);
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announce(message) {
  if (ariaLiveRegion) {
    ariaLiveRegion.textContent = message;
  }
}

/**
 * Handle keyboard events (Space and Enter)
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeydown(event) {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    handlePlayClick();
  }
}

/**
 * Handle play button click
 */
function handlePlayClick() {
  if (isPlaying || hasPlayed) {
    announce('Audio has already been played');
    return;
  }
  
  playAudio();
}

/**
 * Play audio (no autoplay, no loop)
 */
function playAudio() {
  if (!audioElement || hasPlayed) return;
  
  // Show secret message immediately when user clicks play
  showSecretMessage();
  
  audioElement.play()
    .then(() => {
      isPlaying = true;
      hasPlayed = true;
      
      // Set cookie to remember user played audio (privacy-friendly, no tracking)
      setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRY_DAYS);
      
      // Update button state - add "playing" class
      if (playButton) {
        playButton.classList.add('playing');
        playButton.setAttribute('aria-pressed', 'true');
        playButton.style.opacity = '0.5';
        playButton.style.cursor = 'default';
        playButton.setAttribute('aria-label', 'Audio playing');
      }
      
      // Announce to screen readers
      announce('Audio is now playing. Listen for hidden messages.');
      
      if (import.meta.env.DEV) {
        console.info('▶️ Audio playing');
      }
    })
    .catch(err => {
      console.error('Audio play failed:', err);
      announce('Failed to play audio. Please try again.');
      
      // Hide message if audio fails
      if (secretMessage) {
        secretMessage.classList.add('hidden');
      }
    });
}

/**
 * Handle audio ended
 */
function handleAudioEnded() {
  isPlaying = false;
  
  if (import.meta.env.DEV) {
    console.info('⏹️ Audio ended');
  }
  
  // Announce to screen readers
  announce('Audio has finished playing. Portal is now available.');
  
  // Call onEnded callback (will reveal portal)
  if (onEndedCallback) {
    setTimeout(() => {
      onEndedCallback();
    }, 500);
  }
}

/**
 * Manually reveal portal (for testing or external triggers)
 */
function revealPortal() {
  const portal = document.getElementById('portal');
  
  if (!portal) {
    console.error('Portal element not found');
    return;
  }
  
  // Show portal
  portal.classList.remove('hidden');
  
  // Smooth scroll to portal
  portal.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  
  if (import.meta.env.DEV) {
    console.info('🌀 Portal revealed');
  }
}

/**
 * Unlock audio on iOS (first user interaction)
 */
function unlockAudio() {
  if (!audioElement || isUnlocked) return;
  
  // Play and immediately pause to unlock
  audioElement.play()
    .then(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      isUnlocked = true;
      if (import.meta.env.DEV) {
        console.info('🔓 Audio unlocked (iOS)');
      }
    })
    .catch(() => {
      // Ignore unlock errors
    });
}

/**
 * Show the secret message with fade-in animation
 */
function showSecretMessage() {
  if (secretMessage) {
    secretMessage.classList.remove('hidden');
    announce('A message appears: Listen closely... truth hides between the frequencies');
    
    if (import.meta.env.DEV) {
      console.info('📜 Secret message revealed');
    }
  }
}

/**
 * Set a cookie (privacy-friendly, no tracking)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiry in days
 */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  // SameSite=Strict for privacy, no third-party access
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  
  if (import.meta.env.DEV) {
    console.info(`🍪 Cookie set: ${name}=${value}`);
  }
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  
  return null;
}

/**
 * Delete a cookie (for testing/debugging)
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
  
  if (import.meta.env.DEV) {
    console.info(`🍪 Cookie deleted: ${name}`);
  }
}

/**
 * Audio API for testing
 */
export const AudioAPI = {
  play: playAudio,
  isPlaying: () => isPlaying,
  hasPlayed: () => hasPlayed,
  revealPortal,
  deleteCookie: () => deleteCookie(COOKIE_NAME), // For testing
  getCookieValue: () => getCookie(COOKIE_NAME), // For testing
};
