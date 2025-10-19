/**
 * Audio Player Component
 * Manages click-to-play audio with portal reveal and accessibility
 */

let audioElement = null;
let playButton = null;
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
  
  // Create aria-live region for status updates
  createAriaLiveRegion();
  
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
  playButton.setAttribute('aria-pressed', 'false');
  playButton.setAttribute('role', 'button');
  playButton.setAttribute('tabindex', '0');
  
  console.log('🔊 Audio player initialized with accessibility');
  
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
  
  audioElement.play()
    .then(() => {
      isPlaying = true;
      hasPlayed = true;
      
      // Update button state - add "playing" class
      if (playButton) {
        playButton.classList.add('playing');
        playButton.setAttribute('aria-pressed', 'true');
        playButton.style.opacity = '0.5';
        playButton.style.cursor = 'default';
        playButton.setAttribute('aria-label', 'Audio playing');
      }
      
      // Announce to screen readers
      announce('Audio is now playing');
      
      console.log('▶️ Audio playing');
    })
    .catch(err => {
      console.error('Audio play failed:', err);
      announce('Failed to play audio');
    });
}

/**
 * Handle audio ended
 */
function handleAudioEnded() {
  isPlaying = false;
  
  console.log('⏹️ Audio ended');
  
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
  
  console.log('🌀 Portal revealed');
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
      console.log('🔓 Audio unlocked (iOS)');
    })
    .catch(() => {
      // Ignore unlock errors
    });
}

/**
 * Audio API for testing
 */
export const AudioAPI = {
  play: playAudio,
  isPlaying: () => isPlaying,
  hasPlayed: () => hasPlayed,
  revealPortal,
};
