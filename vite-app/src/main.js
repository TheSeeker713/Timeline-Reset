/**
 * Main Entry Point
 * Composition root that wires all components together
 */

// Import styles
import './styles/tailwind.css';
import './styles/glitch.css';
import './styles/portal.css';

// Import components
import { initGlitch, GlitchFX } from './components/glitch/index.js';
import { initCountdown, CountdownAPI } from './components/countdown/index.js';
import { initPlayer, AudioAPI } from './components/player/index.js';
import { initPortal, GateAPI } from './components/portal/index.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Timeline Reset initializing...');
  
  // Initialize glitch layer first (provides visual feedback)
  initGlitch('glitch-layer');
  
  // Initialize countdown (triggers glitch progression)
  initCountdown('countdown', handleCountdownZero);
  
  // Initialize audio player
  initPlayer('audioPlayer', 'playBtn');
  
  // Initialize portal gate
  initPortal('gateForm');
  
  console.log('✅ Timeline Reset initialized');
  
  // Expose APIs for testing
  window.GlitchFX = GlitchFX;
  window.__COUNTDOWN_API__ = CountdownAPI;
  window.__AUDIO_API__ = AudioAPI;
  window.__GATE_API__ = GateAPI;
  
  console.log('📡 Test APIs exposed:');
  console.log('  - GlitchFX (setLevel, getLevel, stepTo)');
  console.log('  - __COUNTDOWN_API__ (getTarget, setMockDate, etc.)');
  console.log('  - __AUDIO_API__ (play, isPlaying, revealPortal)');
  console.log('  - __GATE_API__ (isTargetReached, showRejection, etc.)');
});

/**
 * Callback when countdown reaches zero
 */
function handleCountdownZero() {
  console.log('🚨 T-0 EVENT: Countdown complete');
  
  // Could trigger additional effects here
  // For now, glitch intensity is already at 1.0 from countdown component
}
