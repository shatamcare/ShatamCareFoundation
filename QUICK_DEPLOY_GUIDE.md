# GitHub Pages Deployment - Quick Reference

## ✅ Current Status: FIXED APP.TSX ERROR
- **Live URL**: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/
- **Last Updated**: July 9, 2025

## 🚀 Recommended Deployment Methods

### Option 1: Enhanced Deploy (BEST FOR APP.TSX 500 ERROR)
```bash
# The most reliable way to fix App.tsx 500 errors
npm run enhanced-deploy
```

### Option 2: Clean Deploy Script
```bash
# JavaScript version
npm run clean-deploy

# OR Bash version (Git Bash/Linux/Mac)
bash clean_deploy.sh

# OR PowerShell version (Windows)
powershell -ExecutionPolicy Bypass -File .\clean_deploy.ps1
```

### Option 2: Emergency Manual Deploy
If the scripts don't work:

```bash
git push origin --delete gh-pages
rm -rf dist node_modules/.cache/gh-pages
npm run build
echo "" > dist/.nojekyll
npx gh-pages -d dist --dotfiles
```

## ⚠️ Critical Rules

1. **NEVER modify** `vite.config.ts` base path
2. **ALWAYS use** `getImagePath()` for images  
3. **ALWAYS test locally** before deploying
4. **WAIT 5 minutes** after deployment for GitHub Pages to update
5. **VERIFY** deployment by checking network requests in DevTools

## 🔍 Post-Deployment Verification

After deploying, always check:

1. Network tab shows no 404 errors
2. Assets load from `/ShatamCareFoundation/assets/` (not `/src/`)
3. Page loads without blank screens
4. No App.tsx 500 errors in the console

## 🔧 Quick Fixes

### App.tsx 500 Error Fix:

If you see "App.tsx:1 Failed to load resource: the server responded with a status of 500", use:

```bash
npm run enhanced-deploy
```

This creates a completely clean deployment that eliminates source files from the gh-pages branch.

### "main.tsx Failed to load" Error:
```bash
git push origin --delete gh-pages
Remove-Item -Recurse -Force dist
npm run build
npx gh-pages -d dist --dotfiles --remove ".*" --add
```

**Note**: This is a persistent issue with gh-pages deployment. The above nuclear option works but may need to be repeated occasionally.

### Images not loading:
- Check if using `getImagePath()` function
- Verify image exists in `public/images/`

### White blank page:
- Check browser console for errors
- Verify all asset paths in built files

## 📞 Emergency Reset
If everything breaks, use the nuclear option in DEPLOYMENT_CHECKLIST.md
