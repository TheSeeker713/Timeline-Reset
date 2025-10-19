# Timeline Reset - Production Ready

**Modular Vite + Vanilla JavaScript landing page with countdown, glitch effects, audio player, and time-locked portal gate.**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev
# → Opens http://localhost:5173/

# Production build
npm run build
# → Outputs to /dist

# Preview production build
npm run preview
# → Opens http://localhost:4173/
```

---

## 📁 Project Structure

```
vite-app/
├── public/                    # Static assets (copied to dist/)
│   ├── assets/
│   │   ├── audio/
│   │   │   └── reset.mp3      # Audio track
│   │   ├── images/
│   │   │   └── glitched_background.webp  # Background
│   │   └── svg/
│   │       └── play_button_glitchy.svg   # Play icon
│   └── _headers               # Cloudflare Pages headers config
│
├── src/
│   ├── components/            # Modular feature components
│   │   ├── countdown/
│   │   │   └── index.js       # Countdown timer with glitch progression
│   │   ├── glitch/
│   │   │   └── index.js       # Glitch vignette overlay (CSS variable control)
│   │   ├── player/
│   │   │   └── index.js       # Audio player with accessibility
│   │   └── portal/
│   │       └── index.js       # Time-locked gate with 11 rejection phrases
│   │
│   ├── styles/
│   │   ├── tailwind.css       # Tailwind base + utilities
│   │   ├── glitch.css         # Glitch animation effects
│   │   └── portal.css         # Portal card styling
│   │
│   ├── utils/
│   │   ├── time.js            # Time utilities with mock date support
│   │   └── devControls.js     # Dev overlay (backtick toggle)
│   │
│   └── main.js                # Composition root (wires all components)
│
├── index.html                 # Entry point
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS config (Tailwind + Autoprefixer)
├── tailwind.config.js         # Tailwind configuration
│
├── DEPLOY.md                  # 📖 Complete deployment guide (570+ lines)
├── QUICK-DEPLOY.md            # 🚀 15-minute deployment walkthrough
├── TEST.md                    # 🧪 Test matrix (22 test cases)
├── DEV-CONTROLS.md            # 🛠️ Dev overlay reference
├── GITHUB-ACTIONS.md          # ⚙️ CI/CD setup guide (optional)
│
├── STEP6-COMPLETION.md        # Vite + Tailwind migration notes
├── STEP7-COMPLETION.md        # Modular architecture implementation
├── STEP8-SUMMARY.md           # Testing & accessibility
└── STEP9-SUMMARY.md           # Build & deployment completion
```

---

## ⚙️ Technical Stack

- **Build Tool**: Vite 7.1.10
- **Styling**: Tailwind CSS 4 + Custom CSS animations
- **JavaScript**: Vanilla ES6+ modules (no framework)
- **Hosting**: Cloudflare Pages (recommended)
- **Node**: 18+ required

---

## 🎯 Features

### 1. Countdown Timer
- **Target**: November 11, 2025 at 11:11 AM MST (18:11 UTC)
- **Glitch Progression**: Intensity increases daily (0.12 → 1.00)
- **T-0 Event**: Full glitch takeover when countdown hits zero
- **Mock Date Support**: Time travel for testing (`window.__MOCK_DATE__`)

### 2. Glitch Effects
- **CSS Variable Control**: `--glitch-level` (0.0 to 1.0)
- **Dynamic Intensity**: Tied to countdown progression
- **Mask Protection**: Center ~60% minimally affected
- **Animations**: RGB split, scanlines, warp pulse, chromatic aberration

### 3. Audio Player
- **Click-to-Play**: User interaction required (no autoplay)
- **iOS Unlock**: Automatic audio unlock on first touch
- **Accessibility**: ARIA labels, keyboard support (Space/Enter)
- **One-Time Play**: Additional clicks ignored while playing

### 4. Portal Gate
- **Time-Locked**: Rejects submissions before TARGET date
- **11 Random Phrases**: Different rejection message each attempt
- **Post-TARGET Acceptance**: Success message after target reached
- **Focus Management**: Auto-focus input, scroll into view

### 5. Dev Controls (Dev Mode Only)
- **Toggle**: Press backtick (\`) key
- **Glitch Slider**: Real-time intensity control (0.0 to 1.0)
- **Force Buttons**: Audio ended, T-0 state triggers
- **Mock Date**: Time travel for testing gate logic
- **Console APIs**: All modules exposed for testing

---

## 🧪 Testing

### Quick Test (Browser Console)

```javascript
// Check all APIs loaded
console.log('APIs:', { GlitchFX, __COUNTDOWN_API__, __AUDIO_API__, __GATE_API__ });

// Test glitch effects
GlitchFX.setLevel(0.5);   // Moderate intensity
GlitchFX.setLevel(1.0);   // Maximum intensity

// Test countdown math
console.log(__COUNTDOWN_API__.getDaysRemaining());

// Test T-0 event
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
// Observe: Countdown → 00:00:00:00, glitch → 1.0, message → "SIGNAL BREACHED"

