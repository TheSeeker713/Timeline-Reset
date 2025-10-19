/**
 * Glitch FX Component
 * Manages the glitch vignette overlay with intensity control
 */

let glitchLayer = null;
let currentLevel = 0.0;

/**
 * Initialize glitch layer
 * @param {string} elementId - ID of glitch layer element
 */
export function initGlitch(elementId = 'glitch-layer') {
  glitchLayer = document.getElementById(elementId);
  
  if (!glitchLayer) {
    console.error(`Glitch layer element #${elementId} not found`);
    return;
  }
  
  // Start with layer visible but low intensity
  glitchLayer.classList.add('active');
  setLevel(0.1);
  
  console.log('✨ GlitchFX initialized');
}

/**
 * Set glitch intensity level
 * @param {number} level - Intensity from 0.0 to 1.0
 */
export function setLevel(level) {
  if (!glitchLayer) return;
  
  currentLevel = Math.max(0, Math.min(1, level));
  
  // Update data attribute for CSS
  if (currentLevel === 0) {
    glitchLayer.style.opacity = '0';
  } else if (currentLevel < 0.3) {
    glitchLayer.setAttribute('data-intensity', 'low');
    glitchLayer.style.opacity = String(currentLevel);
  } else if (currentLevel < 0.6) {
    glitchLayer.setAttribute('data-intensity', 'medium');
    glitchLayer.style.opacity = String(currentLevel);
  } else if (currentLevel < 0.9) {
    glitchLayer.setAttribute('data-intensity', 'high');
    glitchLayer.style.opacity = String(currentLevel);
  } else {
    glitchLayer.setAttribute('data-intensity', 'extreme');
    glitchLayer.style.opacity = '1';
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
 * Get glitch API for global exposure
 */
export const GlitchFX = {
  setLevel,
  getLevel,
  stepTo,
};
