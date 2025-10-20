# Audio Control Test Suite

## Quick Test Commands

Open browser console and run these commands to verify audio control functionality.

## 1. Initial State Verification

```javascript
// Check audio control initialization
console.log('Audio API available:', typeof __AUDIO_API__ !== 'undefined');
console.log('Is playing:', __AUDIO_API__.isPlaying());
console.log('Has played:', __AUDIO_API__.hasPlayed());

// Check elements exist
console.log('Play button:', document.getElementById('playBtn') !== null);
console.log('Audio element:', document.getElementById('resetAudio') !== null);
console.log('Portal element:', document.getElementById('portal') !== null);
console.log('ARIA status:', document.getElementById('audioStatus') !== null);

// Check portal is hidden initially
const portal = document.getElementById('portal');
console.log('Portal hidden:', portal.classList.contains('hidden'));
```

**Expected Output**:
```
Audio API available: true
Is playing: false
Has played: false
Play button: true
Audio element: true
Portal element: true
ARIA status: true
Portal hidden: true
```

## 2. Manual Play Test

```javascript
// Trigger audio playback manually
console.log('🎵 Starting manual play test...');
__AUDIO_API__.play();

// Check state immediately after
setTimeout(() => {
    console.log('Playing:', __AUDIO_API__.isPlaying());
    console.log('Has played:', __AUDIO_API__.hasPlayed());
    console.log('Button has "playing" class:', 
        document.getElementById('playBtn').classList.contains('playing'));
}, 100);
```

**Expected Output**:
```
🎵 Starting manual play test...
🔊 Audio playback started
Playing: true
Has played: true
Button has "playing" class: true
```

## 3. Duplicate Click Prevention Test

```javascript
// Try to play multiple times
console.log('Testing duplicate click prevention...');

const results = [];

// First click
__AUDIO_API__.play().then(() => results.push('Play 1: Success'));

// Second click (should be ignored)
setTimeout(() => {
    __AUDIO_API__.play().then(() => results.push('Play 2: Success'));
}, 100);

// Third click (should be ignored)
setTimeout(() => {
    __AUDIO_API__.play().then(() => results.push('Play 3: Success'));
}, 200);

// Check results
setTimeout(() => {
    console.log('Results:', results);
    console.log(results.length === 1 ? '✅ Duplicate prevention works' : '❌ Multiple plays occurred');
}, 500);
```

**Expected Output**:
```
Testing duplicate click prevention...
Audio already playing
Audio already playing
Results: ['Play 1: Success']
✅ Duplicate prevention works
```

## 4. Audio End Simulation Test

```javascript
// Simulate audio ending
async function testAudioEnd() {
    console.log('🧪 Testing audio end behavior...');
    
    // Get elements
    const audio = document.getElementById('resetAudio');
    const portal = document.getElementById('portal');
    const playBtn = document.getElementById('playBtn');
    
    // Record initial state
    const initialHidden = portal.classList.contains('hidden');
    console.log('Portal initially hidden:', initialHidden);
    
    // Trigger ended event
    audio.dispatchEvent(new Event('ended'));
    
    // Wait for portal reveal (500ms delay + 300ms scroll delay)
    await new Promise(r => setTimeout(r, 1000));
    
    // Check results
    const portalRevealed = !portal.classList.contains('hidden');
    const buttonDisabled = playBtn.disabled;
    const buttonPlaying = playBtn.classList.contains('playing');
    
    console.log('Portal revealed:', portalRevealed);
    console.log('Button disabled:', buttonDisabled);
    console.log('Button still has "playing" class:', buttonPlaying);
    
    if (portalRevealed && buttonDisabled && !buttonPlaying) {
        console.log('✅ Audio end behavior correct');
    } else {
        console.log('❌ Audio end behavior incorrect');
    }
}

testAudioEnd();
```

**Expected Output**:
```
🧪 Testing audio end behavior...
Portal initially hidden: true
🎵 Audio playback complete
🌀 Portal revealed
Portal revealed: true
Button disabled: true
Button still has "playing" class: false
✅ Audio end behavior correct
```

## 5. Keyboard Accessibility Test

```javascript
// Test Space and Enter keys
function testKeyboard() {
    console.log('Testing keyboard controls...');
    
    const playBtn = document.getElementById('playBtn');
    
    // Focus button
    playBtn.focus();
    console.log('Button focused:', document.activeElement === playBtn);
    
    // Test Space key
    console.log('\nTesting Space key...');
    const spaceEvent = new KeyboardEvent('keydown', { 
        key: ' ',
        code: 'Space',
        bubbles: true 
    });
    playBtn.dispatchEvent(spaceEvent);
    
    setTimeout(() => {
        console.log('Playing after Space:', __AUDIO_API__.isPlaying());
        
        // Reset for Enter test
        location.reload();
    }, 500);
}

testKeyboard();
```

