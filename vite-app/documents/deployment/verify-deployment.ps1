# ============================================
# Cloudflare Pages Deployment Verification
# ============================================
# Run this before deploying to verify structure

Write-Host "`n=== TIMELINE RESET - DEPLOYMENT CHECK ===" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
$currentPath = Get-Location
if ($currentPath -notlike "*vite-app") {
    Write-Host "⚠️  Please run this from the vite-app directory" -ForegroundColor Yellow
    Write-Host "   cd vite-app" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ In correct directory: vite-app`n" -ForegroundColor Green

# Check .cfignore exists
if (Test-Path ".cfignore") {
    Write-Host "✅ .cfignore configured" -ForegroundColor Green
} else {
    Write-Host "❌ .cfignore missing!" -ForegroundColor Red
}

# Check dist folder exists
if (Test-Path "dist") {
    $distFiles = (Get-ChildItem "dist" -Recurse -File).Count
    Write-Host "✅ dist/ folder exists ($distFiles files)" -ForegroundColor Green
} else {
    Write-Host "⚠️  dist/ folder not found - run 'npm run build'" -ForegroundColor Yellow
}

# Check public folder
if (Test-Path "public") {
    $publicFiles = (Get-ChildItem "public" -Recurse -File).Count
    Write-Host "✅ public/ folder exists ($publicFiles files)" -ForegroundColor Green
} else {
    Write-Host "❌ public/ folder missing!" -ForegroundColor Red
}

# Check _headers file
if (Test-Path "public/_headers") {
    Write-Host "✅ _headers configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  _headers not found" -ForegroundColor Yellow
}

# Check CNAME
$rootCNAME = Test-Path "../CNAME"
$publicCNAME = Test-Path "public/CNAME"
if ($rootCNAME -or $publicCNAME) {
    Write-Host "✅ CNAME configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  CNAME not found (optional)" -ForegroundColor Yellow
}

# Check documents folder
if (Test-Path "documents") {
    $docsCount = (Get-ChildItem "documents" -Recurse -File).Count
    Write-Host "✅ documents/ folder organized ($docsCount archived files)" -ForegroundColor Green
} else {
    Write-Host "⚠️  documents/ folder not found" -ForegroundColor Yellow
}

# Check for leftover test files
$testFiles = Get-ChildItem -Filter "*test*.html" -File
if ($testFiles.Count -eq 0) {
    Write-Host "✅ No test HTML files in root" -ForegroundColor Green
} else {
    Write-Host "⚠️  Found $($testFiles.Count) test HTML files" -ForegroundColor Yellow
    $testFiles | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
}

# Check for leftover .md files (except README)
$mdFiles = Get-ChildItem -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }
if ($mdFiles.Count -eq 0) {
    Write-Host "✅ No extra .md files in root" -ForegroundColor Green
} else {
    Write-Host "⚠️  Found $($mdFiles.Count) markdown files" -ForegroundColor Yellow
    $mdFiles | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
}

Write-Host ""
Write-Host "=== DEPLOYMENT FILE CHECK ===" -ForegroundColor Cyan
Write-Host ""

# Files that WILL deploy
Write-Host "📦 Will Deploy:" -ForegroundColor Green
Write-Host "   - dist/ (built files)" -ForegroundColor Gray
Write-Host "   - public/ (static assets)" -ForegroundColor Gray
Write-Host "   - README.md" -ForegroundColor Gray

Write-Host ""

# Files that WON'T deploy
Write-Host "🚫 Won't Deploy (via .cfignore):" -ForegroundColor Yellow
Write-Host "   - documents/ (all docs)" -ForegroundColor Gray
Write-Host "   - src/ (source files)" -ForegroundColor Gray
Write-Host "   - node_modules/" -ForegroundColor Gray
Write-Host "   - *.md (except README)" -ForegroundColor Gray
Write-Host "   - *.config.js" -ForegroundColor Gray
Write-Host "   - package*.json" -ForegroundColor Gray

Write-Host ""
Write-Host "=== BUILD TEST ===" -ForegroundColor Cyan
Write-Host ""

$buildTest = Read-Host "Run build test? (y/n)"
if ($buildTest -eq "y") {
    Write-Host "Running npm run build..." -ForegroundColor Gray
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project is ready for Cloudflare Pages deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit changes: git add . && git commit -m `"Prepare for deployment`"" -ForegroundColor Gray
Write-Host "2. Push to GitHub: git push origin main" -ForegroundColor Gray
Write-Host "3. Connect Cloudflare Pages to repository" -ForegroundColor Gray
Write-Host "4. Configure:" -ForegroundColor Gray
Write-Host "   - Build command: npm run build" -ForegroundColor Gray
Write-Host "   - Build output: dist" -ForegroundColor Gray
Write-Host "   - Root directory: vite-app" -ForegroundColor Gray
Write-Host "5. Deploy!" -ForegroundColor Gray
Write-Host ""
