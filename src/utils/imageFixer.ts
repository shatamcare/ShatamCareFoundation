/**
 * Image Fix Utility - Complete Solution for 404 Image Errors
 * 
 * This file provides a comprehensive fix for the image loading issues
 * by creating a mapping from problematic image names to correct ones.
 */

import { getImagePath } from './imagePaths';

// Mapping of problematic image names to correct file names
export const IMAGE_NAME_FIXES = {
  // Fix EHA1.jpg -> EHA (1).jpg
  'EHA1.jpg': 'EHA (1).jpg',
  'EHA1': 'EHA (1).jpg',
  
  // Fix EHA (3).jpg -> EHA (2).jpg (since EHA (3).jpg doesn't exist)
  'EHA (3).jpg': 'EHA (2).jpg',
  'EHA3.jpg': 'eha3.jpg',  // Use the lowercase version that exists
  
  // These files exist and shouldn't cause 404s, but let's ensure proper paths
  'training.jpg': 'training.jpg',
  'brain_bridge_boxcontent-1024x1024.jpeg': 'brain_bridge_boxcontent-1024x1024.jpeg',
} as const;

/**
 * Fix image name if it's in our problematic list
 */
export const fixImageName = (imageName: string): string => {
  if (imageName in IMAGE_NAME_FIXES) {
    return IMAGE_NAME_FIXES[imageName as keyof typeof IMAGE_NAME_FIXES];
  }
  return imageName;
};

/**
 * Smart image URL resolver that handles all problematic cases
 */
export const resolveImageUrl = (imageUrl: string | null | undefined, category: string = 'Users'): string => {
  if (!imageUrl) {
    return getImagePath('images/fallback.svg');
  }

  try {
    // Extract just the filename from the URL
    const fileName = imageUrl.split('/').pop() || '';
    
    // Fix the filename if it's problematic
    const fixedFileName = fixImageName(fileName);
    
    // Construct the proper path
    const properPath = `images/${category}/${fixedFileName}`;
    
    // Return the properly encoded path
    return getImagePath(properPath);
  } catch (error) {
    console.warn('Error resolving image URL:', imageUrl, error);
    return getImagePath('images/fallback.svg');
  }
};

/**
 * Batch fix for database URLs that might contain the problematic paths
 */
export const fixDatabaseImageUrl = (databaseUrl: string | null | undefined): string => {
  if (!databaseUrl) {
    return getImagePath('images/fallback.svg');
  }

  // Handle full URLs from database
  if (databaseUrl.startsWith('http')) {
    return databaseUrl;
  }

  // Handle relative paths from database
  if (databaseUrl.includes('EHA1.jpg')) {
    return getImagePath('images/Users/EHA (1).jpg');
  }
  
  if (databaseUrl.includes('EHA (3).jpg')) {
    return getImagePath('images/Users/EHA (2).jpg');
  }

  // For other paths, use the standard fixing logic
  return getImagePath(databaseUrl);
};

/**
 * Get a safe image URL for events
 */
export const getEventImageUrl = (event: any): string => {
  if (event?.image_url) {
    return fixDatabaseImageUrl(event.image_url);
  }
  
  // Fallback based on event type
  const eventType = event?.title?.toLowerCase();
  if (eventType?.includes('workshop')) {
    return getImagePath('images/Caregivers/training.jpg');
  }
  if (eventType?.includes('support')) {
    return getImagePath('images/Caregivers/sessions.jpg');
  }
  
  return getImagePath('images/Users/care.jpg');
};

/**
 * Debug function to log all image resolution attempts
 */
export const debugImageResolution = (originalUrl: string, fixedUrl: string) => {
  if (originalUrl !== fixedUrl) {
    console.log(`🔧 Image URL fixed: "${originalUrl}" → "${fixedUrl}"`);
  }
};
