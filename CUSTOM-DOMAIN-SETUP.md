# 🌐 Custom Domain Setup: www.p3epro.com to Cloudflare Pages

## Overview

**Goal:** Transfer `www.p3epro.com` from GitHub Pages to Cloudflare Pages  
**Domain Registrar:** Dynadot.com  
**Current:** GitHub Pages  
**Target:** Cloudflare Pages (GitHub for version control only)

---

## 📋 Complete Migration Checklist

- [ ] Deploy site to Cloudflare Pages
- [ ] Add custom domain in Cloudflare Pages dashboard
- [ ] Update DNS records at Dynadot
- [ ] Remove CNAME from GitHub repository
- [ ] Verify domain points to Cloudflare
- [ ] Test www.p3epro.com loads correctly
- [ ] Redirect p3epro.com → www.p3epro.com (optional)

---

## PART 1: Deploy to Cloudflare Pages (If Not Done)

### Step 1: Push Code to GitHub
```bash
cd "J:\DEV\Coding Projects\Timeline-Reset\vite-app"
git add .
git commit -m "deploy: migrate to Cloudflare Pages"
git push origin main
```

### Step 2: Connect Cloudflare Pages
1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click **Create application** > **Pages** > **Connect to Git**
4. Sign in with GitHub and authorize
5. Select repository: `TheSeeker713/Timeline-Reset`
6. Click **Install & Authorize** > **Begin setup**
7. Configure:
   - **Project name:** `timeline-reset` (or `p3epro`)
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output:** `dist`
   - **Root directory:** `vite-app`
8. Click **Save and Deploy**
9. Wait for build to complete (~2 minutes)
10. Note your Pages URL: `https://timeline-reset.pages.dev`

---

## PART 2: Add Custom Domain to Cloudflare Pages

### Step 1: Add Domain in Cloudflare Dashboard

1. In Cloudflare dashboard, go to **Workers & Pages**
2. Select your Pages project
3. Go to **Custom domains** tab
4. Click **Set up a domain**
5. Enter: `www.p3epro.com`
6. Click **Continue**

**What happens:**
- Cloudflare will show you DNS configuration instructions
- Since `www` is a subdomain, you'll need to add a CNAME record

### Expected Output:
```
Domain: www.p3epro.com
Status: Pending (waiting for DNS)
Required DNS Record:
  Type: CNAME
  Name: www
  Value: timeline-reset.pages.dev (or your-project.pages.dev)
```

---

## PART 3: Update DNS at Dynadot

### Step 1: Log into Dynadot

1. Go to https://www.dynadot.com/
2. Sign in to your account
3. Navigate to **My Domains**
4. Find `p3epro.com` and click **Manage**

### Step 2: Access DNS Settings

1. Click **DNS Settings** or **Manage DNS**
2. You'll see current DNS records

### Step 3: Update DNS Records

**Option A: If you want ONLY www.p3epro.com (subdomain)**

Add/Update these records:

| Type | Name/Host | Value/Target | TTL |
|------|-----------|--------------|-----|
| CNAME | www | timeline-reset.pages.dev | 3600 |

**Option B: If you want BOTH p3epro.com AND www.p3epro.com (recommended)**

You'll need to add the domain to Cloudflare as a zone (see PART 4).

### Step 4: Save DNS Changes

1. Click **Save** or **Update DNS**
2. Note: DNS propagation takes 5-60 minutes

---

## PART 4: (Optional) Set Up Apex Domain (p3epro.com)

If you want both `p3epro.com` AND `www.p3epro.com` to work:

### Step 1: Add Domain as Cloudflare Zone

1. In Cloudflare dashboard, click **Add a Site**
2. Enter: `p3epro.com`
3. Select **Free** plan
4. Click **Continue**

### Step 2: Cloudflare Will Scan Your DNS

- Cloudflare will detect existing records
- Review and click **Continue**

### Step 3: Update Nameservers at Dynadot

Cloudflare will provide nameservers like:
```
amber.ns.cloudflare.com
doug.ns.cloudflare.com
```

**At Dynadot:**
1. Go to **My Domains** > `p3epro.com` > **Manage**
2. Find **Nameservers** section
3. Change from Dynadot nameservers to Cloudflare nameservers:
   - Nameserver 1: `amber.ns.cloudflare.com`
   - Nameserver 2: `doug.ns.cloudflare.com`
4. Click **Save**

### Step 4: Wait for Nameserver Propagation

- Can take 4-48 hours
- Usually completes in 2-4 hours
- Cloudflare will email you when active

### Step 5: Add Custom Domains in Cloudflare Pages

Once nameservers are active:

1. **Workers & Pages** > Your project > **Custom domains**
2. Add `p3epro.com` (apex)
   - Cloudflare will automatically create CNAME record
3. Add `www.p3epro.com` (subdomain)
   - Cloudflare will automatically create CNAME record

### Step 6: Set Up Redirect (Optional)

Redirect apex to www (or vice versa):

1. In Cloudflare dashboard, go to **Rules** > **Redirect Rules**
2. Create rule:
   - **If:** `p3epro.com/*`
   - **Then:** `https://www.p3epro.com/$1`
   - **Status:** 301 (Permanent)

---

## PART 5: Remove Domain from GitHub Pages

