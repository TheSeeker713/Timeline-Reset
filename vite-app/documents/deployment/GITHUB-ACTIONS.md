# GitHub Actions Setup (Optional)

**Note**: Cloudflare Pages has built-in Git integration, so this CI/CD workflow is **optional**. Use this if you want more control over the deployment process or want to run additional checks before deploying.

---

## Why Use GitHub Actions?

**Pros**:
- ✅ Full control over build process
- ✅ Can add pre-deploy checks (tests, linting, etc.)
- ✅ Custom notifications/integrations
- ✅ Build logs in GitHub interface
- ✅ Deploy from any branch with conditions

**Cons**:
- ❌ Requires additional setup (API tokens)
- ❌ Adds complexity
- ❌ Uses GitHub Actions minutes (free tier: 2,000 min/month)

**Recommendation**: 
- **Without Actions**: Let Cloudflare Pages handle deployments (simpler)
- **With Actions**: More control, but requires token management

---

## Setup Instructions

### Step 1: Get Cloudflare API Token

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/

2. **Create API Token**
   - Click profile icon (top right) → **My Profile**
   - Select **API Tokens** tab
   - Click **Create Token**

3. **Use Pages Template**
   - Find "Edit Cloudflare Workers" template
   - Click **Use template**

4. **Configure Token**
   ```
   Token name:          GitHub Actions - Timeline Reset
   Permissions:         
     - Account / Cloudflare Pages / Edit
   Account Resources:   
     - Include / Your Account
   ```

5. **Create Token**
   - Click **Continue to summary**
   - Click **Create Token**
   - **COPY TOKEN** (shown only once!)
   - Save it securely

### Step 2: Get Cloudflare Account ID

1. **Go to Workers & Pages**
   - Cloudflare Dashboard → Workers & Pages

2. **Copy Account ID**
   - Look in the URL or right sidebar
   - Format: `1234567890abcdef1234567890abcdef`
   - Copy this ID

### Step 3: Add Secrets to GitHub

1. **Go to Repository Settings**
   - GitHub → Your repository → **Settings** tab

2. **Navigate to Secrets**
   - Scroll down to **Security** section
   - Click **Secrets and variables** → **Actions**

3. **Add Repository Secrets**

   **Secret 1**: Cloudflare API Token
   ```
   Name:  CLOUDFLARE_API_TOKEN
   Value: [paste your API token]
   ```
   Click **Add secret**

   **Secret 2**: Cloudflare Account ID
   ```
   Name:  CLOUDFLARE_ACCOUNT_ID
   Value: [paste your account ID]
   ```
   Click **Add secret**

4. **Verify Secrets**
   - Should see both secrets listed
   - Values are hidden (secure)

### Step 4: Update Workflow File

The workflow file is already created at `.github/workflows/deploy.yml`.

**Update project name** if needed:
```yaml
# Line 40 in deploy.yml
projectName: timeline-reset  # Change to match your Cloudflare Pages project
```

**Update site URL** (optional, line 48):
```yaml
echo "Site: https://yourdomain.com"  # Change to your actual domain
```

### Step 5: Push Workflow to GitHub

```bash
# Add workflow file
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add GitHub Actions workflow for Cloudflare Pages"

# Push to main
git push origin main
```

### Step 6: Verify Workflow Runs

1. **Go to Actions Tab**
   - GitHub repository → **Actions** tab

2. **Check Workflow Run**
   - Should see "Deploy to Cloudflare Pages" workflow
   - Click on the run to see details
   - Verify all steps complete successfully

3. **Check Build Logs**
   - Expand each step to see output
   - Look for "✅ Deployment successful!"

---

## Workflow Behavior

### On Push to Main
- ✅ Workflow triggers automatically
- ✅ Builds production bundle
- ✅ Deploys to Cloudflare Pages
- ✅ Updates live site

### On Pull Request
- ✅ Workflow runs build check
- ✅ Creates preview deployment (if configured)
- ✅ Does NOT deploy to production

### Manual Trigger
You can add manual dispatch to run workflow on-demand:

```yaml
# Add to the 'on:' section in deploy.yml
on:
  workflow_dispatch:  # Add this line
  push:
    branches:
      - main
  # ...rest of config
```

