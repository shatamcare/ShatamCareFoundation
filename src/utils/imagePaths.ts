/**
 * Utility function to get correct image paths for GitHub Pages deployment
 * This ensures images load correctly both in development and production
 */

import { getBaseUrl, isProduction } from './url-helpers';

/**
 * Get the correct image path for the current environment
 * @param imagePath - The image path relative to the public directory (e.g., "images/logo.png")
 * @returns The correct image path for the current environment
 */
// Base64 encoded SVG fallback image
const fallbackSvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <text x="100" y="100" font-family="Arial" font-size="14" fill="#666666" text-anchor="middle" dominant-baseline="middle">Image not available</text>
  <rect x="60" y="70" width="80" height="60" stroke="#666666" stroke-width="2" fill="none"/>
  <line x1="60" y1="70" x2="140" y2="130" stroke="#666666" stroke-width="2"/>
  <line x1="140" y1="70" x2="60" y2="130" stroke="#666666" stroke-width="2"/>
</svg>`;

// Convert SVG to base64 using btoa (browser's built-in base64 encoder)
export const fallbackImageDataUrl = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;

/**
 * Cache for verified image paths
 */
const imagePathCache = new Map<string, boolean>();

/**
 * Check if an image exists at the given path
 */
const verifyImagePath = async (path: string): Promise<boolean> => {
  if (imagePathCache.has(path)) {
    return imagePathCache.get(path)!;
  }

  try {
    const response = await fetch(path, { method: 'HEAD' });
    const exists = response.ok;
    imagePathCache.set(path, exists);
    return exists;
  } catch {
    imagePathCache.set(path, false);
    return false;
  }
};

export const getImagePath = (imagePath: string): string => {
  try {
    // Special case for fallback image or empty paths
    if (imagePath === 'images/fallback.svg' || !imagePath) {
      return fallbackImageDataUrl;
    }

    // Normalize the path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const baseUrl = getBaseUrl();
    const fullPath = `${baseUrl}/${cleanPath}`;

    // Start verification but don't wait for it
    verifyImagePath(fullPath).then(exists => {
      if (!exists) {
        console.warn(`Image not found: ${fullPath}`);
      }
    });

    return fullPath;
  } catch (error) {
    console.error('Error in getImagePath:', error);
    return fallbackImageDataUrl;
  }
};

/**
 * Get the correct image path for CSS background images
 * @param imagePath - The image path relative to the public directory
 * @returns The correct image path wrapped in url() for CSS
 */
export const getBackgroundImagePath = (imagePath: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `url("${getImagePath(cleanPath)}")`;
};

/**
 * Common image paths used throughout the application
 */
export const imagePaths = {
  logo: getImagePath('images/Team/SC_LOGO-removebg-preview.png'),
  care: getImagePath('images/Users/care.jpg'),
  amrita: getImagePath('images/Team/Amrita.jpg'),
  
  // User images
  users: {
    eha1: getImagePath('images/Users/EHA (1).jpg'),
    dementiaCare1: getImagePath('images/Users/dementia care 1.jpg'),
    care: getImagePath('images/Users/care.jpg'),
  },
  
  // Caregiver images  
  caregivers: {
    sessions: getImagePath('images/Caregivers/sessions.jpg'),
    training: getImagePath('images/Caregivers/training.jpg'),
    care: getImagePath('images/Users/care.jpg'),
  },
  
  // Brain Kit images
  brainKit: {
    kit: getImagePath('images/Brain Kit/kit.jpg'),
    brainBridge: getImagePath('images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg'),
  },
  
  // Team images
  team: {
    logo: getImagePath('images/Team/SC_LOGO-removebg-preview.png'),
    amrita: getImagePath('images/Team/Amrita.jpg'),
  }
};

// Image optimization utilities
export const getOptimizedImagePath = (path: string, size = 'default') => {
  // Base implementation - in a production environment, this could integrate with a CDN or image service
  const sizeSuffix = size === 'default' ? '' : `?size=${size}`;
  return getImagePath(path) + sizeSuffix;
};

export const lazyLoadImage = (element: HTMLImageElement) => {
  if ('loading' in HTMLImageElement.prototype) {
    element.loading = 'lazy';
  }
  // Could be extended with IntersectionObserver for browsers without native lazy loading
};

// Preload critical images
/**
 * Set of already preloaded image paths
 */
const preloadedImages = new Set<string>();

export const preloadCriticalImages = async () => {
  try {
    // Define critical images that should be preloaded
    const criticalImagePaths = [
      imagePaths.team.logo,
      getImagePath('images/Users/care.jpg')
    ];
    
    // Filter out already preloaded images
    const imagesToPreload = criticalImagePaths.filter(path => !preloadedImages.has(path));
    
    if (imagesToPreload.length === 0) {
      return; // Nothing to preload
    }

    // Verify and preload images in parallel
    const preloadTasks = imagesToPreload.map(async (path) => {
      try {
        // First verify the image exists
        const exists = await verifyImagePath(path);
        
        if (exists) {
          // Create preload link
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = path;
          document.head.appendChild(link);
          
          // Mark as preloaded
          preloadedImages.add(path);
        } else {
          console.warn(`Skipping preload for non-existent image: ${path}`);
        }
      } catch (err) {
        console.warn(`Error preloading image ${path}:`, err);
      }
    });

    // Wait for all preload tasks to complete
    await Promise.all(preloadTasks);
  } catch (error) {
    console.warn('Error in preloadCriticalImages:', error);
  }
};
