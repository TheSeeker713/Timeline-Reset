# Timeline Reset - Test Matrix

**Version**: Modular Vite Build  
**Date**: 2025-10-19  
**Status**: Active Testing  

---

## Quick Start

Open browser console and run:
```javascript
// Check all APIs available
console.log('APIs:', {
  GlitchFX: typeof GlitchFX,
  Countdown: typeof __COUNTDOWN_API__,
  Audio: typeof __AUDIO_API__,
  Gate: typeof __GATE_API__
});
```

Expected: All should return `"object"`

---

## A) Unit-ish Checks (Dev Console)

### A1: GlitchFX Amplitude Variation

**Purpose**: Verify glitch effects scale with intensity level

**Steps**:
```javascript
// Test low intensity
GlitchFX.setLevel(0.1);
// Observe: Subtle vignette, minimal movement

// Test medium intensity
GlitchFX.setLevel(0.5);
// Observe: Visible vignette, moderate RGB split, noticeable animation

// Test high intensity
GlitchFX.setLevel(1.0);
// Observe: Strong vignette, aggressive RGB split, scanline visible, fast animation

// Verify getter
console.log('Current level:', GlitchFX.getLevel());
// Expected: 1.0

// Test animation
GlitchFX.stepTo(0.0, 2000);
// Observe: Smooth 2-second fade to zero
```

**Pass Criteria**:
- ✅ Visibly different effects at 0.1, 0.5, 1.0
- ✅ Center ~60% remains minimally affected at all levels
- ✅ `getLevel()` returns set value
- ✅ `stepTo()` animates smoothly

---

### A2: Countdown Math Across Time Zones

**Purpose**: Verify countdown calculations are timezone-independent

**Steps**:
```javascript
// Check target
const target = __COUNTDOWN_API__.getTarget();
console.log('Target UTC:', target.toISOString());
// Expected: 2025-11-11T18:11:00.000Z

console.log('Target Local:', target.toLocaleString());
// Expected: Local timezone conversion

// Check days remaining (current real time)
const days = __COUNTDOWN_API__.getDaysRemaining();
console.log('Days remaining:', days);
// Expected: Positive number (if before target)

// Test with mock dates
__COUNTDOWN_API__.setMockDate('2025-11-10T18:11:00Z'); // 1 day before
console.log('Days remaining (mocked):', __COUNTDOWN_API__.getDaysRemaining());
// Expected: ~1.0

__COUNTDOWN_API__.setMockDate('2025-11-11T06:11:00Z'); // 12 hours before
console.log('Days remaining (mocked):', __COUNTDOWN_API__.getDaysRemaining());
// Expected: ~0.5

__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z'); // Exactly at target
console.log('Days remaining (mocked):', __COUNTDOWN_API__.getDaysRemaining());
// Expected: 0

__COUNTDOWN_API__.clearMockDate();
```

**Pass Criteria**:
- ✅ Target is 2025-11-11T18:11:00.000Z (11:11 AM Denver MST)
- ✅ Days remaining decreases correctly with mock dates
- ✅ Countdown display updates with mock date
- ✅ Timezone doesn't affect calculations (all UTC-based)

---

### A3: onZero Path Triggers Takeover

**Purpose**: Verify T-0 event triggers full glitch takeover

**Steps**:
```javascript
// Set mock date to T-0
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');

// Wait 2 seconds for countdown to update and trigger onZero
setTimeout(() => {
  // Check glitch level
  console.log('Glitch level at T-0:', GlitchFX.getLevel());
  // Expected: 1.0
  
  // Check countdown message
  const message = document.querySelector('.countdown-message');
  console.log('Countdown message:', message?.textContent);
  // Expected: "SIGNAL BREACHED"
  
  // Check if message has glitch class
  console.log('Has glitch-text class:', message?.classList.contains('glitch-text'));
  // Expected: true
}, 2000);

// Clean up
setTimeout(() => {
  __COUNTDOWN_API__.clearMockDate();
}, 5000);
```

