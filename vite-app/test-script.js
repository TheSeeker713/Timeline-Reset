// COPY THIS ENTIRE SCRIPT INTO BROWSER CONSOLE TO RUN AUTOMATED TESTS

console.log('🧪 Starting automated tests...\n');

// Test 1: Check if elements exist
console.log('TEST 1: Element Existence');
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const secretMsg = document.getElementById('secretMessage');
const portal = document.getElementById('portal');

console.log('  Audio element:', audio ? '✅ PASS' : '❌ FAIL');
console.log('  Play button:', playBtn ? '✅ PASS' : '❌ FAIL');
console.log('  Secret message:', secretMsg ? '✅ PASS' : '❌ FAIL');
console.log('  Portal:', portal ? '✅ PASS' : '❌ FAIL');

if (!audio || !playBtn || !secretMsg || !portal) {
  console.error('❌ CRITICAL: Missing DOM elements, stopping tests');
  throw new Error('Missing elements');
}

// Test 2: Check if APIs are exposed
console.log('\nTEST 2: API Exposure');
console.log('  __AUDIO_API__:', window.__AUDIO_API__ ? '✅ PASS' : '❌ FAIL');
console.log('  __GATE_API__:', window.__GATE_API__ ? '✅ PASS' : '❌ FAIL');
console.log('  GlitchFX:', window.GlitchFX ? '✅ PASS' : '❌ FAIL');

// Test 3: Check audio file
console.log('\nTEST 3: Audio File');
const audioSrc = audio.querySelector('source')?.src;
console.log('  Audio source:', audioSrc);
console.log('  Can play MP3:', audio.canPlayType('audio/mpeg'));
console.log('  Ready state:', audio.readyState, '(0-4, higher is better)');

fetch(audioSrc)
  .then(res => {
    console.log('  HTTP Status:', res.status === 200 ? '✅ PASS (200 OK)' : `❌ FAIL (${res.status})`);
  })
  .catch(err => {
    console.log('  HTTP Status:', '❌ FAIL', err);
  });

// Test 4: Check initial state
console.log('\nTEST 4: Initial State');
console.log('  Cookie value:', window.__AUDIO_API__.getCookieValue() || 'null');
console.log('  Has played:', window.__AUDIO_API__.hasPlayed() ? '❌ FAIL (should be false)' : '✅ PASS');
console.log('  Is playing:', window.__AUDIO_API__.isPlaying() ? '❌ FAIL (should be false)' : '✅ PASS');
console.log('  Secret message hidden:', secretMsg.classList.contains('hidden') ? '✅ PASS' : '❌ FAIL');
console.log('  Portal hidden:', portal.classList.contains('hidden') ? '✅ PASS' : '❌ FAIL');

// Test 5: Test play button click
console.log('\nTEST 5: Play Button Click Test');
console.log('  Simulating click in 2 seconds...');

setTimeout(() => {
  console.log('  Clicking play button...');
  playBtn.click();
  
  setTimeout(() => {
    console.log('  After click check:');
    console.log('    Is playing:', window.__AUDIO_API__.isPlaying() ? '✅ PASS' : '❌ FAIL');
    console.log('    Audio paused:', audio.paused ? '❌ FAIL (should be playing)' : '✅ PASS');
    console.log('    Secret message visible:', !secretMsg.classList.contains('hidden') ? '✅ PASS' : '❌ FAIL');
    console.log('    Portal still hidden:', portal.classList.contains('hidden') ? '✅ PASS' : '❌ FAIL');
    console.log('    Cookie set:', window.__AUDIO_API__.getCookieValue() === 'true' ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n🧪 Tests complete! Check results above.');
    console.log('\nTo test portal reveal, either:');
    console.log('  1. Wait for audio to finish naturally');
    console.log('  2. Run: audio.currentTime = 999; (skip to end)');
    console.log('  3. Run: window.__AUDIO_API__.revealPortal(); (force reveal)');
  }, 1000);
}, 2000);

console.log('\n⏳ Tests running... watch for results above\n');
