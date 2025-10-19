/**
 * Audio Player Component
 * Manages click-to-play audio with portal reveal and secret message
 * 
 * TODO: Add user state persistence in the future (consider localStorage or backend)
 * For now, state resets on page refresh for testing and development
 */

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
  console.log('🎵 initPlayer() called');
  console.log('  audioEl:', audioEl);
  console.log('  playBtnEl:', playBtnEl);
  console.log('  onEnded callback:', typeof onEnded);
  
  audioElement = audioEl;
  playButton = playBtnEl;
  onEndedCallback = onEnded;
  
  if (!audioElement || !playButton) {
    console.error('❌ Audio element or button not found');
    console.error('  audioElement:', audioElement);
    console.error('  playButton:', playButton);
    return null;
  }
  
  console.log('✅ Audio and button elements found');
  console.log('  Audio src:', audioElement.querySelector('source')?.src);
  console.log('  Button id:', playButton.id);
  
  // Get secret message element
  secretMessage = document.getElementById('secretMessage');
  console.log('  Secret message element:', secretMessage);
  
  // Create aria-live region for status updates
  createAriaLiveRegion();
  
  if (import.meta.env.DEV) {
    console.log('✅ First-time user - ready to play audio (state resets on refresh)');
  }
  
  // Play button click handler
  playButton.addEventListener('click', handlePlayClick);
  console.log('✅ Click event listener attached to button');
  
  // Keyboard accessibility: Space and Enter keys
  playButton.addEventListener('keydown', handleKeydown);
  console.log('✅ Keydown event listener attached to button');
  
  // Audio ended handler
  audioElement.addEventListener('ended', handleAudioEnded);
  console.log('✅ Audio ended event listener attached');
  console.log('  onEnded callback will be called:', !!onEndedCallback);
  
  // iOS audio unlock - removed as it interferes with play button
  // Modern browsers handle this automatically on user gesture
  // document.addEventListener('click', unlockAudio, { once: true });
  // document.addEventListener('touchstart', unlockAudio, { once: true });
  
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
  console.log('🎯 Play button clicked!'); // Debug log
  console.log('isPlaying:', isPlaying, 'hasPlayed:', hasPlayed); // Debug state
  
  if (isPlaying || hasPlayed) {
    announce('Audio has already been played');
    console.log('❌ Audio blocked - already played');
    return;
  }
  
  console.log('✅ Proceeding to play audio');
  playAudio();
}

/**
 * Play audio (no autoplay, no loop)
 */
function playAudio() {
  console.log('🎵 playAudio() called'); // Debug log
  console.log('audioElement:', audioElement); // Debug element
  console.log('hasPlayed:', hasPlayed); // Debug state
  
  if (!audioElement || hasPlayed) {
    console.log('❌ playAudio blocked - no element or already played');
    return;
  }
  
  // Show secret message immediately when user clicks play
  showSecretMessage();
  
  console.log('▶️ Calling audioElement.play()...'); // Debug
  
  audioElement.play()
    .then(() => {
      console.log('✅ Audio play() promise resolved');
      
      // DEBUG: Check audio state after play
      console.log('🔍 Audio state after play():');
      console.log('  paused:', audioElement.paused);
      console.log('  currentTime:', audioElement.currentTime);
      console.log('  duration:', audioElement.duration);
      console.log('  volume:', audioElement.volume);
      console.log('  muted:', audioElement.muted);
      console.log('  readyState:', audioElement.readyState);
      console.log('  ended:', audioElement.ended);
      
      isPlaying = true;
      hasPlayed = true;
      
      // Fade out and remove button to save memory
      if (playButton) {
        playButton.classList.add('playing');
        playButton.setAttribute('aria-pressed', 'true');
        playButton.setAttribute('aria-label', 'Audio playing');
        
        // Fade out animation
        playButton.style.transition = 'opacity 1s ease-out';
        playButton.style.opacity = '0';
        
        // Remove button from DOM after fade completes (saves memory)
        setTimeout(() => {
          if (playButton && playButton.parentNode) {
            playButton.parentNode.removeChild(playButton);
            playButton = null; // Free memory reference
            
            if (import.meta.env.DEV) {
              console.info('🗑️ Play button removed from DOM');
            }
          }
        }, 1000); // Wait for fade animation
      }
      
      // Announce to screen readers
      announce('Audio is now playing. Listen for hidden messages.');
      
      if (import.meta.env.DEV) {
        console.info('▶️ Audio playing');
      }
    })
    .catch(err => {
      console.error('❌ Audio play failed:', err);
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
 * Audio API for testing and external control
 */
export const AudioAPI = {
  play: playAudio,
  isPlaying: () => isPlaying,
  hasPlayed: () => hasPlayed,
  revealPortal,
};
