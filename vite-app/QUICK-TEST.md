# QUICK TEST GUIDE

## 🚀 Dev Server is Running
**URL**: http://localhost:5174/

---

## ⚡ Quick Test (3 Steps)

### 1. Reset State
Open browser console (F12), paste and run:
```javascript
window.__AUDIO_API__.deleteCookie(); location.reload();
```

### 2. Click Play Button
Click the large play button in the center of the page.

### 3. Check Results
- [ ] Audio plays (you hear music) ✅
- [ ] Message appears: "Listen closely... truth hides between the frequencies" ✅
- [ ] Portal stays hidden ✅
- [ ] After audio ends, portal appears ✅

---

## 🧪 Automated Test

Copy/paste this into console:
```javascript
// Quick diagnostic
console.log('Elements:', {
  audio: !!document.getElementById('audioPlayer'),
  button: !!document.getElementById('playBtn'),
  message: !!document.getElementById('secretMessage'),
  portal: !!document.getElementById('portal')
});

console.log('APIs:', {
  audioAPI: !!window.__AUDIO_API__,
  gateAPI: !!window.__GATE_API__,
  glitchFX: !!window.GlitchFX
});

console.log('State:', {
  hasPlayed: window.__AUDIO_API__.hasPlayed(),
  isPlaying: window.__AUDIO_API__.isPlaying(),
  cookie: window.__AUDIO_API__.getCookieValue()
});

// Test click
console.log('\nClicking button in 2 seconds...');
setTimeout(() => {
  document.getElementById('playBtn').click();
  console.log('Button clicked! Check if audio is playing.');
}, 2000);
```

---

## 🔍 Expected Console Output

When you load the page, you should see:
```
🚀 Timeline Reset initializing...
🔍 Looking for audio elements...
🎵 initPlayer() called
✅ Audio and button elements found
🍪 Cookie check:
  Cookie value: null
✅ First-time user - ready to play audio
✅ Click event listener attached to button
✅ Timeline Reset initialized
```

When you click play:
```
🎯 Play button clicked!
✅ Proceeding to play audio
🎵 playAudio() called
▶️ Calling audioElement.play()...
✅ Audio play() promise resolved
📜 Secret message revealed
▶️ Audio playing
```

When audio ends:
```
⏹️ Audio ended
🎵 Audio ended - revealing portal
🌀 showPortal() called
✅ Portal revealed
```

---

## 🐛 Troubleshooting

### Audio doesn't play
```javascript
// Check cookie
window.__AUDIO_API__.getCookieValue()
// If returns "true", run:
window.__AUDIO_API__.deleteCookie(); location.reload();
```

### Portal appears immediately
```javascript
// Cookie is set - delete it
window.__AUDIO_API__.deleteCookie(); location.reload();
```

### No console logs
- Check you're on the Console tab (not Logs)
- Refresh page (Ctrl+F5)
- Check for red errors in console

### Audio file 404
- Open Network tab
- Filter by "Media"
- Refresh page
- Should see `reset.mp3` with status 200

---

## ✅ Success Checklist

Everything works if:
- [x] Page loads without errors
- [x] Console shows initialization logs
- [x] Play button click triggers audio
- [x] You hear the audio file
- [x] Secret message appears on click
- [x] Portal appears after audio ends
- [x] Portal stays hidden until audio ends

---

## 📊 Test Status

Run automated test script:
```bash
# In vite-app directory
cat test-script.js
# Copy output to browser console
```

Or use the comprehensive test guide in `TEST-RESULTS.md`

---

**Last Updated**: Just now  
**Server**: http://localhost:5174/  
**Debug Mode**: Enabled (all logs active)
