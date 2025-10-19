# 📺 TV Screen Effect - Documentation

## Overview

Added a multi-layered CRT television effect that makes the entire page look like it's being broadcast through a glitchy old TV screen.

## Visual Effects

### 1. **Horizontal Scan Lines** 🎞️
- Classic CRT monitor scan lines
- Subtle drifting animation (8s loop)
- Low opacity (0.5) for subtlety

### 2. **RGB Glitch Lines Raining Down** 🌧️
- 6 vertical lines with RGB color gradients
- Rain from top to bottom at different speeds (3-5s)
- Colors: Red, Green, Blue, Cyan, Magenta, Yellow
- Staggered animation delays for randomness

### 3. **Horizontal Glitch Lines** ↔️
- 5 horizontal lines moving left/right
- Some move left, some move right
- RGB color trails
- Different speeds (3.8-5.5s)

### 4. **Glitch Lines Raining Up** ⬆️
- 3 vertical lines moving bottom to top
- Cyan, Magenta, Yellow gradients
- Counter-movement to downward rain

### 5. **RGB Color Split** 🌈
- Subtle chromatic aberration effect
- Intermittent glitching (every 0.3s)
- Red/Cyan and RGB channel separation

### 6. **Static Noise** 📡
- Fractal noise texture
- Rapid position changes (0.2s steps)
- Very subtle (15% opacity)

### 7. **Flickering** ⚡
- Random brightness variations
- Simulates old TV power fluctuations
- 0.15s intervals

### 8. **Vignette** 🎭
- Radial gradient darkening at edges
- Simulates CRT screen curvature
- Subtle edge fade

## Technical Implementation

### Files Created/Modified:

**New File:**
- `src/styles/tv-effect.css` - All TV effect styles

**Modified:**
- `index.html` - Added TV effect HTML structure
- `src/main.js` - Import TV effect CSS

### HTML Structure:

```html
<div class="tv-screen-effect">
  <div class="tv-scanlines"></div>
  <div class="tv-glitch-rain">
    <div class="glitch-line"></div> <!-- x6 -->
  </div>
  <div class="tv-glitch-horizontal">
    <div class="glitch-horizontal"></div> <!-- x5 -->
  </div>
  <div class="tv-glitch-up">
    <div class="glitch-up"></div> <!-- x3 -->
  </div>
  <div class="tv-rgb-split"></div>
  <div class="tv-static"></div>
  <div class="tv-flicker"></div>
  <div class="tv-vignette"></div>
</div>
```

### Key Features:

- **Pointer-events: none** - Doesn't interfere with clicks
- **Z-index: 9999** - Always on top
- **Fixed positioning** - Covers entire viewport
- **Mix-blend-mode: screen** - Glitch lines blend nicely
- **Multiple animation speeds** - Creates randomized effect

## Animation Details

| Effect | Direction | Speed | Count |
|--------|-----------|-------|-------|
| Scan Lines | Down | 8s | 1 layer |
| Glitch Rain | Down | 3-5s | 6 lines |
| Horizontal | Left/Right | 3.8-5.5s | 5 lines |
| Rain Up | Up | 4.5-5s | 3 lines |
| RGB Split | - | 0.3s | 1 layer |
| Static | Random | 0.2s | 1 layer |
| Flicker | - | 0.15s | 1 layer |

## Color Palette

**RGB Primary:**
- Red: `#ff0000`
- Green: `#00ff00`
- Blue: `#0000ff`

**RGB Secondary:**
- Cyan: `#00ffff`
- Magenta: `#ff00ff`
- Yellow: `#ffff00`

All colors use gradients for smooth transitions.

## Performance Considerations

- **GPU accelerated** - Uses `transform` and `opacity` animations
- **Lightweight** - Pure CSS, no JavaScript overhead
- **Optimized** - Minimal DOM elements (19 total)
- **Efficient** - Uses CSS gradients instead of images

## Accessibility

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
  /* Effect opacity reduced to 30% */
}
```

Users with motion sensitivity will see a static version at reduced intensity.

## Customization

### Adjust Intensity:

**Make it stronger:**
```css
.glitch-line { opacity: 0.8; }  /* from 0.6 */
.tv-static { opacity: 0.3; }    /* from 0.15 */
```

**Make it subtler:**
```css
.glitch-line { opacity: 0.3; }  /* from 0.6 */
.tv-scanlines { opacity: 0.2; } /* from 0.5 */
```

### Adjust Speed:

**Faster glitching:**
```css
.glitch-line:nth-child(1) {
  animation: rain-down 1.5s linear infinite;  /* from 3s */
}
```

**Slower, more hypnotic:**
```css
.tv-scanlines {
  animation: scanline-drift 15s linear infinite;  /* from 8s */
}
```

### Change Colors:

Replace RGB values in gradients:
```css
.glitch-line:nth-child(1) {
  background: linear-gradient(180deg, 
    transparent 0%, 
    #your-color 20%,  /* Replace here */
    transparent 40%
  );
}
```

## Visual Preview

The effect creates:
- ✅ Nostalgic CRT monitor feel
- ✅ Dynamic, living background
- ✅ Retro-futuristic aesthetic
- ✅ Subtle depth and texture
- ✅ Matches the glitch theme perfectly

## Testing

**View at:** http://localhost:5173/

**What to look for:**
- Horizontal lines slowly drifting down (scan lines)
- Colorful vertical lines raining down at various speeds
- Some lines moving left/right horizontally
- Some lines moving upward (counter-flow)
- Occasional RGB color splitting
- Subtle flickering and static
- Darker edges (vignette)

**Should NOT see:**
- Lines blocking interactive elements
- Excessive brightness
- Jarring, seizure-inducing flashing

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ All modern browsers supporting CSS animations

## File Size

- CSS: ~9KB uncompressed
- Gzipped: ~2KB
- Zero JavaScript overhead
- No images required

---

## 🎉 Result

Your Timeline Reset page now looks like it's being transmitted through a glitchy, vintage television screen with animated RGB scan lines and interference patterns!
