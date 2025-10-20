# 📋 Deployment Checklist - Timeline Reset

**Use this checklist to ensure a smooth deployment to production.**

---

## Pre-Deployment ✅

### Local Testing
- [ ] Run `npm install` (dependencies installed)
- [ ] Run `npm run dev` (dev server works)
- [ ] Test all features in browser:
  - [ ] Countdown displays
  - [ ] Glitch effects visible
  - [ ] Audio plays on click
  - [ ] Portal reveals after audio
  - [ ] Gate form works (rejection/acceptance with mock dates)
- [ ] Press \` (backtick) to test dev overlay:
  - [ ] Overlay appears
  - [ ] Glitch slider works
  - [ ] Force buttons work
  - [ ] Mock date controls work
- [ ] Run TEST.md acceptance tests

### Build Verification
- [ ] Run `npm run build`
- [ ] Build succeeds without errors
- [ ] Check output:
  ```
  ✓ dist/index.html              ~5 kB
  ✓ dist/assets/index-[hash].css ~19 kB
  ✓ dist/assets/index-[hash].js  ~7 kB
  ✓ built in <1000ms
  ```
- [ ] Verify assets copied:
  - [ ] `dist/assets/audio/reset.mp3` exists
  - [ ] `dist/assets/images/glitched_background.webp` exists
  - [ ] `dist/assets/svg/play_button_glitchy.svg` exists
  - [ ] `dist/_headers` exists
- [ ] Run `npm run preview`
- [ ] Test at `http://localhost:4173/`:
  - [ ] All features work (same as dev testing)
  - [ ] No console errors
  - [ ] No dev overlay (production mode)
  - [ ] All assets load correctly

### Repository
- [ ] All changes committed
- [ ] Commit message descriptive
- [ ] Run `git status` (working tree clean)
- [ ] Push to GitHub: `git push origin main`
- [ ] Verify push succeeded on GitHub.com

---

## Deployment 🚀

### Cloudflare Pages Project

- [ ] **Step 1**: Log in to Cloudflare Dashboard
  - URL: https://dash.cloudflare.com/
  
- [ ] **Step 2**: Create Pages Project
  - Navigate to: Workers & Pages → Create application → Pages
  - Connect to Git → Select repository: `TheSeeker713/Timeline-Reset`
  
- [ ] **Step 3**: Configure Build Settings
  ```
  Project name:         timeline-reset
  Production branch:    main
  Build command:        cd vite-app && npm install && npm run build
  Build output:         vite-app/dist
  Root directory:       /
  ```
  
- [ ] **Step 4**: Save and Deploy
  - Click "Save and Deploy"
  - Wait for build (2-5 minutes)
  - Watch build logs for errors
  
- [ ] **Step 5**: Verify Initial Build
  - Build status: ✅ Success
  - Preview URL generated: `https://timeline-reset-[hash].pages.dev`

### Test Preview URL

Open preview URL and test:
- [ ] Page loads over HTTPS
- [ ] No security warnings
- [ ] Background image loads
- [ ] Countdown shows numbers
- [ ] Audio plays (click play button)
- [ ] No console errors
- [ ] Open console and run:
  ```javascript
  __COUNTDOWN_API__.getTarget().toISOString()
  // Expected: "2025-11-11T18:11:00.000Z"
  ```
