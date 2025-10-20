# 📚 Project Documentation Archive

This folder contains development documentation, debug logs, and archived notes that are not needed for production deployment but are kept for development reference.

## 📁 Folder Structure

### `/archived-docs/`
**Completed development documentation and feature summaries**

Contains:
- Step completion documents (STEP1-9)
- Feature implementation summaries
- Color scheme updates
- Gradient implementation docs
- UI/UX update documentation
- Transform summaries
- Planning documents

**Purpose:** Historical record of development milestones and feature implementations.

---

### `/debug-logs/`
**Debugging sessions and test suites**

Contains:
- Audio debugging documentation
- Test suite files
- Bug fix documentation
- Debug scripts and test HTML files
- Test results and diagnostics

**Purpose:** Reference for troubleshooting and understanding past issues.

---

### `/deployment/`
**Deployment guides and checklists**

Contains:
- Cloudflare deployment instructions
- GitHub Actions workflows
- Deployment checklists
- Quick deploy guides

**Purpose:** Reference for deploying to various platforms.

---

## 🚫 Excluded from Production

These files are automatically excluded from Cloudflare Pages deployment via `.cfignore`.

**What gets deployed:**
- ✅ `dist/` - Built production files
- ✅ `public/` - Static assets
- ✅ `README.md` - Main project README
- ✅ `_headers` - Cloudflare headers config

**What stays local:**
- ❌ All `documents/` folder contents
- ❌ All `.md` files (except README.md)
- ❌ Source files (`src/`, config files)
- ❌ Development dependencies (`node_modules/`)
- ❌ Test files and debug scripts

---

## 📋 Document Index

### Archived Development Docs
| Document | Purpose |
|----------|---------|
| STEP1-5-COMPLETION.md | Initial implementation phases |
| STEP6-9-SUMMARY.md | Vite migration & testing phases |
| COLOR-*.md | Color scheme development |
| GRADIENT-*.md | Gradient implementation |
| TV-EFFECT-DOCS.md | TV screen effect documentation |
| TRANSFORM-SUMMARY.md | Major refactoring notes |
| DEV-CONTROLS.md | Development tools reference |

### Debug & Test Logs
| Document | Purpose |
|----------|---------|
| AUDIO-DEBUG.md | Audio system debugging guide |
| BUG-FIX-AUDIO.md | Audio race condition fix |
| TEST-AUDIO-FIX.md | Audio fix verification |
| *-TEST-SUITE.md | Component test suites |
| TEST-RESULTS.md | Test execution results |
| audio-diagnostic.js | Browser console diagnostic script |
| audio-test.html | Standalone audio test page |

### Deployment Guides
| Document | Purpose |
|----------|---------|
| DEPLOY.md | Comprehensive deployment guide |
| QUICK-DEPLOY.md | Quick deployment reference |
| DEPLOYMENT-CHECKLIST.md | Pre-deploy checklist |
| GITHUB-ACTIONS.md | CI/CD workflow documentation |

---

## 🔍 Finding Information

**Looking for:**
- **Feature implementation details** → `/archived-docs/`
- **Bug fixes and debugging** → `/debug-logs/`
- **Deployment instructions** → `/deployment/`
- **Current project info** → Root `README.md`
- **API documentation** → Source code JSDoc comments

---

## 🗑️ Maintenance

### When to Add Documents:
- Completed feature summaries
- Debug session notes
- Test results
- Migration guides

### When to Remove Documents:
- Outdated instructions (update instead)
- Duplicate information
- Sensitive data (never commit these!)

### Cleanup Schedule:
- Review quarterly
- Archive old debug logs after 6 months
- Keep all feature documentation permanently

---

## 📝 Notes

- All markdown files in this folder are excluded from production builds
- Keep documentation for future reference and onboarding
- Update this README when adding new document categories
- Never commit sensitive data (API keys, passwords, etc.)

---

**Last Updated:** October 19, 2025  
**Maintained By:** Development Team
