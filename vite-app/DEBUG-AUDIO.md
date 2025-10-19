# Audio Debug Guide

## Changes Made

### 1. Fixed Layout Structure ✅
**Problem**: Grid layout caused spacing issues between countdown, play button, and message.

**Solution**: 
- Moved play button and secret message into the countdown `<section>` 
- Play button is now **directly below** "Until the Nexus Opens"
- Secret message is **directly below** the play button
- Removed separate `#audioSection` container
- Tightened spacing: `mb-6` between elements

**New Structure**:
```
Countdown Section
├── Timer grid (Days, Hours, Minutes, Seconds)
├── "Until the Nexus Opens" message (mb-6)
├── Play Button (mb-6)
└── Secret Message (hidden initially)
```

### 2. Added Debug Logging ✅
**Added console logs to track**:
- Button click events (`🎯 Play button clicked!`)
- State checks (`isPlaying`, `hasPlayed`)
- Audio element verification
- `play()` promise resolution/rejection
- Error messages

### 3. Layout is Using Tailwind ✅
Yes, still using Tailwind CSS 4 with:
- Flexbox utilities: `flex flex-col items-center`
- Spacing utilities: `mb-6` (margin-bottom: 1.5rem)
- Custom classes: `text-cyberBlue`, `text-glow`
- Responsive utilities: `md:w-56 md:h-56`

---

## Debugging Steps

### Step 1: Check Console Logs
When you click the play button, you should see:

```javascript
🎯 Play button clicked!
isPlaying: false hasPlayed: false
✅ Proceeding to play audio
🎵 playAudio() called
audioElement: <audio id="audioPlayer">...
hasPlayed: false
▶️ Calling audioElement.play()...
✅ Audio play() promise resolved
📜 Secret message revealed
▶️ Audio playing
```

### Step 2: Common Issues

#### Issue: Nothing in console when clicking
**Cause**: Event listener not attached

**Check**:
```javascript
// In console, verify button exists
document.getElementById('playBtn')
// Should return: <button id="playBtn">...</button>

// Check if click handler is attached
window.__AUDIO_API__
// Should return object with play, isPlaying, etc.
```

**Fix**: Make sure `initPlayer()` is being called in `main.js`

#### Issue: "Audio blocked - already played"
**Cause**: Cookie is set from previous session

**Check**:
```javascript
window.__AUDIO_API__.getCookieValue()
// Returns: "true" if cookie exists
```

**Fix**: Delete cookie to reset
```javascript
window.__AUDIO_API__.deleteCookie()
// Then refresh page (Ctrl+F5)
```

#### Issue: "Audio play failed" error
**Possible Causes**:
1. Audio file not found (`/assets/audio/reset.mp3`)
2. Browser autoplay policy blocking
3. Audio element not loaded

**Check**:
```javascript
// Verify audio element exists
const audio = document.getElementById('audioPlayer');
console.log('Audio element:', audio);

// Check if file can be played
console.log('Can play MP3:', audio.canPlayType('audio/mpeg'));
// Should return: "probably" or "maybe"

// Check file loaded
console.log('Ready state:', audio.readyState);
// 0 = HAVE_NOTHING (not loaded)
// 1 = HAVE_METADATA (metadata loaded)
// 2 = HAVE_CURRENT_DATA (some data loaded)
// 3 = HAVE_FUTURE_DATA (enough to start)
// 4 = HAVE_ENOUGH_DATA (can play through)

// Try manual play
audio.play().then(() => console.log('✅ Manual play works'))
  .catch(err => console.error('❌ Manual play failed:', err));
```

#### Issue: Button click does nothing
**Check if returning user**:
```javascript
// Check if cookie indicates user has played
console.log('Has played:', window.__AUDIO_API__.hasPlayed());
// If true, button is disabled for returning users
```

**Fix**: Delete cookie to test first-time experience
```javascript
window.__AUDIO_API__.deleteCookie();
location.reload();
```

---

## Testing Workflow

### Test 1: First-Time User
1. Clear cookies: `window.__AUDIO_API__.deleteCookie()`
2. Refresh page (Ctrl+F5)
3. Click play button
4. **Expected**:
   - Console shows click event
   - Secret message fades in
   - Audio starts playing
   - Button becomes semi-transparent
   - Cookie is set

### Test 2: Returning User
1. Complete Test 1 first (plays audio, sets cookie)
2. Refresh page (Ctrl+F5)
3. **Expected**:
   - Secret message already visible on load
   - Portal reveals after 1 second
   - Play button disabled (opacity 0.5)
   - Clicking button shows "already played" message