- [ ] Test T-0 simulation:
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
  // Verify: 00:00:00:00, "SIGNAL BREACHED", glitch = 1.0
  __COUNTDOWN_API__.clearMockDate();
  ```
- [ ] Test mobile (phone/tablet)

---

## DNS Configuration 🌐

### Custom Domain Setup

- [ ] **Step 1**: Add Custom Domain in Cloudflare Pages
  - Pages project → Custom domains tab
  - Click "Set up a custom domain"
  - Enter: `yourdomain.com`
  - Click Continue
  
- [ ] **Step 2**: Verify DNS Records Created
  - Cloudflare Dashboard → Select domain → DNS → Records
  - Verify CNAME for `@` (apex)
  - Verify CNAME for `www`
  
- [ ] **Step 3**: Wait for DNS Propagation
  - Can take 1-5 minutes (up to 24 hours max)
  - Test with: `nslookup yourdomain.com`
  - Or check: https://www.whatsmydns.net/

### Alternative: Manual DNS

If using manual DNS configuration:

- [ ] Add apex CNAME:
  ```
  Type:    CNAME
  Name:    @
  Target:  timeline-reset-[hash].pages.dev
  Proxy:   ✅ Proxied (orange cloud ON)
  ```

- [ ] Add www CNAME:
  ```
  Type:    CNAME
  Name:    www
  Target:  @
  Proxy:   ✅ Proxied (orange cloud ON)
  ```

---

## SSL/TLS Configuration 🔒

- [ ] **Step 1**: Set Encryption Mode
  - Cloudflare Dashboard → Select domain → SSL/TLS
  - Select: **Full (strict)**

- [ ] **Step 2**: Enable Security Features
  - Go to: SSL/TLS → Edge Certificates
  - Enable:
    - [x] **Always Use HTTPS**
    - [x] **Automatic HTTPS Rewrites**
    - [x] **Minimum TLS Version**: 1.2 or 1.3

- [ ] **Step 3**: HSTS (⚠️ Only after HTTPS confirmed working!)
  - ⚠️ DO NOT enable yet!
  - Come back to this after full validation

---

## Cache Configuration 💾

- [ ] **Step 1**: Verify `_headers` File
  - Check: `dist/_headers` exists after build
  - Contains cache rules for assets
  - Contains security headers

- [ ] **Step 2**: Purge Cloudflare Cache
  - Cloudflare Dashboard → Select domain → Caching → Configuration
  - Click "Purge Everything"
  - Confirm purge

- [ ] **Step 3**: Test Cache Headers
  - Open DevTools → Network tab
  - Hard refresh: `Ctrl + Shift + R`
  - Check response headers:
    - `index.html` → `Cache-Control: no-store`
    - `/assets/*.js` → `Cache-Control: max-age=31536000, immutable`
    - `/assets/*.css` → `Cache-Control: max-age=31536000, immutable`
    - `/assets/images/*.webp` → `Cache-Control: max-age=31536000, immutable`

---

## Post-Deployment Validation ✅

### Automated Checks

Run these commands (replace `yourdomain.com`):

```bash
# Test HTTPS redirect
curl -I http://yourdomain.com
# Expected: 301/302 redirect to https://

# Test security headers
curl -I https://yourdomain.com
# Expected: X-Frame-Options, X-Content-Type-Options, etc.

# Test assets
curl -I https://yourdomain.com/assets/audio/reset.mp3
curl -I https://yourdomain.com/assets/images/glitched_background.webp
curl -I https://yourdomain.com/assets/svg/play_button_glitchy.svg
# Expected: 200 OK for all

# SSL Labs test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
# Expected: A or A+ rating
```

### Manual Validation

Open `https://yourdomain.com` and verify:

#### Visual & Layout
- [ ] Page loads without errors
- [ ] HTTPS (padlock icon in address bar)
- [ ] No mixed content warnings
- [ ] Background image displays
- [ ] Countdown shows correct numbers
- [ ] Text readable (proper colors)
- [ ] Responsive on mobile
- [ ] No console errors (F12 → Console)

#### Countdown Accuracy (CRITICAL!)
- [ ] Open console (F12)
- [ ] Run:
  ```javascript
  console.log('Target UTC:', __COUNTDOWN_API__.getTarget().toISOString());
  // Expected: "2025-11-11T18:11:00.000Z"
  
  console.log('Target Local:', __COUNTDOWN_API__.getTarget().toLocaleString('en-US', { 
    timeZone: 'America/Denver',
    dateStyle: 'full',
    timeStyle: 'long'
  }));
  // Expected: "Tuesday, November 11, 2025 at 11:11:00 AM MST"
  ```
- [ ] Verify countdown updates every second
- [ ] Math correct (cross-check with https://www.timeanddate.com/countdown/)

#### T-0 Simulation
- [ ] Run in console:
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
  ```
- [ ] Verify:
  - [ ] Countdown shows: **00:00:00:00**
  - [ ] Message: **"SIGNAL BREACHED"**
  - [ ] Glitch level = **1.0** (max intensity)
  - [ ] Glitch text effects on message
- [ ] Reset:
  ```javascript
  __COUNTDOWN_API__.clearMockDate();
  ```

#### Audio Player
- [ ] Click play button
- [ ] Audio starts playing
- [ ] Click again → No action (additional clicks ignored)
- [ ] Audio completes → Portal reveals
- [ ] Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile (iOS Safari, Android Chrome)

#### Portal Gate
- [ ] **Before TARGET** test:
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
  __GATE_API__.showPortal();
  // Submit form multiple times
  ```
  - [ ] Shows random rejection phrase
  - [ ] Ends with "It is not yet time."
  - [ ] Different phrases on repeated submissions
  
- [ ] **After TARGET** test:
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-12T00:00:00Z');
  __GATE_API__.showPortal();
  // Submit form
  ```
  - [ ] Shows success message
  - [ ] "Temporal lock disengaged. You may proceed."
  - [ ] Form disables after success
  
- [ ] Reset:
  ```javascript
  __COUNTDOWN_API__.clearMockDate();
  ```

#### Accessibility
- [ ] Tab key navigates to play button
- [ ] Focus ring visible
- [ ] Space or Enter key plays audio
- [ ] Tab through portal form inputs
- [ ] Enter key submits form
- [ ] Test with screen reader (if available)

#### Performance
- [ ] Page loads in < 3 seconds (3G simulation)
- [ ] Run Lighthouse audit (DevTools → Lighthouse tab):
  - [ ] Performance: 90+
  - [ ] Accessibility: 95+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
- [ ] Animations smooth (60fps)
- [ ] No layout shift (CLS near 0)

#### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

#### Mobile Responsiveness
- [ ] Test on phone (portrait)
- [ ] Test on phone (landscape)
- [ ] Test on tablet
- [ ] Countdown stacks correctly
- [ ] Audio button touch-friendly
- [ ] Portal form usable
- [ ] No horizontal scrolling

---

## Optional: HSTS Configuration 🔐

⚠️ **Only complete this AFTER all validation passes!**

- [ ] Confirm HTTPS working perfectly:
  - [ ] Site loads over HTTPS
  - [ ] No mixed content errors
  - [ ] SSL Labs score A/A+
  - [ ] All browsers tested

- [ ] Enable HSTS:
  - Cloudflare Dashboard → Select domain
  - SSL/TLS → Edge Certificates
  - Enable HTTP Strict Transport Security (HSTS)
  - Settings:
    ```
    Max Age:             6 months (15768000)
    Apply to subdomains: ✅ Yes
    Preload:             ❌ No (unless certain)
    No-Sniff header:     ✅ Yes
    ```
  - Click Save

⚠️ **Warning**: HSTS forces HTTPS. Browsers will refuse HTTP until max-age expires. Only enable if 100% confident.

---

## Post-Deployment 🎉

### Monitoring & Analytics

- [ ] Enable Cloudflare Web Analytics:
  - Dashboard → Analytics & Logs → Web Analytics
  - Add site
  
- [ ] Set up uptime monitoring (optional):
  - UptimeRobot: https://uptimerobot.com/ (free)
  - Monitor URL: `https://yourdomain.com`
  - Check interval: 5 minutes
  
- [ ] Set up Google Analytics (optional):
  - Add tracking code to `index.html`
  - Or use Cloudflare Web Analytics (privacy-focused)

### Documentation

- [ ] Update DEPLOY.md with actual domain
- [ ] Update README.md with live URL
- [ ] Document any deployment issues encountered
- [ ] Note actual deployment time
- [ ] Save Cloudflare project name

### Rollback Testing (Optional)

- [ ] Test rollback procedure:
  - Cloudflare Pages → Deployments
  - Find current deployment
  - Note "Rollback" option availability
  - **Do NOT actually rollback** (just verify option exists)

### Team Notification

- [ ] Notify team of deployment
- [ ] Share live URL
- [ ] Share credentials (if team access needed)
- [ ] Share documentation links

---

## Success Criteria ✅

### Build
- ✅ `npm run build` succeeds
- ✅ Hashed assets generated
- ✅ Public assets copied
- ✅ Bundle size < 50 KB (target: ~31 KB)

### Deployment
- ✅ Cloudflare Pages project created
- ✅ Initial build succeeds
- ✅ Preview URL accessible
- ✅ Custom domain connected (if applicable)
- ✅ DNS propagated
- ✅ SSL certificate active

### Functionality
- ✅ HTTPS working (no mixed content)
- ✅ Countdown displays correctly
- ✅ UTC math correct (11:11 AM MST = 18:11 UTC)
- ✅ T-0 simulation works
- ✅ Audio plays on click
- ✅ Portal gating behaves correctly
- ✅ All assets load

### Performance
- ✅ Page load < 3 seconds
- ✅ Lighthouse score > 90
- ✅ Smooth animations
- ✅ Mobile responsive

### Security
- ✅ HTTPS enforced
- ✅ Security headers present
- ✅ No exposed secrets
- ✅ SSL Labs grade A/A+

---

## Rollback Plan 🔄

**If something goes wrong**:

### Quick Rollback (< 1 minute)
1. Cloudflare Dashboard → Workers & Pages
2. Select Timeline Reset project
3. Click Deployments tab
4. Find last working deployment
5. Click ⋯ (three dots) → "Rollback to this deployment"
6. Confirm rollback
7. Verify site restored (hard refresh: `Ctrl + Shift + R`)

### Emergency Contact
- **Cloudflare Support**: https://support.cloudflare.com/
- **Community**: https://community.cloudflare.com/

---

## Completion 🎊

- [ ] All checklist items completed
- [ ] Site live and functional
- [ ] Monitoring enabled
- [ ] Team notified
- [ ] Documentation updated

**Deployment Date**: __________  
**Live URL**: __________  
**Deployed By**: __________  
**Cloudflare Project**: __________  
**GitHub Commit**: __________  

**Status**: ☐ Success  ☐ Partial  ☐ Rollback Required  

**Notes**:  
_________________________________________  
_________________________________________  
_________________________________________  

---

## Next Event 📅

**Target**: November 11, 2025 at 11:11 AM MST  
**UTC**: 2025-11-11T18:11:00Z  
**Days Remaining**: [Calculate]  

---

**Congratulations on your deployment!** 🎉🚀

For detailed guides, see:
- **QUICK-DEPLOY.md** - 15-minute walkthrough
- **DEPLOY.md** - Complete deployment guide (570+ lines)
- **TEST.md** - Test matrix (22 tests)
- **README.md** - Project overview

---

**Version**: 1.0  
**Last Updated**: October 19, 2025