// Test gate rejection (before TARGET)
__COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
__GATE_API__.showPortal();
// Submit form → Random rejection phrase

// Test gate acceptance (after TARGET)
__COUNTDOWN_API__.setMockDate('2025-11-12T00:00:00Z');
__GATE_API__.showPortal();
// Submit form → Success message

// Reset
__COUNTDOWN_API__.clearMockDate();
```

### Automated Quick Test

Paste in console:
```javascript
async function runQuickTests() {
  console.log('🧪 Running tests...\n');
  let passed = 0, failed = 0;
  
  try {
    if (typeof GlitchFX === 'object') {
      console.log('✅ Test 1: GlitchFX API available');
      passed++;
    }
  } catch (e) { console.log('❌ Test 1 FAILED'); failed++; }
  
  try {
    GlitchFX.setLevel(0.5);
    if (Math.abs(GlitchFX.getLevel() - 0.5) < 0.01) {
      console.log('✅ Test 2: Glitch level control works');
      passed++;
    }
  } catch (e) { console.log('❌ Test 2 FAILED'); failed++; }
  
  try {
    const target = __COUNTDOWN_API__.getTarget();
    if (target.toISOString() === '2025-11-11T18:11:00.000Z') {
      console.log('✅ Test 3: Target date correct');
      passed++;
    }
  } catch (e) { console.log('❌ Test 3 FAILED'); failed++; }
  
  console.log(`\n📊 ${passed} passed, ${failed} failed`);
}

runQuickTests();
```

### Full Test Suite

See **TEST.md** for comprehensive test matrix:
- 22 test cases across 7 categories
- Unit checks, gate validation, player behavior
- Accessibility, performance, dev overlay
- Manual and automated test procedures

---

## 🛠️ Development

### Dev Server

```bash
npm run dev
# → http://localhost:5173/
# Hot module replacement enabled
# Press ` (backtick) to toggle dev overlay
```

### Dev Overlay Controls

Press **\`** (backtick) to open dev controls:

- **Glitch Level Slider**: Real-time effect control
- **Force Audio Ended**: Skip to portal reveal
- **Force T-0 State**: Trigger countdown zero
- **Mock Date Input**: Time travel for testing
- **Show Portal**: Manually reveal portal

See **DEV-CONTROLS.md** for complete reference.

### Environment

- `import.meta.env.DEV` → `true` in development
- `import.meta.env.PROD` → `true` in production
- Dev logs auto-stripped in production build

---

## 📦 Build

### Production Build

```bash
npm run build

# Output:
# dist/index.html              ~5 kB (1.6 kB gzipped)
# dist/assets/index-[hash].css ~19 kB (4.7 kB gzipped)
# dist/assets/index-[hash].js  ~7 kB (3.1 kB gzipped)
# dist/assets/audio/reset.mp3  (copied)
# dist/assets/images/...webp   (copied)
# dist/assets/svg/...svg       (copied)
# dist/_headers                (copied)
```

**Total**: ~31 KB (~9.3 KB gzipped) ✅

### Preview Build

```bash
npm run preview
# → http://localhost:4173/
# Tests production build locally
```

### Build Configuration

**Vite defaults** (no custom config needed):
- ✅ ES modules with tree shaking
- ✅ Asset hashing (cache busting)
- ✅ Minification (JS: terser, CSS: cssnano)
- ✅ Public folder copied to dist root
- ✅ Source maps disabled in production

---

## 🚀 Deployment

### Quick Deploy (15 minutes)

See **QUICK-DEPLOY.md** for step-by-step walkthrough.

**Summary**:
1. Test build locally: `npm run build`
2. Push to GitHub: `git push origin main`
3. Create Cloudflare Pages project
4. Connect repository
5. Configure build:
   - Command: `cd vite-app && npm install && npm run build`
   - Output: `vite-app/dist`
6. Add custom domain (optional)
7. Configure DNS (CNAME to .pages.dev)
8. Set SSL/TLS to "Full (strict)"
9. Enable "Always Use HTTPS"
10. Purge cache and validate

**Live in 15 minutes!** 🎉

### Complete Deployment Guide

See **DEPLOY.md** (570+ lines) for:
- Prerequisites and build verification
- Cloudflare Pages setup (detailed steps)
- DNS configuration (apex + www)
- SSL/TLS settings (HSTS warnings included)
- Cache configuration (headers explained)
- Post-deploy validation (checklist + scripts)
- Rollback procedures (multiple strategies)
- Troubleshooting (common issues + fixes)
- Advanced configuration (redirects, 404, env vars)
- Maintenance and monitoring

### CI/CD (Optional)

See **GITHUB-ACTIONS.md** for GitHub Actions setup:
- Auto-deploy on push to main
- API token configuration
- Pre-deploy checks (tests, linting)
- Workflow customization examples

**Note**: Cloudflare Pages has built-in Git integration, so GitHub Actions is optional.

---

## 🔒 Security

### Headers (via `public/_headers`)

- **Cache-Control**: 1 year for immutable assets, no-cache for HTML
- **X-Frame-Options**: DENY (prevent clickjacking)
- **X-Content-Type-Options**: nosniff (MIME type protection)
- **Referrer-Policy**: strict-origin-when-cross-origin (privacy)
- **Permissions-Policy**: Restrict unnecessary features

### SSL/TLS

- **Encryption**: Full (strict) mode
- **Always Use HTTPS**: Enabled
- **Minimum TLS**: 1.2
- **HSTS**: Enable after HTTPS verification

### Code

- ✅ No exposed secrets
- ✅ API tokens secured (if using GitHub Actions)
- ✅ Input sanitization (form submissions)
- ✅ Dev logs stripped in production

---

## ♿ Accessibility

- ✅ **Keyboard Navigation**: Tab, Space, Enter support
- ✅ **Focus Indicators**: Visible focus rings
- ✅ **ARIA Attributes**: Roles, labels, live regions
- ✅ **Screen Reader**: Announcements for state changes
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **Semantic HTML**: Proper structure
- ✅ **Color Contrast**: WCAG AA compliant

Test with:
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Reduced motion mode (OS settings)

---

## ⚡ Performance

### Metrics

- **Bundle Size**: ~31 KB (~9.3 KB gzipped)
- **Load Time**: < 1 second on 3G
- **Lighthouse Target**: 90+ all categories
- **FPS Target**: 60fps at 0.5 glitch level

### Optimizations

- ✅ **Asset Hashing**: Cache busting with content hashes
- ✅ **Long-term Caching**: 1 year for static assets
- ✅ **Minification**: JS (terser), CSS (cssnano)
- ✅ **Tree Shaking**: Dead code elimination
- ✅ **GPU Acceleration**: CSS transforms for animations
- ✅ **Lazy Loading**: Portal hidden until needed
- ✅ **No Layout Thrash**: CSS variable-based animations

### Performance Testing

```bash
# Lighthouse audit
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:4173

