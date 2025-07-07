/**
 * Utility function to get correct image paths for GitHub Pages deployment
 * This ensures images load correctly both in development and production
 */

// Get the base URL for the application
const getBaseUrl = (): string => {
  // In production (GitHub Pages), we need to include the repository name
  if (import.meta.env.PROD) {
    return '/ShatamCareFoundation';
  }
  // In development, no base path needed
  return '';
};

/**
 * Get the correct image path for the current environment
 * @param imagePath - The image path relative to the public directory (e.g., "images/logo.png")
 * @returns The correct image path for the current environment
 */
export const getImagePath = (imagePath: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = getBaseUrl();
  
  // For production, we need to add the base URL
  if (import.meta.env.PROD) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  // For development, just add leading slash
  return `/${cleanPath}`;
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
  const criticalImagePaths = [
    imagePaths.team.logo,
    getImagePath('images/Users/care.jpg')
  ];
  
  criticalImagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};
