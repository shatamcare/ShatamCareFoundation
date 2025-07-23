/**
 * Utility to fix image URLs with spaces and special characters
 * This is specifically for fixing existing database entries that might have problematic URLs
 */

import { getImagePath } from './imagePaths';

/**
 * Fix problematic image URLs that contain spaces or special characters
 * @param imageUrl - The original image URL that might contain spaces
 * @returns The corrected image URL with proper encoding
 */
export const fixImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '';
  }

  // If it's already a full URL (http/https), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with a slash, remove it for getImagePath processing
  let cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;

  // Use getImagePath to ensure proper URL encoding and base path handling
  return getImagePath(cleanUrl);
};

/**
 * Check if an image URL is problematic (contains spaces or special characters)
 * @param imageUrl - The image URL to check
 * @returns true if the URL is problematic
 */
export const isProblematicImageUrl = (imageUrl: string | null | undefined): boolean => {
  if (!imageUrl) {
    return false;
  }

  // Check for spaces and other problematic characters
  return /[\s()&]/.test(imageUrl);
};

/**
 * Get a list of known problematic image paths and their fixes
 * This can be used for batch fixing operations
 */
export const knownProblematicPaths = [
  {
    original: '/images/Users/EHA (1).jpg',
    fixed: 'images/Users/EHA (1).jpg'
  },
  {
    original: '/images/Users/EHA (2).jpg', 
    fixed: 'images/Users/EHA (2).jpg'
  },
  {
    original: '/images/Users/dementia care 1.jpg',
    fixed: 'images/Users/dementia care 1.jpg'
  },
  {
    original: '/images/Users/memory cafe.jpeg',
    fixed: 'images/Users/memory cafe.jpeg'
  },
  {
    original: '/images/Users/activities 1.jpg',
    fixed: 'images/Users/activities 1.jpg'
  },
  {
    original: '/images/Users/activities 2.jpg',
    fixed: 'images/Users/activities 2.jpg'
  },
  {
    original: '/images/Caregivers/career discussion.jpg',
    fixed: 'images/Caregivers/career discussion.jpg'
  },
  {
    original: '/images/Caregivers/trainng 2.jpg',
    fixed: 'images/Caregivers/trainng 2.jpg'
  },
  {
    original: '/images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg',
    fixed: 'images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg'
  },
  {
    original: '/images/Brain Kit/tool kit.jpg',
    fixed: 'images/Brain Kit/tool kit.jpg'
  }
];

/**
 * Batch fix image URLs using the known problematic paths
 * @param imageUrl - The image URL to potentially fix
 * @returns The fixed image URL
 */
export const batchFixImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '';
  }

  // Find and fix known problematic paths
  const knownFix = knownProblematicPaths.find(path => 
    imageUrl === path.original || imageUrl.endsWith(path.original)
  );

  if (knownFix) {
    return getImagePath(knownFix.fixed);
  }

  // Default to the standard fix
  return fixImageUrl(imageUrl);
};