**Pass Criteria**:
- ✅ Glitch level reaches 1.0
- ✅ Countdown shows "00:00:00:00"
- ✅ Message changes to "SIGNAL BREACHED"
- ✅ Glitch text effects applied to message
- ✅ Console logs T-0 event

---

## B) Gate Checks

### B1: Pre-TARGET Rejection with Random Phrases

**Purpose**: Verify gate blocks submission before TARGET with random phrases

**Steps**:
```javascript
// Set date before TARGET
__COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');

// Show portal if not visible
__GATE_API__.showPortal();

// Get all 11 phrases for reference
console.log('Available phrases:', __GATE_API__.getPhrases());

// Collect 20 rejections to verify randomness
const phrases = [];
for (let i = 0; i < 20; i++) {
  const phrase = __GATE_API__.getRandomPhrase();
  phrases.push(phrase);
  console.log(`Attempt ${i + 1}:`, phrase);
}

// Check uniqueness
const uniquePhrases = [...new Set(phrases)];
console.log('Unique phrases from 20 attempts:', uniquePhrases.length);
// Expected: At least 8-10 unique phrases (good distribution)

// Manual test: Submit form multiple times
// 1. Enter text in input
// 2. Click "Initiate Sequence"
// 3. Observe error message shows ONE random phrase + "It is not yet time."
// 4. Repeat to see different phrases

// Clean up
__COUNTDOWN_API__.clearMockDate();
```

**Pass Criteria**:
- ✅ Form submission prevented (no page reload)
- ✅ Error display shows ONE phrase from the 11-line list
- ✅ Error always ends with "It is not yet time."
- ✅ Different phrase on each submission (mostly)
- ✅ Good distribution across multiple attempts

---

### B2: Post-TARGET Acceptance

**Purpose**: Verify gate accepts submission after TARGET

**Steps**:
```javascript
// Set date at/after TARGET
__COUNTDOWN_API__.setMockDate('2025-11-12T00:00:00Z');

// Check gate status
console.log('Target reached:', __GATE_API__.isTargetReached());
// Expected: true

// Show portal if not visible
__GATE_API__.showPortal();

// Manual test:
// 1. Enter text in input field
// 2. Click "Initiate Sequence"
// 3. Observe success message
// 4. Form should be disabled

// Programmatic test
__GATE_API__.showSuccess();

// Check form state
const input = document.getElementById('gateInput');
const button = document.querySelector('#gateForm button[type="submit"]');
console.log('Input disabled:', input.disabled);
// Expected: true
console.log('Button disabled:', button.disabled);
// Expected: true

// Check success message visible
const success = document.getElementById('gateSuccess');
console.log('Success visible:', !success.classList.contains('hidden'));
// Expected: true

// Clean up
__COUNTDOWN_API__.clearMockDate();
```

**Pass Criteria**:
- ✅ Form submission prevented (no page reload)
- ✅ Success message displays: "Temporal lock disengaged. You may proceed."
- ✅ Input field disabled
- ✅ Submit button disabled
- ✅ Error message hidden
- ✅ Console logs acceptance

---

### B3: Input Change Behavior

**Purpose**: Verify error hides when user types

**Steps**:
```javascript
// Setup: Show error first
__COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
__GATE_API__.showPortal();
__GATE_API__.showRejection();

// Check error visible
const errorDiv = document.getElementById('gateError');
console.log('Error visible before input:', !errorDiv.classList.contains('hidden'));
// Expected: true

// Simulate typing in input
const input = document.getElementById('gateInput');
input.value = 'test';
input.dispatchEvent(new Event('input', { bubbles: true }));

// Check error after input
console.log('Error visible after input:', !errorDiv.classList.contains('hidden'));
// Expected: false

// Clean up
__COUNTDOWN_API__.clearMockDate();
```