**Expected Behavior**:
- Button should receive focus
- Space key should trigger play
- Audio should start
- Page should not scroll (preventDefault)

## 6. ARIA Announcements Test

```javascript
// Monitor ARIA live region
function testARIA() {
    console.log('📢 Monitoring ARIA announcements...');
    
    const audioStatus = document.getElementById('audioStatus');
    
    // Create observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                console.log('🔊 ARIA Announcement:', audioStatus.textContent);
            }
        });
    });
    
    // Start observing
    observer.observe(audioStatus, { 
        childList: true, 
        characterData: true, 
        subtree: true 
    });
    
    // Trigger audio play
    console.log('Playing audio...');
    __AUDIO_API__.play();
    
    // Wait and trigger end
    setTimeout(() => {
        console.log('Simulating audio end...');
        document.getElementById('resetAudio').dispatchEvent(new Event('ended'));
    }, 2000);
    
    // Stop observing after test
    setTimeout(() => {
        observer.disconnect();
        console.log('ARIA test complete');
    }, 5000);
}

testARIA();
```

**Expected Announcements**:
```
📢 Monitoring ARIA announcements...
Playing audio...
🔊 ARIA Announcement: Audio started
Simulating audio end...
🔊 ARIA Announcement: Audio ended. Portal access granted.
🔊 ARIA Announcement: Portal access revealed
ARIA test complete
```

## 7. iOS Audio Unlock Test

```javascript
// Check if iOS unlock was triggered
console.log('Checking iOS audio unlock status...');

// On page load, the unlock should happen on first click
// This variable is inside the closure, but we can check behavior

// Simulate first click
document.body.click();

// Wait briefly
setTimeout(() => {
    console.log('Check console for: "🔓 iOS audio unlocked"');
    console.log('If you see that message, iOS unlock is working');
}, 100);
```

**Expected Output** (on iOS):
```
Checking iOS audio unlock status...
🔓 iOS audio unlocked
Check console for: "🔓 iOS audio unlocked"
If you see that message, iOS unlock is working
```

## 8. Error Handling Test

```javascript
// Test error handling by breaking audio
async function testError() {
    console.log('🧪 Testing error handling...');
    
    const audio = document.getElementById('resetAudio');
    const originalSrc = audio.src;
    
    // Break audio source
    audio.src = 'invalid_path.mp3';
    
    // Try to play
    try {
        await __AUDIO_API__.play();
    } catch (e) {
        console.log('Error caught:', e.message);
    }
    
    // Check state
    setTimeout(() => {
        console.log('Is playing after error:', __AUDIO_API__.isPlaying());
        console.log('Button has playing class:', 
            document.getElementById('playBtn').classList.contains('playing'));
        
        // Restore source
        audio.src = originalSrc;
        console.log('Audio source restored');
    }, 1000);
}

testError();
```

**Expected Output**:
```
🧪 Testing error handling...
Audio playback failed: NotSupportedError: The element has no supported sources.
Error caught: ...
Is playing after error: false
Button has playing class: false
Audio source restored
```

## 9. Portal Reveal Test

```javascript
// Test portal reveal directly
function testPortalReveal() {
    console.log('🌀 Testing portal reveal...');
    
    const portal = document.getElementById('portal');
    
    // Check initial state
    console.log('Initial hidden state:', portal.classList.contains('hidden'));
    console.log('Initial opacity:', window.getComputedStyle(portal).opacity);
    
    // Reveal portal
    __AUDIO_API__.revealPortal();
    
    // Check after reveal
    setTimeout(() => {
        console.log('After reveal hidden state:', portal.classList.contains('hidden'));
        console.log('After reveal opacity:', window.getComputedStyle(portal).opacity);
        console.log('Portal in viewport:', 
            portal.getBoundingClientRect().top < window.innerHeight);
        
        console.log('✅ Portal reveal test complete');
    }, 1000);
}

testPortalReveal();
```

**Expected Output**:
```
🌀 Testing portal reveal...
Initial hidden state: true
Initial opacity: 0
🌀 Portal revealed
After reveal hidden state: false
After reveal opacity: 1
Portal in viewport: true
✅ Portal reveal test complete
```

## 10. Complete Flow Test