Then trigger manually:
1. GitHub → Actions tab
2. Select workflow
3. Click "Run workflow" button

---

## Adding Pre-Deploy Checks

### Example: Run Tests Before Deploy

Add a test step before building:

```yaml
- name: Run tests
  working-directory: ./vite-app
  run: npm test

- name: Build production bundle
  working-directory: ./vite-app
  run: npm run build
```

### Example: Lint Code

```yaml
- name: Lint code
  working-directory: ./vite-app
  run: npm run lint
```

### Example: Type Check

```yaml
- name: Type check
  working-directory: ./vite-app
  run: npm run type-check
```

### Example: Lighthouse CI

```yaml
- name: Run Lighthouse CI
  working-directory: ./vite-app
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

---

## Troubleshooting

### Error: "Invalid API Token"
- **Cause**: Token incorrect or expired
- **Fix**: 
  1. Generate new token in Cloudflare
  2. Update `CLOUDFLARE_API_TOKEN` secret in GitHub

### Error: "Account ID not found"
- **Cause**: Account ID incorrect
- **Fix**:
  1. Verify account ID in Cloudflare dashboard
  2. Update `CLOUDFLARE_ACCOUNT_ID` secret in GitHub

### Error: "Project not found"
- **Cause**: Project name in workflow doesn't match Cloudflare
- **Fix**:
  1. Check project name in Cloudflare Pages
  2. Update `projectName` in deploy.yml

### Error: "Build failed"
- **Cause**: Build error (same as local `npm run build` failure)
- **Fix**:
  1. Check build logs in Actions tab
  2. Reproduce error locally: `cd vite-app && npm run build`
  3. Fix error and push again

### Workflow Not Triggering
- **Cause**: Workflow file in wrong location or syntax error
- **Fix**:
  1. Verify file at `.github/workflows/deploy.yml`
  2. Check YAML syntax (use YAML validator)
  3. Ensure pushed to main branch

---

## Disabling GitHub Actions

**If you want to use only Cloudflare's built-in Git integration**:

1. **Delete Workflow File**
   ```bash
   git rm .github/workflows/deploy.yml
   git commit -m "Remove GitHub Actions workflow"
   git push origin main
   ```

2. **Or Disable in GitHub**
   - Repository → Settings → Actions → Disable actions

3. **Cloudflare Pages will continue deploying** via its own integration

---

## Alternative: Wrangler CLI

For even more control, you can deploy using Wrangler CLI:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy Pages project
wrangler pages deploy vite-app/dist --project-name=timeline-reset
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "deploy": "npm run build && wrangler pages deploy dist --project-name=timeline-reset"
  }
}
```

Then deploy with:
```bash
cd vite-app
npm run deploy
```

---

## Security Best Practices

### API Token Permissions
- ✅ Use minimum required permissions (Pages Edit only)
- ✅ Set expiration date (e.g., 1 year)
- ✅ Rotate tokens periodically
- ❌ Never commit tokens to repository
- ❌ Never share tokens publicly

### GitHub Secrets
- ✅ Use repository secrets (not environment secrets for this use case)
- ✅ Review secret access regularly
- ✅ Remove unused secrets
- ❌ Never echo secrets in workflow logs

### Workflow Security
- ✅ Use official actions (verified publishers)
- ✅ Pin action versions (`@v4` not `@main`)
- ✅ Review workflow file changes in PRs
- ✅ Limit workflow permissions (already configured)

---

## Cost Considerations

### GitHub Actions Minutes
- **Free Tier**: 2,000 minutes/month
- **This Workflow**: ~2-3 minutes per run
- **Estimate**: ~600-1000 deploys/month on free tier

### Cloudflare Pages
- **Free Tier**: Unlimited requests, 500 builds/month
- **This Workflow**: Each push = 1 build
- **Estimate**: Well within free tier for most projects

**Recommendation**: Use Cloudflare's built-in Git integration to save GitHub Actions minutes unless you need the extra features.

---

## Resources

- **Cloudflare Pages Action**: https://github.com/cloudflare/pages-action
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Cloudflare API Docs**: https://developers.cloudflare.com/api/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

**Last Updated**: October 19, 2025  
**Version**: 1.0