### Test 3: Audio File Check
```javascript
// Check if reset.mp3 exists
fetch('/assets/audio/reset.mp3')
  .then(res => console.log('Audio file status:', res.status))
  .catch(err => console.error('Audio file not found:', err));
// Should return: 200 (OK)
```

### Test 4: Force Play (Skip Cookie Check)
```javascript
// Temporarily disable hasPlayed check
window.__AUDIO_API__.play();
// Should play audio even if already played
```

---

## Audio File Path

**Expected location**: `vite-app/public/assets/audio/reset.mp3`

**URL in browser**: `http://localhost:5173/assets/audio/reset.mp3`

**Vite serves files from `/public` at the root**:
- `public/assets/audio/reset.mp3` → `/assets/audio/reset.mp3`

**Verify**:
```bash
# Check file exists
ls vite-app/public/assets/audio/
# Should show: reset.mp3
```

---

## Browser Console Tests

### Quick Diagnostics
```javascript
// 1. Check all elements exist
console.log('Play button:', document.getElementById('playBtn'));
console.log('Audio element:', document.getElementById('audioPlayer'));
console.log('Secret message:', document.getElementById('secretMessage'));

// 2. Check API is exposed
console.log('Audio API:', window.__AUDIO_API__);

// 3. Check state
console.log('Is playing:', window.__AUDIO_API__.isPlaying());
console.log('Has played:', window.__AUDIO_API__.hasPlayed());
console.log('Cookie value:', window.__AUDIO_API__.getCookieValue());

// 4. Force play (ignore cookie)
window.__AUDIO_API__.play();

// 5. Force portal reveal (skip audio)
window.__AUDIO_API__.revealPortal();

// 6. Reset everything
window.__AUDIO_API__.deleteCookie();
location.reload();
```

### Check Audio Element State
```javascript
const audio = document.getElementById('audioPlayer');

console.log({
  paused: audio.paused,        // true if not playing
  currentTime: audio.currentTime, // playback position
  duration: audio.duration,    // total length (NaN if not loaded)
  volume: audio.volume,        // 0.0 to 1.0
  muted: audio.muted,         // true if muted
  readyState: audio.readyState, // 0-4 loading state
  src: audio.src,             // full URL to audio file
  error: audio.error          // null or error object
});
```

### Simulate Audio End (Test Portal Reveal)
```javascript
const audio = document.getElementById('audioPlayer');

// Jump to end of audio (triggers onended event)
audio.currentTime = audio.duration - 1;
audio.play();

// Or manually trigger ended event
audio.dispatchEvent(new Event('ended'));
```

---

## Expected Console Output (Clean Run)

```
🚀 Timeline Reset initializing...
Target: 2025-11-11T18:11:00.000Z
Target (Local): 11/11/2025, 11:11:00 AM
✅ Timeline Reset initialized
📡 Test APIs exposed:
  - GlitchFX (setLevel, getLevel, stepTo)
  - __COUNTDOWN_API__ (getTarget, setMockDate, etc.)
  - __AUDIO_API__ (play, isPlaying, revealPortal)
  - __GATE_API__ (showPortal, isTargetReached, etc.)
🔊 Audio player initialized with cookie persistence

[User clicks play button]

🎯 Play button clicked!
isPlaying: false hasPlayed: false
✅ Proceeding to play audio
🎵 playAudio() called
audioElement: <audio id="audioPlayer">...
hasPlayed: false
▶️ Calling audioElement.play()...
✅ Audio play() promise resolved
📜 Secret message revealed
🍪 Cookie set: timeline_reset_audio_played=true
▶️ Audio playing

[Audio finishes]

⏹️ Audio ended
🌀 Portal revealed
```

---

## CSS Warnings (Non-Critical)

You may see these warnings in console:
```
⚠ Unknown property '-moz-osx-font-smoothing'. Declaration dropped.
⚠ Error in parsing value for '-webkit-text-size-adjust'. Declaration dropped.
```

**These are safe to ignore** - They're vendor-specific CSS properties for font rendering that Firefox doesn't recognize. They don't affect functionality.

---

## Next Steps if Audio Still Not Playing

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Click play button**
4. **Copy ALL console output** and share it
5. **Go to Network tab**
   - Filter by "media"
   - Click play button
   - Check if `reset.mp3` is loaded
   - Note the status code (should be 200)
6. **Check for errors** in the Console tab (red text)

---

## Force Debug Mode

Even in production, you can enable verbose logging:

```javascript
// In browser console
localStorage.setItem('DEBUG', 'true');
location.reload();

// Disable debug mode
localStorage.removeItem('DEBUG');
location.reload();
```

---

**Last Updated**: October 19, 2025  
**Version**: 1.1.1 (Debug Edition)