```javascript
// Test complete user flow
async function testCompleteFlow() {
    console.log('🎬 Testing complete audio flow...\n');
    
    const steps = [];
    
    // Step 1: Initial state
    steps.push({
        step: 'Initial state',
        playing: __AUDIO_API__.isPlaying(),
        hasPlayed: __AUDIO_API__.hasPlayed(),
        portalHidden: document.getElementById('portal').classList.contains('hidden')
    });
    
    // Step 2: Click play
    console.log('Step 1: Clicking play button...');
    await __AUDIO_API__.play();
    await new Promise(r => setTimeout(r, 100));
    
    steps.push({
        step: 'After play',
        playing: __AUDIO_API__.isPlaying(),
        hasPlayed: __AUDIO_API__.hasPlayed(),
        buttonClass: document.getElementById('playBtn').classList.contains('playing')
    });
    
    // Step 3: Simulate audio end
    console.log('Step 2: Simulating audio end...');
    document.getElementById('resetAudio').dispatchEvent(new Event('ended'));
    await new Promise(r => setTimeout(r, 1000));
    
    steps.push({
        step: 'After audio end',
        playing: __AUDIO_API__.isPlaying(),
        portalHidden: document.getElementById('portal').classList.contains('hidden'),
        buttonDisabled: document.getElementById('playBtn').disabled
    });
    
    // Display results
    console.log('\n📊 Test Results:');
    console.table(steps);
    
    // Validate
    const valid = 
        steps[0].playing === false &&
        steps[0].hasPlayed === false &&
        steps[1].playing === true &&
        steps[1].hasPlayed === true &&
        steps[2].playing === false &&
        steps[2].portalHidden === false &&
        steps[2].buttonDisabled === true;
    
    console.log(valid ? '\n✅ Complete flow test PASSED' : '\n❌ Complete flow test FAILED');
}

testCompleteFlow();
```

**Expected Output**:
```
🎬 Testing complete audio flow...

Step 1: Clicking play button...
🔊 Audio playback started
Step 2: Simulating audio end...
🎵 Audio playback complete
🌀 Portal revealed

📊 Test Results:
┌─────────┬────────────────────┬──────────┬───────────┬─────────────┬────────────────┬─────────────────┐
│ (index) │ step               │ playing  │ hasPlayed │ portalHidden│ buttonClass    │ buttonDisabled  │
├─────────┼────────────────────┼──────────┼───────────┼─────────────┼────────────────┼─────────────────┤
│ 0       │ 'Initial state'    │ false    │ false     │ true        │                │                 │
│ 1       │ 'After play'       │ true     │ true      │             │ true           │                 │
│ 2       │ 'After audio end'  │ false    │           │ false       │                │ true            │
└─────────┴────────────────────┴──────────┴───────────┴─────────────┴────────────────┴─────────────────┘

✅ Complete flow test PASSED
```

## 11. Button State Visual Test

```javascript
// Visual inspection helper
function inspectButtonState() {
    const playBtn = document.getElementById('playBtn');
    const computedStyle = window.getComputedStyle(playBtn);
    
    console.log('📋 Button State Inspection:');
    console.log('  Classes:', playBtn.className);
    console.log('  Disabled:', playBtn.disabled);
    console.log('  Opacity:', computedStyle.opacity);
    console.log('  Cursor:', computedStyle.cursor);
    console.log('  ARIA Label:', playBtn.getAttribute('aria-label'));
    console.log('  ARIA Busy:', playBtn.getAttribute('aria-busy'));
}

// Initial state
inspectButtonState();

// During playback
console.log('\n🎵 Playing audio...');
__AUDIO_API__.play();
setTimeout(inspectButtonState, 100);

// After completion
setTimeout(() => {
    console.log('\n🎬 After completion...');
    document.getElementById('resetAudio').dispatchEvent(new Event('ended'));
    setTimeout(inspectButtonState, 600);
}, 2000);
```

## Manual Testing Checklist

### Visual Tests
- [ ] Button displays glitchy SVG correctly
- [ ] Button hover effect works (scale up)
- [ ] Button dims when playing (opacity 0.7)
- [ ] Button cursor changes to wait during play
- [ ] Button appears disabled after completion
- [ ] Portal fades in smoothly
- [ ] Portal slides up during reveal
- [ ] Page scrolls to portal smoothly

### Interaction Tests
- [ ] Clicking button plays audio
- [ ] Audio plays only once
- [ ] Clicks during playback are ignored
- [ ] Button disables after audio ends
- [ ] Portal appears after audio ends
- [ ] Space key triggers play
- [ ] Enter key triggers play
- [ ] Tab navigation works

### Accessibility Tests
- [ ] Screen reader announces "Audio started"
- [ ] Screen reader announces "Audio ended"
- [ ] Screen reader announces "Portal access granted"
- [ ] Focus ring visible on button
- [ ] Button has descriptive label
- [ ] ARIA busy state updates

### Mobile Tests
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Touch events work correctly
- [ ] Audio unlock happens on first touch
- [ ] No autoplay (user gesture required)

## Expected Console Messages

### On Page Load
```
🎯 Countdown initialized
GlitchFX API initialized. Current level: 0.15
🔊 Audio control system initialized
```

### On First Click (iOS)
```
🔓 iOS audio unlocked
```

### On Play Button Click
```
🔊 Audio playback started
```

### On Audio End
```
🎵 Audio playback complete
🌀 Portal revealed
```

### On Error
```
Audio playback failed: [Error details]
```
