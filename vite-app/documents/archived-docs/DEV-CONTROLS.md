# Dev Controls Quick Reference

## Keyboard Shortcut

Press **\` (backtick)** to toggle the dev control overlay.

## Dev Overlay Features

### 1. Glitch Level Slider
- **Range**: 0.00 to 1.00
- **Purpose**: Real-time control of glitch intensity
- **Usage**: Drag slider to see effects at different levels
- **Visual Feedback**: Value display updates as you drag

### 2. Force Audio Ended
- **Button**: 🎵 Force Audio Ended
- **Purpose**: Simulates audio completion without waiting
- **Effect**: Reveals portal immediately
- **Use Case**: Testing portal reveal flow

### 3. Force T-0 State
- **Button**: ⚡ Force T-0 State
- **Purpose**: Triggers T-0 (target time) event
- **Effect**: 
  - Sets mock date to TARGET (2025-11-11T18:11:00Z)
  - Glitch level ramps to 1.0
  - Countdown shows "SIGNAL BREACHED"
  - Countdown displays 00:00:00:00
- **Use Case**: Testing end-state behavior

### 4. Mock Date Controls
- **Input**: ISO 8601 format (e.g., `2025-11-11T18:11:00Z`)
- **Set Button**: Apply mock date
- **Clear Button**: Return to real time
- **Purpose**: Time travel for testing countdown/gate logic
- **Use Cases**:
  - Test gate rejection (date before TARGET)
  - Test gate acceptance (date at/after TARGET)
  - Test glitch progression at different times
  
**Example Mock Dates**:
```
2025-10-18T12:00:00Z  (24 days before, low glitch)
2025-11-10T18:11:00Z  (1 day before, high glitch)
2025-11-11T18:11:00Z  (exactly TARGET, T-0 state)
2025-11-12T00:00:00Z  (after TARGET, gate accepts)
```

### 5. Show Portal
- **Button**: 🌀 Show Portal
- **Purpose**: Manually reveal portal without audio
- **Effect**: Portal scrolls into view and input receives focus
- **Use Case**: Testing gate submission logic

## Console Commands

All APIs are exposed to the browser console:

```javascript
// Glitch control
GlitchFX.setLevel(0.5);        // Set glitch level
GlitchFX.getLevel();           // Get current level
GlitchFX.stepTo(1.0, 2000);    // Animate to level over time

// Countdown control
__COUNTDOWN_API__.getTarget();           // Get target date
__COUNTDOWN_API__.getDaysRemaining();    // Get days remaining
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
__COUNTDOWN_API__.clearMockDate();
__COUNTDOWN_API__.forceUpdate();         // Trigger countdown update

// Audio control
__AUDIO_API__.play();           // Start audio (if not played)
__AUDIO_API__.isPlaying();      // Check if playing
__AUDIO_API__.hasPlayed();      // Check if ever played
__AUDIO_API__.revealPortal();   // Manually reveal portal

// Gate control
__GATE_API__.showPortal();            // Show portal
__GATE_API__.isTargetReached();       // Check if past TARGET
__GATE_API__.getPhrases();            // Get all 11 phrases
__GATE_API__.getRandomPhrase();       // Get random rejection phrase
__GATE_API__.showRejection();         // Show random rejection error
__GATE_API__.showSuccess();           // Show success message
```

## Logging

### Development Mode
- All `console.info()` statements active
- Shows initialization messages
- Shows state transitions
- Shows user interactions

### Production Mode
- All dev logs stripped from bundle
- Only `console.error()` remains for critical issues
- No console clutter

## Testing Workflows

### Test Glitch Progression
1. Press \` to open overlay
2. Set mock date to 24 days before TARGET
3. Use glitch slider to verify 0.12 level
4. Change mock date closer to TARGET
5. Observe glitch level increases

### Test Gate Rejection
1. Set mock date before TARGET
2. Click "Show Portal"
3. Submit form multiple times
4. Observe different random phrases
5. Verify all end with "It is not yet time."

### Test Gate Acceptance
1. Set mock date at/after TARGET
2. Click "Show Portal"
3. Submit form
4. Verify success message appears
5. Verify form disables

### Test T-0 Event
1. Click "Force T-0 State"
2. Verify glitch level = 1.0
3. Verify countdown = 00:00:00:00
4. Verify message = "SIGNAL BREACHED"
5. Verify glitch text effects applied

### Test Audio Flow
1. Reload page
2. Click play button
3. Click "Force Audio Ended"
4. Verify portal reveals
5. Verify portal scrolls into view
6. Verify input receives focus

## Accessibility Testing

### Keyboard Navigation
1. Press Tab to navigate
2. Verify focus indicators visible
3. Test Space/Enter on play button
4. Test Enter to submit gate form

### Screen Reader Testing
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through page
3. Verify announcements for:
   - Audio state changes
   - Portal reveal
   - Gate errors/success
   - Form labels

### Reduced Motion
1. Enable reduced motion in OS
2. Reload page
3. Verify animations minimal/disabled
4. Verify page still functional

## Performance Testing

### FPS Check
1. Open DevTools → Performance
2. Start recording
3. Set glitch level to 0.5
4. Record for 10 seconds
5. Stop and analyze:
   - Target: 60fps
   - No red bars (layout thrash)
   - GPU usage moderate

### CPU Throttling
1. DevTools → Performance → Gear icon
2. Set CPU: 4x slowdown
3. Set glitch level to 0.5
4. Verify minimum 30fps
5. Verify no freezing

## Known Limitations

1. **Dev Overlay Only in Dev Mode**: 
   - Not available in production build
   - Checked via `import.meta.env.DEV`

2. **Mock Date Global**:
   - Affects all time-dependent systems
   - Must clear to return to real time

3. **Audio Single Play**:
   - No replay without page refresh
   - By design for one-time experience

4. **Success State Permanent**:
   - No reset after gate acceptance
   - Refresh page to test again

## Troubleshooting

### Overlay Not Appearing
- Check you're in dev mode (`npm run dev`)
- Verify backtick key works (not in input field)
- Try console: `window.__DEV_TOGGLE_OVERLAY__()`

### APIs Not Available
- Wait for DOMContentLoaded
- Check console for initialization messages
- Verify no JavaScript errors

### Mock Date Not Working
- Check ISO 8601 format
- Verify date is valid
- Check console for error messages
- Clear mock date if stuck

### Glitch Effects Not Visible
- Check glitch level > 0.1
- Verify #glitch-layer element exists
- Check CSS loaded correctly
- Try different browser

---

**Ready to Test!**

Dev server running at: http://localhost:5173/

Press **\`** to get started! 🚀