# Expected scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 90+
# - SEO: 90+
```

---

## 📖 Documentation

### Core Guides
- **README.md** (this file) - Project overview
- **QUICK-DEPLOY.md** - 15-minute deployment
- **DEPLOY.md** - Complete deployment guide (570+ lines)
- **TEST.md** - Test matrix (22 test cases)
- **DEV-CONTROLS.md** - Dev overlay reference
- **GITHUB-ACTIONS.md** - CI/CD setup (optional)

### Implementation Notes
- **STEP6-COMPLETION.md** - Vite + Tailwind migration
- **STEP7-COMPLETION.md** - Modular architecture
- **STEP8-SUMMARY.md** - Testing & accessibility
- **STEP9-SUMMARY.md** - Build & deployment

---

## 🐛 Troubleshooting

### Build Issues

**"Cannot apply unknown utility class"**
- Fixed ✅ (Tailwind v4 custom colors → CSS variables)

**"Module not found"**
- Run `npm install` to restore dependencies
- Check import paths (case-sensitive on Linux)

### Runtime Issues

**Countdown shows wrong time**
- Verify target: `2025-11-11T18:11:00Z` (UTC)
- Equals 11:11 AM MST (Mountain Standard Time)
- Test: `__COUNTDOWN_API__.getTarget().toISOString()`

**Audio doesn't play**
- Requires user interaction (no autoplay)
- Check browser console for errors
- Test on mobile (iOS requires unlock)

**Assets not loading**
- Check Network tab (F12) for 404 errors
- Verify files in `/public/assets/`
- Force refresh: `Ctrl + Shift + R`

**Dev overlay not appearing**
- Press backtick (\`) key
- Only available in dev mode (`npm run dev`)
- Not in production build

See **DEPLOY.md** troubleshooting section for deployment issues.

---

## 🤝 Contributing

### Code Style

- ES6+ modules
- 2 spaces indentation
- Descriptive variable names
- JSDoc comments for functions
- Dev-only logs with `import.meta.env.DEV` guards

### Adding Features

1. Create module in `/src/components/`
2. Export API for external control
3. Import in `main.js` and wire up
4. Add tests to TEST.md
5. Update documentation

### Testing Checklist

- [ ] Test locally (`npm run dev`)
- [ ] Test build (`npm run build` → `npm run preview`)
- [ ] Run TEST.md test cases
- [ ] Check accessibility (keyboard, screen reader)
- [ ] Test on mobile
- [ ] Cross-browser testing

---

## 📄 License

MIT License - See repository for details

---

## 🙏 Credits

- **Fonts**: Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- **Icons**: Font Awesome
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages

---

## 📞 Support

- **Documentation**: See guides in this folder
- **Issues**: GitHub repository issues
- **Cloudflare**: https://community.cloudflare.com/
- **Vite**: https://chat.vite.dev/

---

**Version**: 1.0.0  
**Status**: Production Ready 🚀  
**Last Updated**: October 19, 2025  
**Target Event**: November 11, 2025 at 11:11 AM MST

---

**Happy deploying!** 🎉
