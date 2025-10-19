# Countdown + Glitch Progression Test Suite

## Quick Test Commands

Open browser console and run these commands to verify the countdown and glitch intensity system.

## 1. Basic Information

```javascript
// View target date
console.log('Target:', __COUNTDOWN_API__.getTargetDate());

// View total days
console.log('Total days:', __COUNTDOWN_API__.getTotalDays());

// View glitch configuration
console.log('Glitch config:', __COUNTDOWN_API__.getGlitchConfig());

// Current glitch level
console.log('Current glitch level:', GlitchFX.getLevel());
```

## 2. Daily Progression Test

```javascript
// Test progression through different dates
const dates = [
    '2025-10-18T12:00:00Z',  // Day 1 (start)
    '2025-10-25T12:00:00Z',  // Day 8
    '2025-11-01T12:00:00Z',  // Day 15
    '2025-11-08T12:00:00Z',  // Day 22 (3 days before)
    '2025-11-10T12:00:00Z',  // Day 24 (1 day before)
    '2025-11-11T12:00:00Z',  // Day 25 (hours before)
];

dates.forEach(date => {
    __COUNTDOWN_API__.setMockDate(date);
    console.log(`Date: ${date.substr(0, 10)}`);
    console.log(`  Glitch Level: ${GlitchFX.getLevel().toFixed(3)}`);
});

__COUNTDOWN_API__.clearMockDate();
```

**Expected Output**:
```
Date: 2025-10-18 → Glitch: 0.100
Date: 2025-10-25 → Glitch: ~0.328
Date: 2025-11-01 → Glitch: ~0.556
Date: 2025-11-08 → Glitch: ~0.785
Date: 2025-11-10 → Glitch: ~0.850
Date: 2025-11-11 → Glitch: ~0.883 (hours remaining)
```

## 3. T-0 Takeover Test

```javascript
// Jump to exact T-0
console.log('🚨 Testing T-0 Takeover...');
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');

// Wait for effects (2 seconds)
setTimeout(() => {
    // Verify takeover
    const glitchLayer = document.getElementById('glitch-layer');
    const hasTakeover = glitchLayer.classList.contains('takeover');
    const glitchLevel = GlitchFX.getLevel();
    const countdownText = document.getElementById('countdown').textContent;
    
    console.log('✓ Takeover class:', hasTakeover ? 'YES' : 'NO');
    console.log('✓ Glitch level:', glitchLevel);
    console.log('✓ Breach message:', countdownText.includes('BREACHED') ? 'YES' : 'NO');
    
    if (hasTakeover && glitchLevel === 1.0 && countdownText.includes('BREACHED')) {
        console.log('✅ TAKEOVER TEST PASSED');
    } else {
        console.log('❌ TAKEOVER TEST FAILED');
    }
}, 2500);

// Reset after test
setTimeout(() => {
    __COUNTDOWN_API__.clearMockDate();
    location.reload();
}, 5000);
```

## 4. Visual Progression Demo

```javascript
// Animated progression through all days
async function animateProgression() {
    const startDate = new Date('2025-10-18T12:00:00Z');
    const targetDate = new Date('2025-11-11T18:11:00Z');
    const totalMs = targetDate - startDate;
    const steps = 25; // 25 steps
    
    console.log('🎬 Starting animated progression...');
    
    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const currentDate = new Date(startDate.getTime() + (totalMs * progress));
        
        __COUNTDOWN_API__.setMockDate(currentDate);
        
        const level = GlitchFX.getLevel();
        const daysLeft = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
        
        console.log(`Step ${i}/${steps}: ${daysLeft} days left, Glitch: ${level.toFixed(3)}`);
        
        await new Promise(r => setTimeout(r, 1000)); // 1 second per step
    }
    
    console.log('🎬 Animation complete!');
    
    // Reset after 3 seconds
    setTimeout(() => {
        __COUNTDOWN_API__.clearMockDate();
        console.log('Reset to real time');
    }, 3000);
}

animateProgression();
```

## 5. Edge Cases Test

