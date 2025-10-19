# GlitchFX API Test Suite

## Quick Manual Tests

Open browser console and try these commands:

### Basic Intensity Tests
```javascript
// Low intensity (subtle)
GlitchFX.setLevel(0.05);

// Medium intensity (moderate)
GlitchFX.setLevel(0.25);

// High intensity (heavy)
GlitchFX.setLevel(0.50);

// Maximum intensity (extreme)
GlitchFX.setLevel(1.0);

// Turn off
GlitchFX.setLevel(0);

// Check current level
console.log('Current glitch level:', GlitchFX.getLevel());
```

### Smooth Transition Tests
```javascript
// Gradual fade in over 2 seconds
GlitchFX.stepTo(0.6, 2000);

// Quick spike then fade
GlitchFX.stepTo(0.9, 500).then(() => {
    console.log('Peak reached!');
    return GlitchFX.stepTo(0.2, 1500);
}).then(() => {
    console.log('Fade complete!');
});

// Chain multiple transitions
GlitchFX.stepTo(0.1, 1000)
    .then(() => GlitchFX.stepTo(0.5, 1000))
    .then(() => GlitchFX.stepTo(0.3, 1000))
    .then(() => console.log('Sequence complete!'));
```

### Visual Comparison Test
```javascript
// Compare low vs high intensity with delays
async function compareIntensities() {
    console.log('Low intensity (0.05)...');
    await GlitchFX.stepTo(0.05, 1000);
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('High intensity (0.50)...');
    await GlitchFX.stepTo(0.50, 1000);
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Back to default (0.15)...');
    await GlitchFX.stepTo(0.15, 1000);
    console.log('Comparison complete!');
}

compareIntensities();
```

### Performance Test
```javascript
// Rapid intensity changes (stress test)
function stressTest() {
    let count = 0;
    const interval = setInterval(() => {
        const randomLevel = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
        GlitchFX.setLevel(randomLevel);
        console.log(`Test ${++count}: ${randomLevel.toFixed(2)}`);
        
        if (count >= 20) {
            clearInterval(interval);
            GlitchFX.stepTo(0.15, 1000);
            console.log('Stress test complete! FPS should remain smooth.');
        }
    }, 200);
}

stressTest();
```

### Edge Case Tests
```javascript
// Out of bounds (should clamp)
GlitchFX.setLevel(-1);    // Should clamp to 0
console.log('After -1:', GlitchFX.getLevel());

GlitchFX.setLevel(5);     // Should clamp to 1
console.log('After 5:', GlitchFX.getLevel());

// Zero duration tween
GlitchFX.stepTo(0.5, 0);  // Should complete immediately

// Very small change
GlitchFX.setLevel(0.150);
GlitchFX.stepTo(0.151, 1000);  // Tiny change
```

### Interrupt Test
```javascript
// Start a long transition, then interrupt it
GlitchFX.stepTo(0.9, 5000);
console.log('Starting 5-second tween to 0.9...');

// After 1 second, interrupt with new tween
setTimeout(() => {
    console.log('Interrupting! New target: 0.1');
    GlitchFX.stepTo(0.1, 1000);
}, 1000);
```

## Expected Results

### Low Intensity (0.05)
- Very subtle RGB scanlines
- Minimal color shift at edges
- Almost imperceptible jitter
- Professional, clean look

### Medium Intensity (0.25)
- Visible but not distracting
- Moderate edge glitching
- Noticeable RGB split
- Enhances cyber aesthetic

### High Intensity (0.50)
- Strong visual effect
- Heavy edge distortion
- Pronounced color aberration
- Dramatic, unstable feel

### Maximum Intensity (1.0)
- Extreme distortion
- Full RGB separation
- Heavy warping at edges
- Chaotic, corrupted appearance

## Performance Expectations

### 60 FPS Target
- Should maintain smooth animation at all levels
- No dropped frames on modern hardware
- GPU-accelerated transforms

### CPU Usage
- Minimal JavaScript overhead
- CSS-driven animations
- Efficient calc() operations

### Memory
- Zero additional DOM elements
- No memory leaks from tweens
- Clean interval cleanup

## Visual Verification

1. **Center Protection**: Content in center 60% should remain clear and readable
2. **Edge Enhancement**: Glitch effects stronger at viewport edges
3. **Smooth Scaling**: Intensity changes should be visually proportional
4. **Continuous Loop**: 2.4s animation loop should be seamless

## Browser Console Output

Expected initialization message:
```
GlitchFX API initialized. Current level: 0.15
Usage: GlitchFX.setLevel(0.5) or GlitchFX.stepTo(0.5, 2000)
```

## Integration Examples

### Countdown Integration
```javascript
// Increase glitch as countdown approaches zero
function updateGlitchByTime(secondsRemaining) {
    if (secondsRemaining < 10) {
        GlitchFX.stepTo(0.8, 500);
    } else if (secondsRemaining < 60) {
        GlitchFX.stepTo(0.4, 1000);
    } else if (secondsRemaining < 300) {
        GlitchFX.stepTo(0.2, 2000);
    } else {
        GlitchFX.stepTo(0.15, 2000);
    }
}
```

### Mouse Interaction
```javascript
// Increase glitch on mouse movement
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Higher glitch near edges
    const distanceFromCenter = Math.max(
        Math.abs(x - 0.5),
        Math.abs(y - 0.5)
    ) * 2;
    
    GlitchFX.setLevel(distanceFromCenter * 0.5 + 0.1);
});
```

### Random Glitch Bursts
```javascript
// Occasional glitch spikes
function randomGlitchBurst() {
    const shouldBurst = Math.random() < 0.1; // 10% chance
    
    if (shouldBurst) {
        const peakLevel = Math.random() * 0.5 + 0.5; // 0.5-1.0
        GlitchFX.stepTo(peakLevel, 200).then(() => {
            GlitchFX.stepTo(0.15, 800);
        });
    }
}

setInterval(randomGlitchBurst, 3000); // Check every 3s
```
