// ============================================
// TIMELINE RESET - AUDIO DIAGNOSTIC SCRIPT
// ============================================
// Copy and paste this entire script into the browser console
// on the main Timeline Reset page (http://localhost:5174/)
//
// This will test why audio is not playing
// ============================================

console.log('%c🎵 TIMELINE RESET AUDIO DIAGNOSTICS', 'background: #ff9d00; color: #1a0639; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('');

async function runFullDiagnostics() {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  // TEST 1: Check if elements exist
  console.log('%c📋 TEST 1: Element Existence', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const portal = document.getElementById('portal');
  
  console.log('  audioPlayer:', audio ? '✅ Found' : '❌ NOT FOUND');
  console.log('  playBtn:', playBtn ? '✅ Found' : '❌ NOT FOUND');
  console.log('  portal:', portal ? '✅ Found' : '❌ NOT FOUND');
  
  if (!audio) {
    results.failed.push('Audio element not found in DOM');
    console.error('  ❌ CRITICAL: Audio element missing!');
  } else {
    results.passed.push('Audio element exists');
  }
  
  if (!playBtn) {
    results.failed.push('Play button not found in DOM');
    console.error('  ❌ CRITICAL: Play button missing!');
  } else {
    results.passed.push('Play button exists');
  }
  
  console.log('');
  
  // TEST 2: Check audio file accessibility
  console.log('%c📁 TEST 2: Audio File Accessibility', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  
  if (audio) {
    const source = audio.querySelector('source');
    if (source) {
      console.log('  Source element:', source);
      console.log('  Source src:', source.src);
      console.log('  Source type:', source.type);
      
      try {
        const response = await fetch('/assets/audio/reset.mp3');
        if (response.ok) {
          const blob = await response.blob();
          console.log('  ✅ File accessible! Size:', (blob.size / 1024).toFixed(2), 'KB');
          results.passed.push(`Audio file accessible (${(blob.size / 1024).toFixed(2)} KB)`);
        } else {
          console.error('  ❌ File not accessible! Status:', response.status);
          results.failed.push(`Audio file returns HTTP ${response.status}`);
        }
      } catch (err) {
        console.error('  ❌ Fetch error:', err.message);
        results.failed.push(`Cannot fetch audio file: ${err.message}`);
      }
    } else {
      console.error('  ❌ No source element found!');
      results.failed.push('Audio element has no <source> tag');
    }
  }
  
  console.log('');
  
  // TEST 3: Audio element state
  console.log('%c🎛️ TEST 3: Audio Element State', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  
  if (audio) {
    console.log('  readyState:', audio.readyState, '(0=nothing, 4=ready)');
    console.log('  networkState:', audio.networkState, '(1=idle, 2=loading)');
    console.log('  paused:', audio.paused);
    console.log('  duration:', audio.duration, 'seconds');
    console.log('  currentTime:', audio.currentTime);
    console.log('  volume:', audio.volume);
    console.log('  muted:', audio.muted);
    console.log('  autoplay:', audio.autoplay);
    console.log('  canPlayType(mp3):', audio.canPlayType('audio/mpeg'));
    
    if (audio.error) {
      console.error('  ❌ Audio has error:', audio.error.code, audio.error.message);
      results.failed.push(`Audio error: ${audio.error.message}`);
    } else {
      console.log('  ✅ No audio errors');
      results.passed.push('No audio element errors');
    }
    
    if (audio.readyState >= 3) {
      results.passed.push('Audio is ready to play');
    } else if (audio.readyState === 0) {
      results.warnings.push('Audio has not started loading');
    }
  }
  
  console.log('');
  
  // TEST 4: Event listeners
  console.log('%c🔗 TEST 4: Event Listeners', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  
  if (playBtn) {
    console.log('  Button onclick:', typeof playBtn.onclick);
    console.log('  Button event listeners: (cannot inspect with JS)');
    console.log('  Button aria-label:', playBtn.getAttribute('aria-label'));
    console.log('  Button aria-pressed:', playBtn.getAttribute('aria-pressed'));
    
    // Try to get click listeners (won't work but shows attempt)
    console.log('  💡 TIP: Check "Event Listeners" tab in DevTools for click handlers');
  }
  
  console.log('');
  
  // TEST 5: Try to play audio directly
  console.log('%c▶️ TEST 5: Direct Play Attempt', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  
  if (audio) {
    try {
      console.log('  🎵 Attempting audio.play()...');
      await audio.play();
      console.log('  ✅ SUCCESS! Audio is playing!');
      console.log('  Current time:', audio.currentTime);
      console.log('  Paused:', audio.paused);
      results.passed.push('Audio play() succeeded');
      
      // Stop it after 2 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log('  ⏸️ Paused audio (test complete)');
      }, 2000);
      
    } catch (err) {
      console.error('  ❌ play() failed:', err.name, '-', err.message);
      results.failed.push(`play() failed: ${err.name}`);
      
      if (err.name === 'NotAllowedError') {
        console.log('  ℹ️ This means browser autoplay policy is blocking');
        console.log('  ℹ️ Audio must be triggered by user gesture (button click)');
        results.warnings.push('Browser requires user gesture (click button instead)');
      } else if (err.name === 'NotSupportedError') {
        console.error('  ❌ Audio format not supported!');
      }
    }
  }
  
  console.log('');
  
  // TEST 6: Check window.AudioAPI
  console.log('%c🔧 TEST 6: AudioAPI Exposure', 'color: #0ff0fc; font-size: 16px; font-weight: bold;');
  
  if (window.AudioAPI) {
    console.log('  ✅ window.AudioAPI is exposed');
    console.log('  Available methods:', Object.keys(window.AudioAPI));
    console.log('  isPlaying():', window.AudioAPI.isPlaying());
    console.log('  hasPlayed():', window.AudioAPI.hasPlayed());
    results.passed.push('AudioAPI is available');
  } else {
    console.warn('  ⚠️ window.AudioAPI not found (may not be initialized yet)');
    results.warnings.push('AudioAPI not exposed to window');
  }
  
  console.log('');
  
  // SUMMARY
  console.log('%c📊 DIAGNOSTIC SUMMARY', 'background: #0ff0fc; color: #1a0639; font-size: 18px; font-weight: bold; padding: 8px;');
  console.log('');
  console.log('%c✅ PASSED (' + results.passed.length + ')', 'color: #00ff41; font-weight: bold;');
  results.passed.forEach(msg => console.log('  •', msg));
  console.log('');
  
  if (results.warnings.length > 0) {
    console.log('%c⚠️ WARNINGS (' + results.warnings.length + ')', 'color: #ffaa00; font-weight: bold;');
    results.warnings.forEach(msg => console.log('  •', msg));
    console.log('');
  }
  
  if (results.failed.length > 0) {
    console.log('%c❌ FAILED (' + results.failed.length + ')', 'color: #ff0066; font-weight: bold;');
    results.failed.forEach(msg => console.log('  •', msg));
    console.log('');
  }
  
  // RECOMMENDATIONS
  console.log('%c💡 RECOMMENDATIONS', 'color: #ffaa00; font-size: 16px; font-weight: bold;');
  
  if (results.failed.length === 0 && results.warnings.some(w => w.includes('user gesture'))) {
    console.log('  ✅ Audio system is working correctly!');
    console.log('  ✅ Browser is blocking autoplay (normal behavior)');
    console.log('  ✅ Click the play button to start audio');
    console.log('');
    console.log('%c🎯 ACTION: Click the play button on the page', 'background: #00ff41; color: #000; font-size: 14px; padding: 5px;');
  } else if (results.failed.length > 0) {
    console.log('  ❌ Issues detected that need fixing:');
    results.failed.forEach(msg => console.log('     •', msg));
  } else {
    console.log('  ✅ All systems operational!');
  }
  
  console.log('');
  console.log('%c═══════════════════════════════════════', 'color: #0ff0fc;');
  
  return results;
}

// Run diagnostics
runFullDiagnostics().then(() => {
  console.log('');
  console.log('%c💻 Additional test commands available:', 'color: #0ff0fc; font-weight: bold;');
  console.log('  testAudio() - Test audio element directly');
  console.log('  window.AudioAPI.play() - Trigger play via API');
  console.log('  document.getElementById("playBtn").click() - Simulate button click');
});
