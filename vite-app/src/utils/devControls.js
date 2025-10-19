/**
 * Dev Control Overlay
 * Press backtick (`) to toggle overlay with dev controls
 * Only available in development mode
 */

let overlayVisible = false;
let overlayEl = null;

/**
 * Create the dev control overlay UI
 * @returns {HTMLElement} The overlay element
 */
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'dev-overlay';
  overlay.className = 'dev-overlay';
  overlay.innerHTML = `
    <div class="dev-panel">
      <h3 class="dev-title">🛠️ Dev Controls</h3>
      <p class="dev-hint">Press \` to toggle</p>
      
      <div class="dev-section">
        <label for="glitchSlider" class="dev-label">
          Glitch Level: <span id="glitchValue">0.00</span>
        </label>
        <input 
          type="range" 
          id="glitchSlider" 
          min="0" 
          max="1" 
          step="0.01" 
          value="0"
          class="dev-slider"
        />
      </div>
      
      <div class="dev-section">
        <button id="forceAudioEnd" class="dev-button">
          🎵 Force Audio Ended
        </button>
      </div>
      
      <div class="dev-section">
        <button id="forceTZero" class="dev-button">
          ⚡ Force T-0 State
        </button>
      </div>
      
      <div class="dev-section">
        <label for="mockDateInput" class="dev-label">
          Mock Date (ISO 8601)
        </label>
        <input 
          type="text" 
          id="mockDateInput" 
          placeholder="2025-11-11T18:11:00Z"
          class="dev-input"
        />
        <div class="dev-button-group">
          <button id="setMockDate" class="dev-button-small">Set</button>
          <button id="clearMockDate" class="dev-button-small">Clear</button>
        </div>
      </div>
      
      <div class="dev-section">
        <button id="showPortalBtn" class="dev-button">
          🌀 Show Portal
        </button>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .dev-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      font-family: 'Courier New', monospace;
      display: none;
    }
    
    .dev-overlay.visible {
      display: block;
    }
    
    .dev-panel {
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #00ff88;
      border-radius: 8px;
      padding: 16px;
      min-width: 280px;
      box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
    }
    
    .dev-title {
      color: #00ff88;
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 4px 0;
    }
    
    .dev-hint {
      color: #888;
      font-size: 11px;
      margin: 0 0 16px 0;
    }
    
    .dev-section {
      margin-bottom: 16px;
    }
    
    .dev-section:last-child {
      margin-bottom: 0;
    }
    
    .dev-label {
      display: block;
      color: #00ff88;
      font-size: 12px;
      margin-bottom: 6px;
    }
    
    .dev-slider {
      width: 100%;
      height: 6px;
      background: #333;
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    .dev-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: #00ff88;
      border-radius: 50%;
      cursor: pointer;
    }
    
    .dev-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #00ff88;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    
    .dev-button {
      width: 100%;
      padding: 10px;
      background: #1a1a1a;
      border: 1px solid #00ff88;
      color: #00ff88;
      font-size: 13px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .dev-button:hover {
      background: #00ff88;
      color: #000;
    }
    
    .dev-button:active {
      transform: scale(0.98);
    }
    
    .dev-input {
      width: 100%;
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #444;
      color: #00ff88;
      font-size: 11px;
      font-family: 'Courier New', monospace;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    
    .dev-input:focus {
      outline: none;
      border-color: #00ff88;
    }
    
    .dev-button-group {
      display: flex;
      gap: 8px;
    }
    
    .dev-button-small {
      flex: 1;
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #00ff88;
      color: #00ff88;
      font-size: 11px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .dev-button-small:hover {
      background: #00ff88;
      color: #000;
    }
    
    #glitchValue {
      color: #fff;
      font-weight: bold;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlay);
  
  return overlay;
}

/**
 * Toggle overlay visibility
 */
function toggleOverlay() {
  if (!overlayEl) return;
  
  overlayVisible = !overlayVisible;
  overlayEl.classList.toggle('visible', overlayVisible);
  
  if (import.meta.env.DEV) {
    console.info('[DevControls] Overlay', overlayVisible ? 'shown' : 'hidden');
  }
}

/**
 * Wire up event listeners for controls
 */
function setupListeners() {
  // Glitch level slider
  const slider = document.getElementById('glitchSlider');
  const valueDisplay = document.getElementById('glitchValue');
  
  if (slider && valueDisplay) {
    slider.addEventListener('input', (e) => {
      const level = parseFloat(e.target.value);
      valueDisplay.textContent = level.toFixed(2);
      
      if (window.GlitchFX) {
        window.GlitchFX.setLevel(level);
      }
      
      if (import.meta.env.DEV) {
        console.info('[DevControls] Glitch level set to', level);
      }
    });
    
    // Sync initial value if glitch API exists
    if (window.GlitchFX) {
      const currentLevel = window.GlitchFX.getLevel();
      slider.value = currentLevel;
      valueDisplay.textContent = currentLevel.toFixed(2);
    }
  }
  
  // Force audio ended
  const audioEndBtn = document.getElementById('forceAudioEnd');
  if (audioEndBtn) {
    audioEndBtn.addEventListener('click', () => {
      if (window.__AUDIO_API__ && window.__AUDIO_API__.revealPortal) {
        window.__AUDIO_API__.revealPortal();
        
        if (import.meta.env.DEV) {
          console.info('[DevControls] Forced audio ended → portal revealed');
        }
      } else {
        console.warn('[DevControls] Audio API not available');
      }
    });
  }
  
  // Force T-0 state
  const tZeroBtn = document.getElementById('forceTZero');
  if (tZeroBtn) {
    tZeroBtn.addEventListener('click', () => {
      if (window.__COUNTDOWN_API__ && window.__COUNTDOWN_API__.setMockDate) {
        // Set mock date to exactly target time
        window.__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
        
        if (import.meta.env.DEV) {
          console.info('[DevControls] Forced T-0 state → mock date set to TARGET');
        }
        
        // Wait a moment for countdown to update
        setTimeout(() => {
          if (import.meta.env.DEV) {
            console.info('[DevControls] T-0 state active, glitch level:', window.GlitchFX?.getLevel());
          }
        }, 100);
      } else {
        console.warn('[DevControls] Countdown API not available');
      }
    });
  }
  
  // Mock date controls
  const mockInput = document.getElementById('mockDateInput');
  const setMockBtn = document.getElementById('setMockDate');
  const clearMockBtn = document.getElementById('clearMockDate');
  
  if (setMockBtn && mockInput) {
    setMockBtn.addEventListener('click', () => {
      const dateStr = mockInput.value.trim();
      if (!dateStr) return;
      
      try {
        // Validate date
        const testDate = new Date(dateStr);
        if (isNaN(testDate.getTime())) {
          throw new Error('Invalid date format');
        }
        
        if (window.__COUNTDOWN_API__ && window.__COUNTDOWN_API__.setMockDate) {
          window.__COUNTDOWN_API__.setMockDate(dateStr);
          
          if (import.meta.env.DEV) {
            console.info('[DevControls] Mock date set to:', dateStr);
            console.info('[DevControls] Days remaining:', window.__COUNTDOWN_API__.getDaysRemaining());
          }
        }
      } catch (err) {
        console.error('[DevControls] Invalid date:', err.message);
        alert('Invalid date format. Use ISO 8601 (e.g., 2025-11-11T18:11:00Z)');
      }
    });
  }
  
  if (clearMockBtn) {
    clearMockBtn.addEventListener('click', () => {
      if (window.__COUNTDOWN_API__ && window.__COUNTDOWN_API__.clearMockDate) {
        window.__COUNTDOWN_API__.clearMockDate();
        
        if (mockInput) {
          mockInput.value = '';
        }
        
        if (import.meta.env.DEV) {
          console.info('[DevControls] Mock date cleared → using real time');
        }
      }
    });
  }
  
  // Show portal button
  const showPortalBtn = document.getElementById('showPortalBtn');
  if (showPortalBtn) {
    showPortalBtn.addEventListener('click', () => {
      if (window.__GATE_API__ && window.__GATE_API__.showPortal) {
        window.__GATE_API__.showPortal();
        
        if (import.meta.env.DEV) {
          console.info('[DevControls] Portal manually revealed');
        }
      } else {
        console.warn('[DevControls] Gate API not available');
      }
    });
  }
}

/**
 * Initialize dev controls
 * Only runs in development mode
 */
export function initDevControls() {
  // Only enable in development
  if (!import.meta.env.DEV) {
    return;
  }
  
  console.info('[DevControls] Initializing dev overlay (press ` to toggle)');
  
  // Create overlay
  overlayEl = createOverlay();
  
  // Setup event listeners
  setupListeners();
  
  // Global keyboard listener for backtick
  document.addEventListener('keydown', (e) => {
    // Backtick key (keyCode 192, key "`")
    if (e.key === '`' || e.code === 'Backquote') {
      // Don't toggle if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      e.preventDefault();
      toggleOverlay();
    }
  });
  
  // Expose toggle function globally for console access
  window.__DEV_TOGGLE_OVERLAY__ = toggleOverlay;
  
  console.info('[DevControls] Ready. Press ` (backtick) to toggle overlay.');
}
