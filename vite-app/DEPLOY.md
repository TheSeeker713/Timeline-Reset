# Deployment Guide - Cloudflare Pages

**Project**: Timeline Reset  
**Platform**: Cloudflare Pages  
**Build Tool**: Vite  
**DNS**: Custom domain (apex + www)  

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Build Verification](#build-verification)
3. [Cloudflare Pages Setup](#cloudflare-pages-setup)
4. [DNS Configuration](#dns-configuration)
5. [SSL/TLS Settings](#ssltls-settings)
6. [Cache Configuration](#cache-configuration)
7. [Post-Deploy Validation](#post-deploy-validation)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ GitHub account with repository access
- ✅ Cloudflare account (free tier works)
- ✅ Domain registered and nameservers pointed to Cloudflare

### Required Tools (Local Development)
- ✅ Node.js 18+ installed
- ✅ npm 9+ installed
- ✅ Git installed

### Repository Setup
- ✅ Code pushed to GitHub
- ✅ All changes committed
- ✅ `.gitignore` includes `node_modules/` and `dist/`

---

## Build Verification

### Local Build Test

Before deploying, verify the build works locally:

```bash
# Navigate to project
cd vite-app

# Install dependencies (if not already done)
npm install

# Run production build
npm run build

# Expected output:
# ✓ XX modules transformed.
# dist/index.html              ~5 kB │ gzip: ~1.6 kB
# dist/assets/index-[hash].css ~19 kB │ gzip: ~4.7 kB
# dist/assets/index-[hash].js  ~7 kB │ gzip: ~3.1 kB
# ✓ built in XXXms
```

### Verify Build Output

Check that `/dist` folder contains:

```
dist/
├── assets/
│   ├── audio/
│   │   └── reset.mp3         ← Audio file copied
│   ├── images/
│   │   └── glitched_background.webp  ← Background copied
│   ├── svg/
│   │   └── play_button_glitchy.svg   ← SVG copied
│   ├── index-[hash].js       ← Hashed JavaScript bundle
│   └── index-[hash].css      ← Hashed CSS bundle
├── index.html                ← Entry point with hashed asset references
├── vite.svg                  ← Favicon
└── _headers                  ← Cloudflare headers config
```

**Critical Checks**:
- ✅ JS and CSS files have content hashes (`index-[hash].js`)
- ✅ `public/assets` contents copied to `dist/assets`
- ✅ `public/_headers` copied to `dist/_headers`
- ✅ `index.html` references hashed assets correctly

### Preview Build Locally

```bash
npm run preview

# Opens http://localhost:4173/
# Test all functionality before deploying
```

**Test Checklist**:
- [ ] Page loads without errors
- [ ] Countdown displays correctly
- [ ] Audio plays on click
- [ ] Portal reveals after audio (or via dev overlay)
- [ ] Gate form works (mock date testing)
- [ ] No console errors
- [ ] All images/assets load

---

## Cloudflare Pages Setup

### Step 1: Create Cloudflare Pages Project

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Select your account

2. **Navigate to Pages**
   - Click **Workers & Pages** in left sidebar
   - Click **Create application**
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Connect Repository**
   - Click **Connect GitHub**
   - Authorize Cloudflare (if first time)
   - Select your repository: `TheSeeker713/Timeline-Reset`
   - Click **Begin setup**

### Step 2: Configure Build Settings

**Framework preset**: `None` (or `Vite` if available)

**Build settings**:
```
Build command:        cd vite-app && npm install && npm run build
Build output directory: vite-app/dist
Root directory:       /
```

**Environment variables**: (none required)

**Build Configuration Summary**:
| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Preview branches | All branches |
| Build command | `cd vite-app && npm install && npm run build` |
| Build output | `vite-app/dist` |
| Node version | 18+ (auto-detected) |

Click **Save and Deploy**

### Step 3: Wait for Initial Build

- First build takes 2-5 minutes
- Watch build logs for errors
- Build completes → Preview URL generated
- Example: `https://timeline-reset-xyz.pages.dev`

### Step 4: Verify Preview Deployment

Test the preview URL:
- [ ] Site loads over HTTPS
- [ ] No mixed content warnings
- [ ] Countdown displays
- [ ] Assets load (check Network tab)
- [ ] Audio plays
- [ ] Portal works

---

## DNS Configuration

### Option A: Apex Domain (Recommended)

**For**: `yourdomain.com`

1. **Go to DNS Settings**
   - Cloudflare Dashboard → Select your domain
   - Click **DNS** → **Records**

2. **Add CNAME Record for Apex**
   ```
   Type:    CNAME
   Name:    @
   Target:  timeline-reset-xyz.pages.dev
   Proxy:   ✅ Proxied (orange cloud)
   TTL:     Auto
   ```

3. **Add CNAME Record for www**
   ```
   Type:    CNAME
   Name:    www
   Target:  @
   Proxy:   ✅ Proxied (orange cloud)
   TTL:     Auto
   ```

### Option B: Pages Custom Domain Flow

1. **Go to Pages Project**
   - Cloudflare Dashboard → Workers & Pages
   - Select your Timeline Reset project
   - Click **Custom domains** tab

2. **Add Custom Domain**
   - Click **Set up a custom domain**
   - Enter your domain: `yourdomain.com`
   - Click **Continue**

3. **Verify Domain**
   - Cloudflare auto-creates DNS records
   - Verify records in DNS settings
   - Wait for DNS propagation (up to 24 hours, usually < 5 minutes)

4. **Add www Subdomain**
   - Click **Set up a custom domain** again
   - Enter: `www.yourdomain.com`
   - Click **Continue**
   - Verify auto-created DNS records

### DNS Propagation Check

```bash
# Check apex domain
nslookup yourdomain.com

# Check www subdomain
nslookup www.yourdomain.com

# Should resolve to Cloudflare IPs or your Pages domain
```

**Online Tools**:
- https://www.whatsmydns.net/
- https://dnschecker.org/

---

## SSL/TLS Settings

### Step 1: Configure SSL/TLS Mode

1. **Navigate to SSL/TLS Settings**
   - Cloudflare Dashboard → Select domain
   - Click **SSL/TLS** in left sidebar

2. **Select Encryption Mode**
   - Choose: **Full (strict)**
   - This ensures end-to-end encryption
   - Cloudflare Pages provides automatic SSL certificate

**SSL/TLS Modes Explained**:
- ❌ **Off**: No encryption (don't use)
- ❌ **Flexible**: Encrypts visitor → Cloudflare only (insecure)
- ✅ **Full**: Encrypts both hops, but allows self-signed certs
- ✅ **Full (strict)**: Encrypts both hops, requires valid cert (RECOMMENDED)

### Step 2: Enable Always Use HTTPS

1. **Go to SSL/TLS → Edge Certificates**
2. **Enable**:
   - ✅ **Always Use HTTPS** (redirects HTTP → HTTPS)
   - ✅ **Automatic HTTPS Rewrites** (fixes mixed content)
   - ✅ **Minimum TLS Version**: 1.2 or 1.3
   
### Step 3: Enable HSTS (Optional, after validation)

⚠️ **Warning**: Only enable HSTS after confirming HTTPS works perfectly!

1. **Go to SSL/TLS → Edge Certificates**
2. **Enable HTTP Strict Transport Security (HSTS)**
   ```
   Max Age:             6 months (15768000 seconds)
   Apply to subdomains: ✅ Yes (if www exists)
   Preload:             ❌ No (unless you're sure)
   No-Sniff header:     ✅ Yes
   ```

3. **HSTS Implications**:
   - Browsers will REFUSE to load site over HTTP
   - Cannot be easily undone (until max-age expires)
   - Only enable if 100% confident in HTTPS setup

---

## Cache Configuration

### Step 1: Verify _headers File

The `public/_headers` file should be in your dist folder after build:

```bash
# Check if _headers was copied
ls dist/_headers

# View contents
cat dist/_headers
```

**Contents** (already created in `/vite-app/public/_headers`):

```
# Static assets - cache for 1 year (immutable)
/assets/images/*
  Cache-Control: public, max-age=31536000, immutable
  
/assets/audio/*
  Cache-Control: public, max-age=31536000, immutable
  
/assets/svg/*
  Cache-Control: public, max-age=31536000, immutable

# Hashed JS/CSS bundles - cache for 1 year
/assets/*.js
  Cache-Control: public, max-age=31536000, immutable
  
/assets/*.css
  Cache-Control: public, max-age=31536000, immutable

# HTML - never cache (always fresh)
/index.html
  Cache-Control: no-store, no-cache, must-revalidate
  
/*
  Cache-Control: no-store, no-cache, must-revalidate
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

### Step 2: Purge Cloudflare Cache (After Deploy)

**When**: After first successful deploy or any asset changes

**How**:
1. Cloudflare Dashboard → Select domain
2. Click **Caching** → **Configuration**
3. Click **Purge Everything**
4. Confirm purge

**Alternative** (Selective Purge):
```bash
# Using Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://yourdomain.com/index.html"]}'
```

### Step 3: Browser Cache Testing

**Force Refresh** (bypass cache):
- **Windows**: `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **Chrome DevTools**: Right-click refresh → **Empty Cache and Hard Reload**

**Verify Caching** (DevTools → Network tab):
- `index.html`: Should show `no-store` (never cached)
- `/assets/*.js`: Should show `max-age=31536000` (1 year cache)
- `/assets/*.css`: Should show `max-age=31536000`
- `/assets/images/*.webp`: Should show `max-age=31536000`
- `/assets/audio/*.mp3`: Should show `max-age=31536000`

---

## Post-Deploy Validation

### Automated Checks

Run these tests immediately after deployment:

#### 1. HTTPS and Security Headers

```bash
# Check HTTPS redirect
curl -I http://yourdomain.com
# Should return 301/302 redirect to https://

# Check security headers
curl -I https://yourdomain.com
# Should include:
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Cache-Control: no-store (for HTML)
```

#### 2. Asset Loading

```bash
# Test background image
curl -I https://yourdomain.com/assets/images/glitched_background.webp
# Should return 200 OK

# Test audio file
curl -I https://yourdomain.com/assets/audio/reset.mp3
# Should return 200 OK

# Test SVG
curl -I https://yourdomain.com/assets/svg/play_button_glitchy.svg
# Should return 200 OK
```

#### 3. No Mixed Content

```bash
# Test SSL Labs
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

# Expected: A+ rating (with HSTS) or A (without)
```

### Manual Validation Checklist

Open https://yourdomain.com and test:

#### **Visual & Layout**
- [ ] Page loads without errors
- [ ] Background image displays correctly
- [ ] Countdown timer shows correct values
- [ ] Text is readable (proper colors/contrast)
- [ ] Responsive design works on mobile
- [ ] No console errors in DevTools

#### **Countdown Accuracy**
- [ ] **Critical**: Verify Mountain Time (MST) calculation
  - Target: **2025-11-11 at 11:11 AM MST (Mountain Standard Time)**
  - UTC equivalent: **2025-11-11T18:11:00Z**
  - Test: Open console and run:
    ```javascript
    console.log('Target UTC:', __COUNTDOWN_API__.getTarget().toISOString());
    // Expected: 2025-11-11T18:11:00.000Z
    
    console.log('Target Local:', __COUNTDOWN_API__.getTarget().toLocaleString());
    // Should show 11:11 AM in Mountain Time
    ```
- [ ] Countdown updates every second
- [ ] Days/Hours/Minutes/Seconds display correctly
- [ ] Math is correct (verify against https://www.timeanddate.com/countdown/create)

#### **T-0 Simulation Test**
- [ ] Open dev console (if dev overlay exists, press \` key)
- [ ] Set mock date to target:
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
  ```
- [ ] Verify:
  - [ ] Countdown shows: **00:00:00:00**
  - [ ] Message changes to: **"SIGNAL BREACHED"**
  - [ ] Glitch level = **1.0** (full takeover)
  - [ ] Glitch effects maximized
- [ ] Clear mock date:
  ```javascript
  __COUNTDOWN_API__.clearMockDate();
  ```

#### **Audio Player**
- [ ] Play button visible and styled correctly
- [ ] First click starts audio
- [ ] Additional clicks ignored while playing
- [ ] No autoplay (audio only starts on user interaction)
- [ ] Audio plays correctly (no stuttering/distortion)
- [ ] Works on mobile (iOS unlock working)
- [ ] Works on desktop (Chrome, Firefox, Safari, Edge)

#### **Portal Gate**
- [ ] Portal reveals after audio ends (or manually via console)
- [ ] Portal scrolls into view smoothly
- [ ] Input field receives focus
- [ ] **Before TARGET** (use mock date):
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
  __GATE_API__.showPortal();
  // Submit form multiple times
  ```
  - [ ] Shows random rejection phrase
  - [ ] Each phrase ends with "It is not yet time."
  - [ ] Different phrases on repeated submissions
- [ ] **After TARGET** (use mock date):
  ```javascript
  __COUNTDOWN_API__.setMockDate('2025-11-12T00:00:00Z');
  __GATE_API__.showPortal();
  // Submit form
  ```
  - [ ] Shows success message
  - [ ] Form disables after success
  - [ ] Message: "Temporal lock disengaged. You may proceed."

#### **Accessibility**
- [ ] Tab navigation works (play button, form inputs)
- [ ] Focus indicators visible
- [ ] Space/Enter keys trigger play button
- [ ] Form submits with Enter key
- [ ] ARIA attributes present (check HTML)
- [ ] Screen reader friendly (test with NVDA/JAWS if available)

#### **Performance**
- [ ] Page loads in < 3 seconds (3G network simulation)
- [ ] Lighthouse score > 90 (run in DevTools)
- [ ] No layout shift (CLS near 0)
- [ ] Smooth animations at 60fps
- [ ] Glitch effects don't cause lag

#### **Cross-Browser Testing**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

#### **Mobile Responsiveness**
- [ ] Countdown stacks correctly on small screens
- [ ] Text remains readable
- [ ] Audio button size appropriate for touch
- [ ] Portal form usable on mobile
- [ ] No horizontal scrolling

### Performance Testing

```bash
# Lighthouse CI (install if needed)
npm install -g @lhci/cli

# Run Lighthouse audit
lhci autorun --collect.url=https://yourdomain.com

# Expected scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 90+
# - SEO: 90+
```

---

## Rollback Procedures

### Quick Rollback (Cloudflare Pages)

**If deployment breaks the site**:

1. **Go to Cloudflare Pages Dashboard**
   - Workers & Pages → Select project
   - Click **Deployments** tab

2. **View Deployment History**
   - See list of all deployments
   - Latest (broken) deployment at top

3. **Rollback to Previous Version**
   - Find last working deployment
   - Click **⋯ (three dots)** → **Rollback to this deployment**
   - Confirm rollback

4. **Verify Rollback**
   - Visit site (force refresh: `Ctrl + Shift + R`)
   - Confirm previous version is live
   - Test functionality

**Rollback Time**: ~30 seconds (instant)

### Emergency Rollback (DNS)

**If entire site is down**:

1. **Option A: Disable Cloudflare Proxy**
   - DNS → Records → Edit CNAME
   - Toggle proxy OFF (gray cloud)
   - Saves immediately

2. **Option B: Point to Backup**
   - Have backup deployment ready (Vercel, Netlify, etc.)
   - Update CNAME target to backup domain
   - Wait for DNS propagation (1-5 minutes)

### Git Rollback

**If you need to revert code**:

```bash
# View commit history
git log --oneline

# Revert to previous commit (safe, creates new commit)
git revert HEAD

# Or reset to specific commit (destructive)
git reset --hard <commit-hash>

# Force push (if necessary)
git push --force

# Cloudflare will auto-deploy reverted code
```

### Rollback Checklist

After rollback:
- [ ] Site loads correctly
- [ ] All functionality works
- [ ] No console errors
- [ ] Assets load properly
- [ ] Document what went wrong
- [ ] Fix issue locally before redeploying

---

## Troubleshooting

### Build Failures

**Error**: `Cannot apply unknown utility class`
- **Cause**: Tailwind v4 doesn't recognize custom class
- **Fix**: Use CSS variables or standard Tailwind classes
- **Example**: Change `text-cyberBlue` to inline style with `var(--color-cyber-blue)`

**Error**: `Command failed: npm run build`
- **Cause**: Build command incorrect or dependencies missing
- **Fix**: Verify build command includes `cd vite-app &&` prefix
- **Test locally**: Run `npm run build` in `/vite-app` folder

**Error**: `Output directory not found`
- **Cause**: Build output path incorrect
- **Fix**: Set output to `vite-app/dist` (not just `dist`)

### Assets Not Loading

**Symptom**: 404 errors for images/audio/svg
- **Cause**: Assets not copied to dist folder
- **Fix**: Ensure assets are in `/vite-app/public/assets/`
- **Verify**: Check `dist/assets/` after build

**Symptom**: Assets load locally but not in production
- **Cause**: Absolute paths instead of relative
- **Fix**: Use `/assets/...` paths (leading slash)
- **Example**: `<img src="/assets/images/bg.webp">`

### Mixed Content Errors

**Symptom**: "Mixed content blocked" in console
- **Cause**: HTTP resources loaded on HTTPS page
- **Fix**: Change all `http://` to `https://` or use protocol-relative URLs
- **Cloudflare**: Enable "Automatic HTTPS Rewrites" in SSL/TLS settings

### Countdown Time Wrong

**Symptom**: Countdown shows incorrect time
- **Cause**: Timezone math incorrect
- **Fix**: Verify TARGET_DATE is UTC:
  ```javascript
  // Correct (UTC)
  const TARGET = new Date('2025-11-11T18:11:00Z');
  
  // Wrong (local time interpreted as UTC)
  const TARGET = new Date('2025-11-11 11:11:00');
  ```
- **Test**: Use https://www.timeanddate.com/worldclock/converter.html
  - Input: 11:11 AM MST (Denver)
  - Output: 18:11 UTC (6:11 PM)

### DNS Not Resolving

**Symptom**: Domain doesn't load
- **Cause**: DNS propagation delay or incorrect records
- **Fix**:
  1. Check DNS records in Cloudflare dashboard
  2. Verify CNAME target is correct
  3. Wait for propagation (up to 24 hours, usually < 5 min)
  4. Test with `nslookup yourdomain.com`
  5. Try https://www.whatsmydns.net/ to check global propagation

### Cache Issues

**Symptom**: Old version of site showing after deploy
- **Cause**: Browser or Cloudflare cache
- **Fix**:
  1. Purge Cloudflare cache (Caching → Purge Everything)
  2. Hard refresh browser (`Ctrl + Shift + R`)
  3. Clear browser cache completely
  4. Test in incognito/private window

### HSTS Errors

**Symptom**: Site won't load, browser shows HSTS error
- **Cause**: HSTS enabled but HTTPS broken
- **Fix**:
  1. Fix HTTPS setup first
  2. Disable HSTS in Cloudflare (SSL/TLS → Edge Certificates)
  3. Wait for HSTS max-age to expire
  4. Clear browser HSTS cache:
     - Chrome: `chrome://net-internals/#hsts` → Delete domain
     - Firefox: Clear all browsing data

### Deployment Stuck

**Symptom**: Cloudflare Pages build running for > 10 minutes
- **Cause**: Build hung or infinite loop
- **Fix**:
  1. Cancel build in Cloudflare dashboard
  2. Check build logs for errors
  3. Test build locally: `npm run build`
  4. Fix issue and redeploy
  5. If persists, contact Cloudflare support

---

## Advanced Configuration

### Preview Branch Rules

**To limit preview deployments**:

1. Cloudflare Pages → Project Settings
2. **Builds & deployments** → **Preview deployments**
3. Configure:
   - **All branches**: Preview all branches
   - **None**: Only production branch
   - **Custom**: Specify branch patterns (e.g., `dev/*`, `feature/*`)

**Recommended**: All branches (for testing PRs before merge)

### Environment Variables

**If you need API keys or secrets**:

1. Cloudflare Pages → Project Settings
2. **Environment variables**
3. Add variables:
   - **Production**: Variables for main branch
   - **Preview**: Variables for preview branches
   - **Encrypted**: Auto-encrypted, not visible after saving

**Example**:
```
Variable name:  VITE_API_KEY
Value:          your-secret-key-here
Environment:    Production
```

**Access in code**:
```javascript
const apiKey = import.meta.env.VITE_API_KEY;
```

### Custom 404 Page

**To add a custom 404 page**:

1. Create `404.html` in `/vite-app/public/`
2. Style to match site theme
3. Include navigation back to home
4. Cloudflare Pages auto-serves this for 404 errors

### Redirects

**To add URL redirects**:

Create `/vite-app/public/_redirects`:
```
/old-page       /new-page       301
/temp-page      /               302
/blog/*         https://blog.yourdomain.com/:splat  301
```

---

## Maintenance

### Updating Content

**For code changes**:
1. Make changes locally
2. Test with `npm run dev`
3. Test build with `npm run build` → `npm run preview`
4. Commit and push to GitHub
5. Cloudflare auto-deploys on push to main

**For asset changes**:
1. Replace files in `/vite-app/public/assets/`
2. Build and test locally
3. Deploy
4. **Purge Cloudflare cache** after deploy

### Monitoring

**Cloudflare Analytics**:
- Dashboard → Analytics → Web Analytics
- View traffic, performance, security events

**Uptime Monitoring** (recommended external services):
- UptimeRobot: https://uptimerobot.com/ (free)
- Pingdom: https://www.pingdom.com/
- StatusCake: https://www.statuscake.com/

**Performance Monitoring**:
- Lighthouse CI (automated audits)
- WebPageTest: https://www.webpagetest.org/
- Chrome User Experience Report: https://developers.google.com/web/tools/chrome-user-experience-report

### Security

**Regular checks**:
- [ ] SSL certificate valid (auto-renews with Cloudflare)
- [ ] Security headers in place (check with https://securityheaders.com/)
- [ ] Dependencies up to date: `npm audit`
- [ ] No exposed secrets in code/repo

---

## Support & Resources

### Cloudflare Documentation
- **Pages**: https://developers.cloudflare.com/pages/
- **DNS**: https://developers.cloudflare.com/dns/
- **SSL/TLS**: https://developers.cloudflare.com/ssl/
- **Caching**: https://developers.cloudflare.com/cache/

### Vite Documentation
- **Build**: https://vite.dev/guide/build.html
- **Deployment**: https://vite.dev/guide/static-deploy.html
- **Assets**: https://vite.dev/guide/assets.html

### Testing Tools
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Security Headers**: https://securityheaders.com/
- **Lighthouse**: https://pagespeed.web.dev/
- **DNS Propagation**: https://www.whatsmydns.net/

### Troubleshooting
- **Cloudflare Community**: https://community.cloudflare.com/
- **Cloudflare Support**: https://support.cloudflare.com/
- **Vite Discord**: https://chat.vite.dev/

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code tested locally
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works correctly
- [ ] All acceptance tests pass (see TEST.md)
- [ ] Changes committed and pushed to GitHub
- [ ] Backup of current live site (if exists)

### Deployment
- [ ] Cloudflare Pages project created
- [ ] Repository connected
- [ ] Build settings configured correctly
- [ ] Initial build successful
- [ ] Preview URL tested thoroughly
- [ ] Custom domain added
- [ ] DNS records configured
- [ ] SSL/TLS set to Full (strict)
- [ ] Cache purged after first deploy

### Post-Deployment
- [ ] HTTPS working (no mixed content)
- [ ] Countdown shows correct time (MST math verified)
- [ ] T-0 simulation works (mock date test)
- [ ] Audio plays on click
- [ ] Portal gating behaves correctly
- [ ] All assets loading (images, audio, SVG)
- [ ] Cross-browser testing complete
- [ ] Mobile responsive testing complete
- [ ] Performance acceptable (Lighthouse > 90)
- [ ] Security headers present
- [ ] Cache headers working correctly
- [ ] DNS propagated globally
- [ ] Monitoring/analytics enabled

### Documentation
- [ ] DEPLOY.md updated with any changes
- [ ] Domain/URLs documented
- [ ] Cloudflare project name noted
- [ ] Rollback procedures tested (if possible)
- [ ] Team notified of deployment

---

## Sign-Off

**Deployment Date**: __________  
**Deployed By**: __________  
**Live URL**: __________  
**Cloudflare Project**: __________  
**GitHub Commit**: __________  

**Status**: ☐ Success  ☐ Partial  ☐ Rollback Required  

**Notes**:  
_________________________________________  
_________________________________________  
_________________________________________  

---

**Last Updated**: October 19, 2025  
**Version**: 1.0  
**Maintainer**: TheSeeker713  
