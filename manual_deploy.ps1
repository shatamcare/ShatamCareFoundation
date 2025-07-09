# Manual Deployment Process
# This script guides you through a completely manual process to deploy the site

# Step 1: Delete the remote gh-pages branch
git push origin --delete gh-pages

# Step 2: Clean any existing build artifacts
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules/.cache/gh-pages" -ErrorAction SilentlyContinue

# Step 3: Build the project
npm run build

# Step 4: Create .nojekyll file
New-Item -ItemType File -Path dist/.nojekyll -Force

# Step 5: Create a temporary directory for clean deployment
$TempDir = "temp_deploy_" + [DateTime]::Now.ToString("yyyyMMdd_HHmmss")
New-Item -ItemType Directory -Path $TempDir -Force

# Step 6: Copy ONLY the dist folder contents to the temp directory
Copy-Item -Path dist/* -Destination $TempDir -Recurse -Force

# Step 7: Initialize a new git repo in the temp directory
Push-Location $TempDir
git init
git add .
git config --local user.email "deployment@example.com"  # Use your email
git config --local user.name "Deployment Script"  # Use your name
git commit -m "Clean deployment from build artifacts only"

# Step 8: Force push to gh-pages branch
git push --force "https://github.com/adarshalexbalmuchu/ShatamCareFoundation.git" HEAD:gh-pages

# Step 9: Clean up the temporary directory
Pop-Location
Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue

Write-Host "✅ Manual deployment complete. Check your site in a few minutes." -ForegroundColor Green
Write-Host "🌐 Site URL: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/" -ForegroundColor Cyan