```javascript
// Test edge cases
console.log('Testing edge cases...');

// 1 minute before T-0
console.log('\n1 minute before T-0:');
__COUNTDOWN_API__.setMockDate('2025-11-11T18:10:00Z');
console.log('  Glitch level:', GlitchFX.getLevel().toFixed(3));
console.log('  Should NOT trigger takeover yet');

await new Promise(r => setTimeout(r, 2000));

// Exactly at T-0
console.log('\nExactly at T-0:');
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
console.log('  Glitch level:', GlitchFX.getLevel().toFixed(3));
console.log('  Should trigger takeover');

await new Promise(r => setTimeout(r, 3000));

// 1 hour after T-0
console.log('\n1 hour after T-0:');
__COUNTDOWN_API__.setMockDate('2025-11-11T19:11:00Z');
console.log('  Glitch level:', GlitchFX.getLevel().toFixed(3));
console.log('  Should still show takeover (not retrigger)');

await new Promise(r => setTimeout(r, 2000));

__COUNTDOWN_API__.clearMockDate();
console.log('\n✅ Edge cases test complete');
```

## 6. Manual Glitch Level Calculation

```javascript
// Verify glitch calculation formula
function testGlitchCalculation() {
    console.log('Testing glitch calculation formula...\n');
    
    const config = __COUNTDOWN_API__.getGlitchConfig();
    const totalDays = __COUNTDOWN_API__.getTotalDays();
    
    console.log('Config:', config);
    console.log('Total days:', totalDays);
    console.log('Daily increment:', config.dailyIncrement.toFixed(4));
    console.log('\nExpected progression:');
    
    for (let daysRemaining = totalDays; daysRemaining >= 0; daysRemaining -= 3) {
        const level = __COUNTDOWN_API__.calculateGlitchLevel(daysRemaining);
        console.log(`  ${daysRemaining} days remaining → Level: ${level.toFixed(3)}`);
    }
}

testGlitchCalculation();
```

## 7. Performance Test

```javascript
// Test that throttling works correctly
function testThrottling() {
    console.log('Testing glitch update throttling...');
    
    const startLevel = GlitchFX.getLevel();
    let updateCount = 0;
    
    // Monitor GlitchFX updates
    const originalSetLevel = GlitchFX.setLevel;
    GlitchFX.setLevel = function(level) {
        updateCount++;
        return originalSetLevel.call(this, level);
    };
    
    // Wait 15 seconds (should update ~3 times with 5s throttle)
    setTimeout(() => {
        GlitchFX.setLevel = originalSetLevel; // Restore
        console.log(`Updates in 15 seconds: ${updateCount}`);
        console.log(updateCount <= 4 ? '✅ Throttling works' : '❌ Too many updates');
    }, 15000);
}

testThrottling();
```

## 8. Takeover Trigger Prevention Test

```javascript
// Verify takeover only triggers once
async function testTakeoverOnce() {
    console.log('Testing takeover trigger prevention...');
    
    // First trigger
    console.log('First trigger attempt...');
    __COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
    await new Promise(r => setTimeout(r, 3000));
    
    const firstCheck = document.getElementById('countdown').innerHTML;
    
    // Second trigger attempt (should be blocked)
    console.log('Second trigger attempt (should be blocked)...');
    __COUNTDOWN_API__.setMockDate('2025-11-11T19:00:00Z');
    await new Promise(r => setTimeout(r, 1000));
    
    const secondCheck = document.getElementById('countdown').innerHTML;
    
    if (firstCheck === secondCheck) {
        console.log('✅ Takeover only triggered once (correct)');
    } else {
        console.log('❌ Takeover triggered multiple times (error)');
    }
    
    // Reset
    setTimeout(() => {
        __COUNTDOWN_API__.clearMockDate();
        location.reload();
    }, 2000);
}

testTakeoverOnce();
```

## 9. Real-Time Monitor

