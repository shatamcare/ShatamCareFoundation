# GitHub Pages Deployment Checklist

## Before Making Any Changes

- [ ] Website is currently working at: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/
- [ ] Development server works locally: `npm run dev`

## Safe Development Workflow

### 1. Making Code Changes
```bash
# Always start with latest code
git pull origin main

# Make your changes
# Test locally
npm run dev

# Test build process
npm run build

# Preview built version locally
npm run preview
```

### 2. Safe Deployment Process
```bash
# Run full deployment pipeline
npm run deploy
# This automatically runs: typecheck + build + gh-pages deploy

# Alternative manual steps:
npm run typecheck  # Check for TypeScript errors
npm run build      # Build for production
npx gh-pages -d dist --dotfiles  # Deploy to GitHub Pages
```

### 3. After Deployment
- [ ] Wait 2-3 minutes for GitHub Pages to update
- [ ] Test website in incognito/private mode
- [ ] Check browser console for any errors

## Critical Files - DO NOT MODIFY

### vite.config.ts
- ✅ `base: "/ShatamCareFoundation/"` - MUST stay as is
- ❌ Don't change base path or it will break GitHub Pages

### src/App.tsx
- ✅ `basename={import.meta.env.PROD ? "/ShatamCareFoundation" : ""}` - MUST stay as is
- ❌ Don't modify router basename

### package.json deployment scripts
- ✅ `"deploy": "gh-pages -d dist"` - MUST stay as is
- ✅ `"predeploy": "npm run typecheck && npm run build"` - MUST stay as is

## Image Upload Guidelines

### Adding New Images
1. Place images in `public/images/` folder
2. Use `getImagePath()` function for all image references:
   ```tsx
   import { getImagePath } from '@/utils/imagePaths';
   
   // Correct way
   <img src={getImagePath('images/folder/image.jpg')} />
   
   // Wrong way
   <img src="/images/folder/image.jpg" />
   ```

### Folder Names with Spaces
- Spaces in folder names are OK (automatically encoded)
- Example: `images/Brain Kit/image.jpg` works fine

## Troubleshooting Common Issues

### Issue: "main.tsx Failed to load"
- **Cause**: Development index.html being served instead of built version
- **Fix**: 
  ```bash
  git push origin --delete gh-pages
  npm run deploy
  ```

### Issue: Images not loading (404)
- **Cause**: Incorrect image paths
- **Fix**: Ensure using `getImagePath()` function

### Issue: Blank white page
- **Cause**: JavaScript errors or incorrect base paths
- **Fix**: Check browser console, verify vite.config.ts base path

### Issue: CSS not loading
- **Cause**: Build process issues
- **Fix**: 
  ```bash
  rm -rf dist
  npm run build
  npm run deploy
  ```

## Quick Recovery Commands

```bash
# Nuclear option - complete reset
git push origin --delete gh-pages
rm -rf dist
npm run build
npx gh-pages -d dist --dotfiles

# Commit any local changes first
git add .
git commit -m "Fix deployment"
git push origin main
```

## Emergency Contacts & Resources

- Repository: https://github.com/adarshalexbalmuchu/ShatamCareFoundation
- Live Site: https://adarshalexbalmuchu.github.io/ShatamCareFoundation/
- Documentation: This file

## Status Log

✅ **July 9, 2025**: Website working correctly
- All assets loading properly
- Images displaying correctly  
- Router working with proper basename
- Build process functioning normally

❌ **July 9, 2025 - Issue Occurred**: `main.tsx` loading error returned
- **Symptom**: `GET https://adarshalexbalmuchu.github.io/src/main.tsx net::ERR_ABORTED 404`
- **Cause**: gh-pages branch became corrupted again, serving source files instead of built files
- **Fix Applied**: Emergency reset procedure
  ```bash
  git push origin --delete gh-pages
  Remove-Item -Recurse -Force dist
  npm run build
  npx gh-pages -d dist --dotfiles
  ```
- **Result**: ✅ Website restored and working

✅ **July 9, 2025 - Post Fix**: Website working correctly again
- Emergency procedures tested and validated
- Documentation proves effective for quick recovery