### Step 1: Delete CNAME File

**Option A: Via GitHub Website**
1. Go to your GitHub repository
2. Navigate to root directory
3. Find `CNAME` file
4. Click **Delete** (trash icon)
5. Commit: "Remove CNAME - migrated to Cloudflare Pages"

**Option B: Via Git Command Line**
```bash
cd "J:\DEV\Coding Projects\Timeline-Reset"
git rm CNAME
git commit -m "Remove CNAME - migrated to Cloudflare Pages"
git push origin main
```

### Step 2: Disable GitHub Pages (Optional)

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **None**
4. Click **Save**

**Note:** GitHub will show a warning that your site is no longer published. This is correct!

---

## PART 6: Verification & Testing

### Step 1: Check DNS Propagation

Wait 5-60 minutes, then check:

**Online Tools:**
- https://dnschecker.org/
- Enter: `www.p3epro.com`
- Check CNAME record globally

**Command Line:**
```powershell
nslookup www.p3epro.com
```

Expected result:
```
www.p3epro.com
canonical name = timeline-reset.pages.dev
```

### Step 2: Test Domain

1. Open browser (incognito mode)
2. Visit: `https://www.p3epro.com`
3. Should load your Timeline Reset countdown!

### Step 3: Verify SSL Certificate

1. Check for HTTPS (padlock icon)
2. Cloudflare automatically provisions SSL
3. May take 5-10 minutes

### Step 4: Check Cloudflare Pages Dashboard

1. **Workers & Pages** > Your project > **Custom domains**
2. Status should show: ✅ **Active**

---

## 🚨 Troubleshooting

### DNS Not Resolving

**Problem:** `www.p3epro.com` shows error or doesn't load

**Solutions:**
1. Check DNS records at Dynadot
2. Wait longer (up to 24 hours for full propagation)
3. Clear browser cache
4. Try incognito mode
5. Test from different network/device

### SSL Certificate Issues

**Problem:** "Your connection is not private" error

**Solutions:**
1. Wait 10-15 minutes for SSL provisioning
2. Check Cloudflare Pages dashboard for certificate status
3. Verify custom domain is listed and active

### 522 Error (Connection Timeout)

**Problem:** Cloudflare shows 522 error

**Solutions:**
1. Make sure you added domain in Cloudflare Pages dashboard FIRST
2. Then added DNS record
3. Order matters! Dashboard first, DNS second

### Still Pointing to GitHub

**Problem:** Old GitHub Pages site still shows

**Solutions:**
1. Make sure CNAME file is deleted from GitHub
2. Clear browser cache
3. Wait for DNS to propagate fully
4. Check DNS with `nslookup www.p3epro.com`

---

## 📝 Quick Setup Summary (Subdomain Only)

If you only want `www.p3epro.com`:

1. **Cloudflare Pages:** Add custom domain `www.p3epro.com`
2. **Dynadot DNS:** Add CNAME record: `www` → `timeline-reset.pages.dev`
3. **GitHub:** Delete CNAME file
4. **Wait:** 5-60 minutes for DNS
5. **Test:** Visit `https://www.p3epro.com`

---

## 📝 Full Setup Summary (Apex + Subdomain)

If you want both `p3epro.com` AND `www.p3epro.com`:

1. **Cloudflare:** Add site `p3epro.com` as zone
2. **Dynadot:** Change nameservers to Cloudflare
3. **Wait:** 2-48 hours for nameserver propagation
4. **Cloudflare Pages:** Add both domains as custom domains
5. **GitHub:** Delete CNAME file
6. **Test:** Both `p3epro.com` and `www.p3epro.com`

---

## ✅ Final Checklist

After migration:

- [ ] `www.p3epro.com` loads correctly
- [ ] HTTPS works (padlock shows)
- [ ] Countdown timer displays
- [ ] Audio plays
- [ ] Mobile responsive
- [ ] DNS propagated globally
- [ ] GitHub CNAME removed
- [ ] GitHub Pages disabled (optional)
- [ ] Cloudflare Pages shows "Active"

---

## 🎯 Important Notes

### GitHub Repository Usage:
- ✅ **Keep using GitHub** for version control
- ✅ **Keep pushing code** to GitHub
- ✅ **Cloudflare auto-deploys** from GitHub on every push
- ❌ **Don't use GitHub Pages** anymore
- ❌ **Don't add CNAME** back to GitHub

### DNS Propagation:
- **Minimum:** 5 minutes
- **Typical:** 30-60 minutes  
- **Maximum:** 24-48 hours
- **Be patient!** Don't panic if it doesn't work immediately

### Cloudflare Benefits:
- ✅ Global CDN (faster loading)
- ✅ Auto SSL certificates
- ✅ DDoS protection
- ✅ Analytics
- ✅ Automatic builds on push
- ✅ Preview deployments for branches

---

## 📚 Resources

- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Dynadot:** https://www.dynadot.com/
- **DNS Checker:** https://dnschecker.org/
- **Cloudflare Docs:** https://developers.cloudflare.com/pages/

---

**Created:** October 20, 2025  
**Domain:** www.p3epro.com  
**Registrar:** Dynadot  
**Platform:** Cloudflare Pages  
**Repository:** GitHub (version control only)
