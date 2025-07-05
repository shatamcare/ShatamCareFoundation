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
 * @param imagePath - The image path relative to the public directory (e.g., "/images/logo.png")
 * @returns The correct image path for the current environment
 */
export const getImagePath = (imagePath: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = getBaseUrl();
  
  // If no base URL, just return the original path
  if (!baseUrl) {
    return `/${cleanPath}`;
  }
  
  // Return the full path with base URL
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Get the correct image path for CSS background images
 * @param imagePath - The image path relative to the public directory
 * @returns The correct image path wrapped in url() for CSS
 */
export const getBackgroundImagePath = (imagePath: string): string => {
  return `url("${getImagePath(imagePath)}")`;
};

/**
 * Common image paths used throughout the application
 */
export const imagePaths = {
  logo: getImagePath('/images/Team/SC_LOGO-removebg-preview.png'),
  care: getImagePath('/images/Users/care.jpg'),
  amrita: getImagePath('/images/Team/Amrita.jpg'),
  
  // User images
  users: {
    eha1: getImagePath('/images/Users/EHA (1).jpg'),
    dementiaCare1: getImagePath('/images/Users/dementia care 1.jpg'),
    care: getImagePath('/images/Users/care.jpg'),
  },
  
  // Caregiver images  
  caregivers: {
    sessions: getImagePath('/images/Caregivers/sessions.jpg'),
    training: getImagePath('/images/Caregivers/training.jpg'),
  },
  
  // Brain Kit images
  brainKit: {
    kit: getImagePath('/images/Brain Kit/kit.jpg'),
  },
  
  // Team images
  team: {
    logo: getImagePath('/images/Team/SC_LOGO-removebg-preview.png'),
    amrita: getImagePath('/images/Team/Amrita.jpg'),
  }
};
