/**
 * Audio Player Component
 * Manages click-to-play audio with portal reveal
 */

let audioElement = null;
let playButton = null;
let isPlaying = false;
let hasPlayed = false;
let isUnlocked = false;

/**
 * Initialize audio player
 * @param {string} audioId - ID of audio element
 * @param {string} buttonId - ID of play button
 */
export function initPlayer(audioId = 'audioPlayer', buttonId = 'playBtn') {
  audioElement = document.getElementById(audioId);
  playButton = document.getElementById(buttonId);
  
  if (!audioElement || !playButton) {
    console.error('Audio element or button not found');
    return;
  }
  
  // Play button click handler
  playButton.addEventListener('click', handlePlayClick);
  
  // Audio ended handler
  audioElement.addEventListener('ended', handleAudioEnded);
  
  // iOS audio unlock
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
  
  console.log('🔊 Audio player initialized');
}

/**
 * Handle play button click
 */
function handlePlayClick() {
  if (isPlaying || hasPlayed) return;
  
  playAudio();
}

/**
 * Play audio
 */
function playAudio() {
  if (!audioElement || hasPlayed) return;
  
  audioElement.play()
    .then(() => {
      isPlaying = true;
      hasPlayed = true;
      
      // Update button state
      if (playButton) {
        playButton.classList.add('playing');
        playButton.style.opacity = '0.5';
        playButton.style.cursor = 'default';
      }
      
      console.log('▶️ Audio playing');
    })
    .catch(err => {
      console.error('Audio play failed:', err);
    });
}

/**
 * Handle audio ended
 */
function handleAudioEnded() {
  isPlaying = false;
  
  console.log('⏹️ Audio ended');
  
  // Reveal portal
  setTimeout(() => {
    revealPortal();
  }, 500);
}

/**
 * Reveal portal section
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