**Pass Criteria**:
- ✅ Error visible initially
- ✅ Error hides when user types
- ✅ Success message persists (doesn't hide on input)

---

## C) Player Checks

### C1: First Click Starts Audio

**Purpose**: Verify audio plays on first click only

**Steps**:
```javascript
// Check initial state
console.log('Is playing:', __AUDIO_API__.isPlaying());
// Expected: false
console.log('Has played:', __AUDIO_API__.hasPlayed());
// Expected: false

// Manual test:
// 1. Click play button
// 2. Observe audio starts
// 3. Play button gets "playing" class
// 4. Button opacity reduces to 0.5
// 5. Cursor changes to default

// Check state after playing
setTimeout(() => {
  console.log('Is playing:', __AUDIO_API__.isPlaying());
  // Expected: true
  console.log('Has played:', __AUDIO_API__.hasPlayed());
  // Expected: true
  
  const button = document.getElementById('playBtn');
  console.log('Button has playing class:', button.classList.contains('playing'));
  // Expected: true
  console.log('Button aria-pressed:', button.getAttribute('aria-pressed'));
  // Expected: "true"
}, 1000);

// Try clicking again while playing
// Expected: No action, audio doesn't restart
```

**Pass Criteria**:
- ✅ Audio plays on first click
- ✅ Button gets "playing" class
- ✅ Button opacity changes
- ✅ `isPlaying()` returns true during playback
- ✅ `hasPlayed()` returns true after start
- ✅ Additional clicks ignored while playing
- ✅ No audio restart or errors

---

### C2: End Event Triggers Portal

**Purpose**: Verify portal reveals when audio ends

**Steps**:
```javascript
// Fast-forward test: Manually trigger audio end
const audio = document.getElementById('audioPlayer');

// Check portal initially hidden
const portal = document.getElementById('portal');
console.log('Portal hidden initially:', portal.classList.contains('hidden'));
// Expected: true

// Simulate audio end (wait for actual playback or force)
audio.currentTime = audio.duration - 1; // Jump near end
audio.play();

// Wait for end event
audio.addEventListener('ended', () => {
  console.log('Audio ended event fired');
  
  // Check portal after short delay (500ms in code)
  setTimeout(() => {
    console.log('Portal hidden after audio:', portal.classList.contains('hidden'));
    // Expected: false
    
    console.log('Portal scrolled into view');
    // Expected: Visual confirmation
  }, 600);
}, { once: true });

// OR use API to reveal manually
__AUDIO_API__.revealPortal();
```

**Pass Criteria**:
- ✅ Portal hidden initially
- ✅ Audio end event triggers after playback
- ✅ Portal unhides 500ms after audio ends
- ✅ Page scrolls to portal smoothly
- ✅ Input receives focus after scroll
- ✅ Console logs portal reveal

---

### C3: No Autoplay, No Loop

**Purpose**: Verify audio respects constraints

**Steps**:
```javascript
// Check audio element attributes
const audio = document.getElementById('audioPlayer');
console.log('Has autoplay:', audio.hasAttribute('autoplay'));
// Expected: false
console.log('Has loop:', audio.hasAttribute('loop'));
// Expected: false
console.log('Audio paused:', audio.paused);
// Expected: true

// Reload page and check audio doesn't start
// Expected: Silence until user clicks
```

**Pass Criteria**:
- ✅ No autoplay attribute
- ✅ No loop attribute
- ✅ Audio paused on page load
- ✅ Only plays on user interaction

---

## D) Accessibility

### D1: Play Button Focus and Keyboard

**Purpose**: Verify keyboard accessibility for audio control

**Manual Steps**:
1. Press Tab until play button has focus
2. Verify visible focus ring (blue outline)
3. Press Space key
4. Verify audio starts playing
5. Reload page
6. Tab to button again
7. Press Enter key
8. Verify audio starts playing

**Console Check**:
```javascript
const button = document.getElementById('playBtn');
console.log('Button role:', button.getAttribute('role'));
// Expected: "button"
console.log('Button tabindex:', button.getAttribute('tabindex'));
// Expected: "0"
console.log('Button aria-label:', button.getAttribute('aria-label'));
// Expected: "Play audio" or similar
```

**Pass Criteria**:
- ✅ Button focusable with Tab key
- ✅ Visible focus indicator
- ✅ Space key triggers play
- ✅ Enter key triggers play
- ✅ ARIA role="button"
- ✅ Accessible label

---

### D2: Gate Form Accessibility

**Purpose**: Verify portal form accessibility

**Manual Steps**:
1. Reveal portal: `__GATE_API__.showPortal()`
2. Check input has focus automatically
3. Tab through form elements
4. Verify focus indicators
5. Submit with Enter key

**Console Check**:
```javascript
const input = document.getElementById('gateInput');
const errorDiv = document.getElementById('gateError');

console.log('Input aria-label:', input.getAttribute('aria-label'));
// Expected: "Temporal coordinates input" or similar

console.log('Error div role:', errorDiv.getAttribute('role'));
// Expected: Should have role="alert" for screen readers

console.log('Input has focus:', document.activeElement === input);
// Expected: true (after showPortal)
```

**Pass Criteria**:
- ✅ Input auto-focuses on portal reveal
- ✅ Input has aria-label
- ✅ Error region announces changes
- ✅ Form submits with Enter key
- ✅ All form elements keyboard accessible

---

### D3: ARIA-Live Announcements

**Purpose**: Verify screen reader announcements

**Console Check**:
```javascript
// Check for aria-live region
const liveRegion = document.querySelector('[aria-live]');
console.log('ARIA-live region exists:', !!liveRegion);
// Expected: true
console.log('ARIA-live value:', liveRegion?.getAttribute('aria-live'));
// Expected: "polite" or "assertive"

// Test audio state announcement
__AUDIO_API__.play();
setTimeout(() => {
  console.log('Live region text:', liveRegion?.textContent);
  // Expected: "Audio is now playing" or similar
}, 100);
```

**Pass Criteria**:
- ✅ ARIA-live region exists
- ✅ Audio state changes announced
- ✅ Portal reveal announced
- ✅ Gate errors announced
- ✅ Success message announced

---

### D4: Reduced Motion Support

**Purpose**: Verify prefers-reduced-motion support

**Enable Reduced Motion**:
- Windows: Settings → Accessibility → Visual effects → Animation effects: Off
- Mac: System Preferences → Accessibility → Display → Reduce motion
- Linux: Depends on DE (GNOME: Settings → Accessibility → Seeing → Reduce animation)

**Manual Test**:
1. Enable reduced motion in OS
2. Reload page
3. Verify animations significantly reduced:
   - Glitch effects minimal or static
   - Smooth scroll becomes instant
   - Transitions shortened
   - No rapid flashing

**Console Check**:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
console.log('Prefers reduced motion:', prefersReducedMotion);
// Expected: true (if enabled in OS)
```

**Pass Criteria**:
- ✅ Glitch animations reduced/disabled
- ✅ Smooth scrolling replaced with instant
- ✅ Transitions significantly shortened
- ✅ No motion sickness triggers
- ✅ Core functionality still works

---

## E) Performance

### E1: Smooth Rendering at 0.5 Glitch

**Purpose**: Verify no layout thrashing or frame drops

**Steps**:
```javascript
// Set moderate glitch level
GlitchFX.setLevel(0.5);

// Open DevTools → Performance tab
// 1. Start recording
// 2. Let run for 10 seconds
// 3. Stop recording
// 4. Check:
//    - FPS should be near 60fps
//    - No red bars (layout thrashing)
//    - No long tasks (yellow)
//    - GPU usage moderate

// Check performance metrics
performance.mark('glitch-test-start');
GlitchFX.stepTo(0.8, 5000);
setTimeout(() => {
  performance.mark('glitch-test-end');
  performance.measure('glitch-transition', 'glitch-test-start', 'glitch-test-end');
  const measure = performance.getEntriesByName('glitch-transition')[0];
  console.log('Transition duration:', measure.duration, 'ms');
  // Expected: ~5000ms, smooth animation
}, 5100);
```

**Pass Criteria**:
- ✅ Consistent 60fps (or device refresh rate)
- ✅ No layout thrashing (< 5% time in Layout)
- ✅ CSS animations GPU-accelerated
- ✅ No jank or stuttering
- ✅ Memory usage stable

---

### E2: Low-End Hardware Check

**Purpose**: Verify acceptable performance on lower-end devices

**Simulated Test (Chrome DevTools)**:
1. Open DevTools → Performance
2. Click gear icon → CPU: 4x slowdown
3. Set glitch level to 0.5
4. Record performance for 10 seconds

**Pass Criteria**:
- ✅ Minimum 30fps on 4x CPU throttle
- ✅ Page remains interactive
- ✅ No freezing or blocking
- ✅ Animations may be choppy but not broken

---

### E3: CSS Filter Optimization

**Purpose**: Verify expensive CSS filters not applied to large areas

**Console Check**:
```javascript
// Check glitch layer
const glitchLayer = document.getElementById('glitch-layer');
const styles = window.getComputedStyle(glitchLayer);
console.log('Glitch layer size:', {
  width: glitchLayer.offsetWidth,
  height: glitchLayer.offsetHeight
});

// Check if using GPU acceleration
console.log('Transform style:', styles.transform);
console.log('Will-change:', styles.willChange);

// Filters should be minimal or hardware-accelerated
console.log('Filter:', styles.filter);
// Expected: Minimal use or none

// Check for hardware acceleration hints
const layer3d = glitchLayer.style.transform.includes('translate3d') || 
                glitchLayer.style.transform.includes('translateZ');
console.log('Using 3D transforms (GPU):', layer3d);
```

**Pass Criteria**:
- ✅ Glitch layer uses GPU acceleration
- ✅ Expensive filters avoided on full-screen elements
- ✅ `will-change` or `transform: translateZ(0)` used
- ✅ Animations use `transform` and `opacity` only

---

## F) Dev Control Overlay Tests

### F1: Toggle Overlay

**Purpose**: Verify dev overlay appears/disappears

**Steps**:
1. Press backtick (\`) key
2. Verify overlay appears in top-right corner
3. Press backtick again
4. Verify overlay disappears

**Pass Criteria**:
- ✅ Overlay toggles with backtick key
- ✅ Overlay positioned correctly (no overlap with content)
- ✅ Overlay has semi-transparent background
- ✅ Overlay only available in dev mode

---

### F2: Glitch Level Slider

**Purpose**: Verify slider controls glitch intensity

**Steps**:
1. Open overlay (\`)
2. Drag glitch level slider
3. Verify glitch effects change in real-time
4. Check value display updates

**Pass Criteria**:
- ✅ Slider range 0.0 to 1.0
- ✅ Real-time glitch updates
- ✅ Value display shows current level
- ✅ Smooth slider interaction

---

### F3: Force Audio Ended

**Purpose**: Verify button triggers portal reveal

**Steps**:
1. Open overlay
2. Click "Force Audio Ended" button
3. Verify portal reveals
4. Verify portal scrolls into view

**Pass Criteria**:
- ✅ Button triggers audio end callback
- ✅ Portal reveals immediately
- ✅ No actual audio playback
- ✅ Console logs action

---

### F4: Force T-0 State

**Purpose**: Verify button triggers T-0 takeover

**Steps**:
1. Open overlay
2. Click "Force T-0 State" button
3. Verify glitch level goes to 1.0
4. Verify countdown shows "SIGNAL BREACHED"
5. Verify countdown shows 00:00:00:00

**Pass Criteria**:
- ✅ Button triggers T-0 callback
- ✅ Full glitch takeover
- ✅ Countdown message changes
- ✅ Console logs T-0 event

---

## G) Production Build Tests

### G1: No Console Logs in Production

**Purpose**: Verify logs stripped from production build

**Steps**:
```bash
# Build for production
npm run build

# Serve production build
npm run preview

# Open browser console
# Navigate through all features
# Verify no console.log/console.info output
```

**Pass Criteria**:
- ✅ No console logs in production
- ✅ No dev overlay in production
- ✅ All features work without logs
- ✅ console.error still works for critical issues

---

### G2: Bundle Size Check

**Purpose**: Verify reasonable bundle size

**Steps**:
```bash
# Build and check size
npm run build

# Check dist folder
# Expected:
# - index.html: < 5KB
# - main.js: < 50KB (gzipped < 20KB)
# - styles.css: < 20KB (gzipped < 5KB)
```

**Pass Criteria**:
- ✅ Total bundle < 100KB uncompressed
- ✅ Gzipped < 30KB total
- ✅ No unused dependencies
- ✅ Tree shaking working

---

## Test Matrix Summary

| Category | Tests | Pass Rate |
|----------|-------|-----------|
| **A) Unit Checks** | 3 tests | ___ / 3 |
| **B) Gate Checks** | 3 tests | ___ / 3 |
| **C) Player Checks** | 3 tests | ___ / 3 |
| **D) Accessibility** | 4 tests | ___ / 4 |
| **E) Performance** | 3 tests | ___ / 3 |
| **F) Dev Overlay** | 4 tests | ___ / 4 |
| **G) Production** | 2 tests | ___ / 2 |
| **TOTAL** | **22 tests** | **___ / 22** |

---

## Automated Test Runner

Quick validation script (paste in console):

```javascript
async function runQuickTests() {
  console.log('🧪 Running quick validation tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: APIs available
  try {
    if (typeof GlitchFX === 'object' && 
        typeof __COUNTDOWN_API__ === 'object' &&
        typeof __AUDIO_API__ === 'object' &&
        typeof __GATE_API__ === 'object') {
      console.log('✅ Test 1: All APIs available');
      passed++;
    } else {
      throw new Error('APIs missing');
    }
  } catch (e) {
    console.log('❌ Test 1 FAILED:', e.message);
    failed++;
  }
  
  // Test 2: Glitch level control
  try {
    GlitchFX.setLevel(0.5);
    if (Math.abs(GlitchFX.getLevel() - 0.5) < 0.01) {
      console.log('✅ Test 2: Glitch level control works');
      passed++;
    } else {
      throw new Error('Level mismatch');
    }
  } catch (e) {
    console.log('❌ Test 2 FAILED:', e.message);
    failed++;
  }
  
  // Test 3: Target date correct
  try {
    const target = __COUNTDOWN_API__.getTarget();
    if (target.toISOString() === '2025-11-11T18:11:00.000Z') {
      console.log('✅ Test 3: Target date correct');
      passed++;
    } else {
      throw new Error('Wrong target date');
    }
  } catch (e) {
    console.log('❌ Test 3 FAILED:', e.message);
    failed++;
  }
  
  // Test 4: Rejection phrases
  try {
    const phrases = __GATE_API__.getPhrases();
    if (phrases.length === 11) {
      console.log('✅ Test 4: 11 rejection phrases loaded');
      passed++;
    } else {
      throw new Error(`Expected 11 phrases, got ${phrases.length}`);
    }
  } catch (e) {
    console.log('❌ Test 4 FAILED:', e.message);
    failed++;
  }
  
  // Test 5: Mock date mechanism
  try {
    __COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
    const days = __COUNTDOWN_API__.getDaysRemaining();
    __COUNTDOWN_API__.clearMockDate();
    if (days > 0 && days < 2) {
      console.log('✅ Test 5: Mock date mechanism works');
      passed++;
    } else {
      throw new Error('Mock date calculation wrong');
    }
  } catch (e) {
    console.log('❌ Test 5 FAILED:', e.message);
    failed++;
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(failed === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed');
}

runQuickTests();
```

---

## Known Issues & Limitations

### Expected Behaviors (Not Bugs)
1. **Mock date global**: Affects all time-dependent systems
2. **Single audio playback**: No replay without refresh (by design)
3. **Success state permanent**: No reset after gate success
4. **Dev overlay in dev only**: Not available in production build

### Browser Compatibility
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (with iOS audio unlock)
- ⚠️ IE11: Not supported (ES6+ required)

---

## Test Completion Checklist

- [ ] All unit checks pass
- [ ] Gate validation works pre/post TARGET
- [ ] Audio player respects constraints
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Reduced motion mode tested
- [ ] Performance acceptable (60fps @ 0.5 glitch)
- [ ] Dev overlay functional
- [ ] Production logs stripped
- [ ] Bundle size reasonable

**Sign-off**: ________________  **Date**: ________
