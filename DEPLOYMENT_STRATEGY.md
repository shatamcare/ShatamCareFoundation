# GitHub Pages Deployment Strategy

## 💼 Problem & Solution Overview

**Persistent Issue:**
The GitHub Pages deployment for this project has been inconsistently showing:
- 404 errors on assets
- White screens
- Missing images and resources
- Requests to `/src/main.tsx` instead of built files

**Root Cause:**
GitHub Pages is sometimes serving the development version of `index.html` with source references instead of the built files. This happens because the `gh-pages` deployment tool is not consistently:
- Cleaning up the target branch before deploying
- Properly limiting the deployment to only the `dist` folder contents
- Ensuring GitHub Pages does not process files with Jekyll

## 🛠️ Robust Deployment Strategy

### Option 1: Clean Deployment Script (Recommended)

We've created a specialized script that ensures clean deployments:

```bash
npm run clean-deploy
```

This script:
1. Cleans and rebuilds the dist folder
2. Creates a `.nojekyll` file
3. Deletes the remote gh-pages branch
4. Deploys only the dist folder contents

### Option 2: Manual Nuclear Fix

If the automated script fails, perform these steps manually:

```bash
# 1. Delete remote gh-pages branch
git push origin --delete gh-pages

# 2. Clean local gh-pages branch (if exists)
git branch -D gh-pages

# 3. Remove dist folder & node_modules/.cache/gh-pages
rm -rf dist
rm -rf node_modules/.cache/gh-pages

# 4. Rebuild project
npm run build

# 5. Create .nojekyll file
echo "" > dist/.nojekyll

# 6. Deploy only the dist folder
npx gh-pages -d dist --dotfiles
```

### Option 3: Last Resort - Manual Branch Creation

If both options above fail:

1. Delete the gh-pages branch
2. Create a new gh-pages branch from main
3. Remove all files except .git
4. Copy over ONLY the dist folder contents
5. Add a .nojekyll file
6. Commit and push

```bash
git checkout main
git branch -D gh-pages
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
echo "" > .nojekyll
git add .
git commit -m "Manual deployment of built files only"
git push -f origin gh-pages
```

## ✅ Verification Steps

After deployment:

1. Wait 5 minutes for GitHub Pages to update
2. Open DevTools (F12) and go to Network tab
3. Load the site and verify:
   - No 404 errors
   - Requests go to proper assets (not source files)
   - Check that the index.html being served has minified content

## 🔍 Ongoing Monitoring

After each deployment, check the GitHub Pages branch to ensure:

1. It contains ONLY the built files (from dist)
2. It has a `.nojekyll` file
3. There are no source code files (.tsx, etc.)
4. The index.html is the built/minified version

## 💡 Prevention Tips

1. Always use `npm run clean-deploy` for deployment
2. Never modify the base path in vite.config.ts
3. Check GitHub Actions logs for any errors during deployment
4. Validate deployed content after each deployment
