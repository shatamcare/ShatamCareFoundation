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
export const getImagePath = (imagePath: string): string => {
  try {
    // Check if path is empty or undefined
    if (!imagePath) {
      console.error('Empty or undefined image path provided to getImagePath');
      return '/images/placeholder.jpg'; // Return a placeholder image path
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const baseUrl = getBaseUrl();
    
    // Encode the path to handle spaces and special characters
    const encodedPath = encodeURI(cleanPath);
    
    // For production, we need to add the base URL
    if (isProduction()) {
      return `${baseUrl}/${encodedPath}`;
    }
    
    // For development, we need a direct path relative to the public folder
    // Vite serves files from the public folder at the root
    const devPath = `/${encodedPath}`;
    
    // Log paths in development for debugging
    if (!isProduction() && import.meta.env.DEV) {
      console.debug(`[Image Path Debug] Original: "${imagePath}", Processed: "${devPath}"`);
    }
    
    return devPath;
  } catch (error) {
    console.warn(`Error processing image path: ${imagePath}`, error);
    return `/images/placeholder.jpg`; // Return a placeholder image path as fallback
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
export const preloadCriticalImages = () => {
  try {
    const criticalImagePaths = [
      imagePaths.team.logo,
      getImagePath('images/Users/care.jpg')
    ];
    
    criticalImagePaths.forEach(path => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = path;
        link.onerror = () => {
          console.warn(`Failed to preload image: ${path}`);
        };
        document.head.appendChild(link);
      } catch (err) {
        console.warn(`Error preloading image ${path}:`, err);
      }
    });
  } catch (error) {
    console.warn('Error in preloadCriticalImages:', error);
  }
};
