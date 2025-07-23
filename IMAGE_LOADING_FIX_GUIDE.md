# Image Loading Fix Guide

This document explains the fix for image loading issues on GitHub Pages where images with spaces in their filenames were failing to load.

## Problem

Images with spaces in their filenames (like `EHA (1).jpg`, `dementia care 1.jpg`, `memory cafe.jpeg`) were failing to load on GitHub Pages with 404 errors:

```
GET https://adarshalexbalmuchu.github.io/images/Users/EHA%20(1).jpg 404 (Not Found)
Failed to load image: /images/Users/EHA (1).jpg
```

## Root Cause

When image paths contain spaces, they need to be properly URL-encoded for web browsers. GitHub Pages servers expect URL-encoded paths, but the application was using raw paths with spaces.

## Solution

### 1. Enhanced Image Path Utility (`src/utils/imagePaths.ts`)

Added a `encodeImagePath` function that properly URL-encodes each path segment:

```typescript
const encodeImagePath = (path: string): string => {
  return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
};
```

This function:
- Splits the path by '/' to preserve directory structure
- Encodes each segment separately using `encodeURIComponent`
- Rejoins the segments with '/'

### 2. Updated All Hardcoded Image URLs

Fixed all hardcoded image URLs in:
- `src/components/admin/EventsPage.tsx` - Changed raw URLs to use `getImagePath()`
- Updated all problematic paths like:
  - `/images/Users/EHA (1).jpg` → `getImagePath('images/Users/EHA (1).jpg')`
  - `/images/Users/dementia care 1.jpg` → `getImagePath('images/Users/dementia care 1.jpg')`
  - `/images/Users/memory cafe.jpeg` → `getImagePath('images/Users/memory cafe.jpeg')`

### 3. Created Image URL Fixer Utility (`src/utils/imageUrlFixer.ts`)

Added utility functions to fix existing problematic image URLs:
- `fixImageUrl()` - Fixes individual image URLs
- `isProblematicImageUrl()` - Detects URLs with spaces
- `batchFixImageUrl()` - Handles batch fixing with known problematic paths

### 4. Updated Components to Use Fixed URLs

Modified event-displaying components:
- `src/pages/EventsPage.tsx` - Uses `fixImageUrl()` for database image URLs
- `src/pages/Index.tsx` - Uses `fixImageUrl()` for event images
- `src/components/admin/EventsPage.tsx` - Uses `fixImageUrl()` for display

## Files Changed

1. **`src/utils/imagePaths.ts`** - Added URL encoding to `getImagePath()`
2. **`src/utils/imageUrlFixer.ts`** - New utility for fixing problematic URLs
3. **`src/components/admin/EventsPage.tsx`** - Updated hardcoded URLs and display logic
4. **`src/pages/EventsPage.tsx`** - Added URL fixing for database images
5. **`src/pages/Index.tsx`** - Added URL fixing for event images

## Testing

To verify the fix works:

1. **Development Testing:**
   ```bash
   npm run dev
   ```
   - Navigate to the Events section
   - Check browser console for image loading errors
   - Verify images with spaces in filenames display correctly

2. **Production Testing:**
   ```bash
   npm run build
   npm run preview
   ```
   - Test the built version locally
   - Check that image paths are properly encoded

3. **GitHub Pages Testing:**
   - Deploy to GitHub Pages
   - Navigate to events section
   - Verify all images load without 404 errors

## Prevention

To prevent this issue in the future:

1. **File Naming**: Prefer filenames without spaces (use dashes or underscores)
2. **Always Use getImagePath()**: Never use raw image paths, always use the `getImagePath()` utility
3. **Database URLs**: When storing image URLs in the database, use the format expected by `getImagePath()` (relative paths without leading slash)

## Example

**Before (Problematic):**
```typescript
// ❌ This causes 404 on GitHub Pages
<img src="/images/Users/EHA (1).jpg" alt="Event" />
```

**After (Fixed):**
```typescript
// ✅ This works correctly
import { getImagePath } from '@/utils/imagePaths';
<img src={getImagePath('images/Users/EHA (1).jpg')} alt="Event" />
```

## Image Files with Spaces

These specific files were causing issues and are now fixed:
- `EHA (1).jpg`
- `EHA (2).jpg` 
- `dementia care 1.jpg`
- `memory cafe.jpeg`
- `activities 1.jpg`
- `activities 2.jpg`
- `career discussion.jpg`
- `trainng 2.jpg`
- `brain_bridge_boxcontent-1024x1024.jpeg`
- `tool kit.jpg`

All of these now use proper URL encoding when loaded in the application.
