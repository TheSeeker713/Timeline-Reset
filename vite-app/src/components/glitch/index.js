/**
 * Glitch FX Component
 * Manages the glitch vignette overlay with intensity control using CSS variables
 */

let glitchLayer = null;
let currentLevel = 0.0;

/**
 * Setup and mount glitch styles
 * Binds to #glitch-layer element
 * @returns {Object} GlitchFX API
 */
export function setupGlitch() {
  glitchLayer = document.getElementById('glitch-layer');
  
  if (!glitchLayer) {
    console.error('Glitch layer element #glitch-layer not found');
    return null;
  }
  
  // Initialize with low intensity
  glitchLayer.classList.add('active');
  setLevel(0.12);
  
  if (import.meta.env.DEV) {
    console.info('✨ GlitchFX mounted and initialized');
  }
  
  return GlitchFX;
}

/**
 * Set glitch intensity level
 * Updates CSS variable --glitch-level which controls all effects
 * @param {number} level - Intensity from 0.0 to 1.0
 */
export function setLevel(level) {
  if (!glitchLayer) return;
  
  currentLevel = Math.max(0, Math.min(1, level));
  
  // Set CSS variable for amplitude control
  glitchLayer.style.setProperty('--glitch-level', String(currentLevel));
  
  // Update opacity based on level
  if (currentLevel === 0) {
    glitchLayer.style.opacity = '0';
  } else if (currentLevel < 0.3) {
    glitchLayer.style.opacity = String(currentLevel * 1.5); // Boost visibility at low levels
  } else {
    glitchLayer.style.opacity = String(Math.min(currentLevel * 1.2, 1.0));
  }
  
  // Update data attribute for CSS intensity tiers
  if (currentLevel < 0.3) {
    glitchLayer.setAttribute('data-intensity', 'low');
  } else if (currentLevel < 0.6) {
    glitchLayer.setAttribute('data-intensity', 'medium');
  } else if (currentLevel < 0.9) {
    glitchLayer.setAttribute('data-intensity', 'high');
  } else {
    glitchLayer.setAttribute('data-intensity', 'extreme');
  }
}

/**
 * Get current intensity level
 * @returns {number} Current level (0.0 to 1.0)
 */
export function getLevel() {
  return currentLevel;
}

/**
 * Animate to a target intensity level
 * @param {number} targetLevel - Target intensity (0.0 to 1.0)
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Resolves when animation completes
 */
export function stepTo(targetLevel, duration = 1000) {
  return new Promise((resolve) => {
    const startLevel = currentLevel;
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const newLevel = startLevel + (targetLevel - startLevel) * eased;
      setLevel(newLevel);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(animate);
  });
}

/**
 * Glitch FX API
 * Exposed for external control and testing
 */
export const GlitchFX = {
  setLevel,
  getLevel,
  stepTo,
};
