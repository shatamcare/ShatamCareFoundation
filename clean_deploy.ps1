# clean_deploy.ps1 - A more reliable GitHub Pages deployment script for Windows
# Usage: powershell -ExecutionPolicy Bypass -File .\clean_deploy.ps1

Write-Host "🚀 Starting clean deployment process..." -ForegroundColor Cyan

# Step 1: Clean and rebuild
Write-Host "📦 Cleaning and rebuilding..." -ForegroundColor Cyan
if (Test-Path -Path ".\dist") {
  Remove-Item -Recurse -Force dist
}

# Ensure gh-pages cache is clean too
if (Test-Path -Path ".\node_modules\.cache\gh-pages") {
  Remove-Item -Recurse -Force ".\node_modules\.cache\gh-pages"
}

# Run build
npm run build

# Step 2: Create .nojekyll file
Write-Host "🚫 Creating .nojekyll file..." -ForegroundColor Cyan
New-Item -Path ".\dist\.nojekyll" -ItemType File -Force

# Step 3: Delete remote gh-pages branch if it exists
Write-Host "🗑️ Removing old gh-pages branch..." -ForegroundColor Cyan
try {
  git push origin --delete gh-pages
  Write-Host "   Remote gh-pages branch deleted." -ForegroundColor Green
}
catch {
  Write-Host "   No remote branch to delete or not authorized." -ForegroundColor Yellow
}

# Step 4: Deploy only the dist folder
Write-Host "🚀 Deploying dist folder to gh-pages..." -ForegroundColor Cyan
npx gh-pages -d dist --dotfiles

Write-Host "✅ Deployment complete! Check your site in a few minutes." -ForegroundColor Green
Write-Host "🌐 Site URL: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/" -ForegroundColor Cyan