```javascript
// Monitor countdown and glitch level in real-time
function startMonitor() {
    console.log('🔍 Starting real-time monitor (press Ctrl+C to stop)...\n');
    
    const interval = setInterval(() => {
        const target = __COUNTDOWN_API__.getTargetDate();
        const now = new Date();
        const diff = target - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const level = GlitchFX.getLevel();
        
        console.clear();
        console.log('=== COUNTDOWN MONITOR ===');
        console.log(`Time: ${days}d ${hours}h ${minutes}m ${seconds}s`);
        console.log(`Glitch Level: ${level.toFixed(3)}`);
        console.log(`Target: ${target.toISOString()}`);
        console.log('\nPress Ctrl+C in console to stop');
    }, 1000);
    
    // Store interval ID globally so it can be cleared
    window.__monitorInterval = interval;
}

// Stop monitor
function stopMonitor() {
    if (window.__monitorInterval) {
        clearInterval(window.__monitorInterval);
        console.log('Monitor stopped');
    }
}

// Start monitor
startMonitor();

// To stop: stopMonitor()
```

## 10. Complete System Validation

```javascript
// Comprehensive validation of all features
async function validateSystem() {
    console.log('🧪 Starting comprehensive system validation...\n');
    
    const tests = [
        {
            name: 'Initial state',
            test: () => {
                const level = GlitchFX.getLevel();
                return level >= 0.10 && level <= 1.0;
            }
        },
        {
            name: 'Config exists',
            test: () => {
                const config = __COUNTDOWN_API__.getGlitchConfig();
                return config && config.initialLevel === 0.10;
            }
        },
        {
            name: 'Target date is correct',
            test: () => {
                const target = __COUNTDOWN_API__.getTargetDate();
                return target.toISOString() === '2025-11-11T18:11:00.000Z';
            }
        },
        {
            name: 'Day 1 glitch level',
            test: () => {
                __COUNTDOWN_API__.setMockDate('2025-10-18T12:00:00Z');
                const level = GlitchFX.getLevel();
                __COUNTDOWN_API__.clearMockDate();
                return Math.abs(level - 0.10) < 0.01;
            }
        },
        {
            name: 'Mid-countdown glitch progression',
            test: () => {
                __COUNTDOWN_API__.setMockDate('2025-11-01T12:00:00Z');
                const level = GlitchFX.getLevel();
                __COUNTDOWN_API__.clearMockDate();
                return level > 0.4 && level < 0.7;
            }
        },
        {
            name: 'T-0 triggers takeover',
            test: async () => {
                __COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
                await new Promise(r => setTimeout(r, 2500));
                const hasTakeover = document.getElementById('glitch-layer')
                    .classList.contains('takeover');
                return hasTakeover;
            }
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            const result = await test.test();
            if (result) {
                console.log(`✅ ${test.name}`);
                passed++;
            } else {
                console.log(`❌ ${test.name}`);
                failed++;
            }
        } catch (e) {
            console.log(`❌ ${test.name} (error: ${e.message})`);
            failed++;
        }
    }
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    
    // Cleanup
    __COUNTDOWN_API__.clearMockDate();
    setTimeout(() => location.reload(), 3000);
}

validateSystem();
```

## Expected Console Output

### Initialization
```
🎯 Countdown initialized
Target: 2025-11-11T18:11:00.000Z
Total days: 24
Daily glitch increment: 0.0326
```

### During Runtime (every 5 seconds)
```
Days remaining: 23, Glitch level: 0.133
```

### At T-0
```
🚨 TAKEOVER MODE ACTIVATED - T-0 REACHED
```

## Visual Verification Checklist

- [ ] Countdown displays correct time remaining
- [ ] Glitch intensity increases gradually over days
- [ ] Low glitch on day 1 (~0.10)
- [ ] High glitch on day before T-0 (~0.85)
- [ ] Full glitch at T-0 (1.00)
- [ ] "SIGNAL BREACHED" appears at T-0
- [ ] Full-page glitch effect at T-0 (no vignette)
- [ ] Takeover only triggers once
- [ ] Date mocking works correctly
- [ ] Real-time countdown resumes after clearMockDate()
