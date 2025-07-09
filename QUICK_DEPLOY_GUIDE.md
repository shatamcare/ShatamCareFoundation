# GitHub Pages Deployment - Quick Reference

## ✅ Current Status: WORKING
- **Live URL**: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/
- **Last Successful Deploy**: July 9, 2025

## 🚀 Safe Deployment Commands

### For Regular Updates:
```bash
npm run deploy
```

### For Emergency/Clean Deploy:
```bash
git push origin --delete gh-pages
rm -rf dist  # Windows: Remove-Item -Recurse -Force dist
npm run build
npx gh-pages -d dist --dotfiles
```

## ⚠️ Critical Rules

1. **NEVER modify** `vite.config.ts` base path
2. **ALWAYS use** `getImagePath()` for images  
3. **ALWAYS test locally** before deploying
4. **WAIT 2-3 minutes** after deployment for GitHub Pages to update

## 🔧 Quick Fixes

### "main.tsx Failed to load" Error:
```bash
git push origin --delete gh-pages && npm run deploy
```

### Images not loading:
- Check if using `getImagePath()` function
- Verify image exists in `public/images/`

### White blank page:
- Check browser console for errors
- Verify all asset paths in built files

## 📞 Emergency Reset
If everything breaks, use the nuclear option in DEPLOYMENT_CHECKLIST.md
