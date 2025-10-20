# 🚀 Quick Deploy Guide - Timeline Reset

**Get your site live in 15 minutes!**

---

## Prerequisites Checklist

- ☐ GitHub account with Timeline-Reset repository
- ☐ Cloudflare account (sign up free at https://cloudflare.com)
- ☐ Domain registered (if custom domain, otherwise use *.pages.dev)

---

## Step 1: Local Build Test (2 minutes)

```bash
# Navigate to project
cd "J:\DEV\Coding Projects\Timeline-Reset\vite-app"

# Install dependencies
npm install

# Test production build
npm run build

# ✅ Should output:
# ✓ 12 modules transformed.
# dist/index.html              ~5 kB
# dist/assets/index-[hash].css ~19 kB
# dist/assets/index-[hash].js  ~7 kB

# Test preview
npm run preview
# Open http://localhost:4173/ and verify everything works
```

**✅ Build works? Proceed to Step 2**

---

## Step 2: Push to GitHub (1 minute)

```bash
# Ensure all changes committed
git status

# If changes exist:
git add .
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

**✅ Code on GitHub? Proceed to Step 3**

---

## Step 3: Create Cloudflare Pages Project (5 minutes)

### 3.1 Navigate to Cloudflare
1. Go to https://dash.cloudflare.com/
2. Log in to your account
3. Click **Workers & Pages** (left sidebar)
4. Click **Create application**
5. Select **Pages** tab
6. Click **Connect to Git**

### 3.2 Connect Repository
1. Click **Connect GitHub**
2. Authorize Cloudflare (if first time)
3. Select repository: `TheSeeker713/Timeline-Reset`
4. Click **Begin setup**

### 3.3 Configure Build
```
Project name:         timeline-reset
Production branch:    main
Framework preset:     None (or Vite if available)
Build command:        cd vite-app && npm install && npm run build
Build output:         vite-app/dist
Root directory:       /
```

5. Click **Save and Deploy**

### 3.4 Wait for Build
- Watch build logs (2-5 minutes)
- ✅ Build complete → Preview URL generated
- Example: `https://timeline-reset-abc.pages.dev`

**✅ Build succeeded? Test preview URL, then proceed to Step 4**

---

## Step 4: Add Custom Domain (5 minutes)

### Option A: Use Cloudflare Pages Custom Domain Flow

1. In your Pages project, click **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter your domain: `yourdomain.com`
4. Click **Continue**
5. Cloudflare auto-creates DNS records
6. Wait for DNS propagation (1-5 minutes, up to 24 hours max)
7. Repeat for `www.yourdomain.com`

### Option B: Manual DNS Configuration

1. Go to Cloudflare Dashboard → Select your domain
2. Click **DNS** → **Records**
3. Add apex CNAME:
   ```
   Type:    CNAME
   Name:    @
   Target:  timeline-reset-abc.pages.dev
   Proxy:   ✅ Proxied (orange cloud)
   ```
4. Add www CNAME:
   ```
   Type:    CNAME
   Name:    www
   Target:  @
   Proxy:   ✅ Proxied (orange cloud)
   ```
5. Wait for DNS propagation

**Test DNS**:
```bash
nslookup yourdomain.com
nslookup www.yourdomain.com
```

**✅ DNS working? Proceed to Step 5**

---

## Step 5: Configure SSL/TLS (2 minutes)

1. Cloudflare Dashboard → Select your domain
2. Click **SSL/TLS** (left sidebar)
3. Select **Full (strict)** encryption mode
4. Go to **SSL/TLS** → **Edge Certificates**
5. Enable:
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **Minimum TLS Version**: 1.2

**⚠️ HSTS: Do NOT enable yet! Wait until HTTPS is confirmed working.**

**✅ SSL configured? Proceed to Step 6**

---

## Step 6: Purge Cache (1 minute)

1. Cloudflare Dashboard → Select your domain
2. Click **Caching** → **Configuration**
3. Click **Purge Everything**
4. Confirm purge

**✅ Cache purged? Proceed to Step 7**

---

## Step 7: Validate Deployment (5 minutes)

### Quick Checks

**Open your site**: `https://yourdomain.com`

**Visual Check**:
- ☐ Page loads over HTTPS (padlock icon)
- ☐ No mixed content warnings
- ☐ Background image displays
- ☐ Countdown shows numbers
- ☐ No console errors (F12 → Console tab)

**Countdown Math Check** (CRITICAL):
Open console (F12) and run:
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

**T-0 Simulation**:
```javascript
__COUNTDOWN_API__.setMockDate('2025-11-11T18:11:00Z');
// Verify countdown shows 00:00:00:00
// Verify message shows "SIGNAL BREACHED"
// Verify glitch level at 1.0

__COUNTDOWN_API__.clearMockDate();
// Return to real time
```

**Audio Test**:
- ☐ Click play button
- ☐ Audio plays
- ☐ Additional clicks ignored while playing

**Portal Test**:
```javascript
// Test before TARGET
__COUNTDOWN_API__.setMockDate('2025-11-10T12:00:00Z');
__GATE_API__.showPortal();
// Submit form → Should show random rejection phrase

// Test after TARGET
__COUNTDOWN_API__.setMockDate('2025-11-12T00:00:00Z');
__GATE_API__.showPortal();
// Submit form → Should show success message

__COUNTDOWN_API__.clearMockDate();
```

**Mobile Test**:
- ☐ Open on phone (Chrome/Safari)
- ☐ Countdown displays correctly
- ☐ Audio plays
- ☐ Touch interactions work

**✅ All checks pass? DEPLOYMENT COMPLETE! 🎉**

---

## Troubleshooting

### Build Failed
**Error**: "Cannot apply unknown utility class"
- Already fixed in the code ✅
- If you see this, run `npm run build` locally to verify

**Error**: "Command failed"
- Verify build command includes `cd vite-app &&` prefix
- Check build logs for specific error

### Site Not Loading
**DNS not resolving**:
- Wait longer (DNS can take up to 24 hours, usually < 5 min)
- Check https://www.whatsmydns.net/?d=yourdomain.com
- Verify DNS records in Cloudflare dashboard

**Mixed content errors**:
- Ensure SSL/TLS set to **Full (strict)**
- Enable **Automatic HTTPS Rewrites**

### Countdown Wrong Time
**Shows incorrect time**:
- Verify code has `new Date('2025-11-11T18:11:00Z')` (with Z for UTC)
- Test conversion: https://www.timeanddate.com/worldclock/converter.html
- 11:11 AM MST = 18:11 UTC ✅

### Assets Not Loading
**404 errors for images/audio**:
- Check Network tab (F12) for exact URLs
- Verify files exist in `dist/assets/` after build
- Force refresh: `Ctrl + Shift + R`

### Old Version Showing
**Site not updating**:
1. Purge Cloudflare cache (Caching → Purge Everything)
2. Hard refresh browser (`Ctrl + Shift + R`)
3. Clear browser cache completely
4. Try incognito/private window

---

## Post-Deploy: Enable HSTS (Optional)

⚠️ **Only do this AFTER confirming HTTPS works perfectly!**

1. Cloudflare Dashboard → Select domain
2. **SSL/TLS** → **Edge Certificates**
3. Enable **HTTP Strict Transport Security (HSTS)**:
   ```
   Max Age:             6 months
   Apply to subdomains: ✅ Yes
   Preload:             ❌ No (unless you're certain)
   No-Sniff header:     ✅ Yes
   ```
4. Click **Save**

**Warning**: Once enabled, browsers will REFUSE HTTP connections until max-age expires. Only enable if 100% confident in HTTPS setup.

---

## What's Next?

### Monitor Your Site
- **Cloudflare Analytics**: Dashboard → Analytics
- **Uptime Monitoring**: https://uptimerobot.com/ (free)
- **Performance**: https://pagespeed.web.dev/

### Update Content
1. Make changes locally
2. Test with `npm run dev`
3. Build and preview: `npm run build` → `npm run preview`
4. Commit and push to GitHub
5. Cloudflare auto-deploys (or manually trigger)

### Optional Enhancements
- ☐ Set up GitHub Actions (see GITHUB-ACTIONS.md)
- ☐ Add custom 404 page
- ☐ Set up Web Analytics
- ☐ Create uptime monitoring
- ☐ Add Content Security Policy headers

---

## Success! 🎉

Your Timeline Reset site is now live at:
- **Live URL**: https://yourdomain.com
- **Preview URL**: https://timeline-reset-abc.pages.dev

**Performance**:
- Bundle size: ~31 KB (~9.3 KB gzipped)
- Expected load time: < 1 second on 3G
- Lighthouse score target: 90+

**Next Event**: November 11, 2025 at 11:11 AM MST (18:11 UTC)

**Documentation**:
- **Complete Guide**: See DEPLOY.md (570+ lines)
- **Testing**: See TEST.md (22 test cases)
- **Dev Controls**: See DEV-CONTROLS.md
- **GitHub Actions**: See GITHUB-ACTIONS.md

---

## Need Help?

### Documentation
- **DEPLOY.md**: Comprehensive deployment guide with troubleshooting
- **TEST.md**: Complete test matrix
- **STEP9-SUMMARY.md**: Full STEP 9 completion details

### Resources
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Vite Docs**: https://vite.dev/guide/
- **Community**: https://community.cloudflare.com/

### Support
- Cloudflare Support: https://support.cloudflare.com/
- GitHub Issues: Create an issue in your repository

---

**Deployment Time**: ~15 minutes  
**Difficulty**: Easy  
**Status**: 🚀 LIVE  

**Congratulations on your deployment!** 🎊
