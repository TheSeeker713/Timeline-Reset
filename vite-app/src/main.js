/**
 * Main Entry Point
 * Composition root that wires all components together
 */

// Import styles
import './styles/tailwind.css';
import './styles/glitch.css';
import './styles/portal.css';

// Import components
import { setupGlitch, GlitchFX } from './components/glitch/index.js';
import { initCountdown, CountdownAPI } from './components/countdown/index.js';
import { initPlayer, AudioAPI } from './components/player/index.js';
import { initPortal, showPortal, GateAPI } from './components/portal/index.js';

// Target date: 2025-11-11 11:11 AM America/Denver (MST = UTC-7)
// MST is UTC-7, so 11:11 AM MST = 18:11 UTC
const TARGET = new Date('2025-11-11T18:11:00Z');

/**
 * Boot sequence
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Timeline Reset initializing...');
  console.log('Target:', TARGET.toISOString());
  console.log('Target (Local):', TARGET.toLocaleString());
  
  // a) Mount background + glitch (low level 0.12)
  setupGlitch();
  
  // b) Init countdown; onTick updates GlitchFX level progressively per-day
  initCountdown({
    targetUtc: TARGET,
    onTick: ({ level }) => {
      // Update glitch intensity based on countdown progression
      GlitchFX.setLevel(level);
    },
    onZero: handleTZero
  });
  
  // c) Init player; onEnded → showPortal()
  const audioEl = document.getElementById('audioPlayer');
  const playBtnEl = document.getElementById('playBtn');
  
  initPlayer({
    audioEl,
    playBtnEl,
    onEnded: () => {
      // Reveal portal when audio ends
      showPortal();
    }
  });
  
  // d) Init portal but keep hidden until audio ended
  const portalContainer = document.getElementById('portal');
  
  initPortal({
    containerEl: portalContainer,
    targetUtc: TARGET,
    nowFn: () => window.__MOCK_DATE__ || new Date()
  });
  
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
  console.log('  - __GATE_API__ (showPortal, isTargetReached, etc.)');
});

/**
 * e) At T-0, trigger full glitch takeover and replace countdown text
 */
function handleTZero() {
  console.log('🚨 T-0 EVENT: Full glitch takeover');
  
  // Full glitch intensity
  GlitchFX.setLevel(1.0);
  
  // Replace countdown message
  const message = document.querySelector('.countdown-message');
  if (message) {
    message.textContent = 'SIGNAL BREACHED';
    message.classList.add('glitch-text');
  }
  
  // Could add additional T-0 effects here
  // - Screen shake
  // - Sound effects
  // - Visual explosions
  // - etc.
}
