/**
 * image-fallback-helper.ts
 * 
 * Provides fallback mechanisms for missing images
 */

import { getImagePath } from './imagePaths';

/**
 * List of available fallback images in the project
 */
const AVAILABLE_FALLBACK_IMAGES = {
  art: 'images/Media/EHA9.jpg',
  news: 'images/Media/News.jpg',
  news2: 'images/Media/News2.jpg',
  tweet: 'images/Media/tweet.jpg',
  placeholder: 'images/placeholder.jpg',
  logo: 'images/shatam-care-foundation-logo.png'
};

/**
 * Gets a suitable fallback image based on the original filename or content type
 * 
 * @param originalUrl The original image URL that failed to load
 * @returns A fallback image URL that should exist in the project
 */
export function getFallbackImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    return getImagePath(AVAILABLE_FALLBACK_IMAGES.placeholder);
  }

  const filename = originalUrl.toLowerCase();
  
  // Check if it's an art-related image
  if (filename.includes('art') || filename.includes('activity') || filename.includes('event')) {
    return getImagePath(AVAILABLE_FALLBACK_IMAGES.art);
  }
  
  // Check if it's news-related
  if (filename.includes('news') || filename.includes('media')) {
    return getImagePath(AVAILABLE_FALLBACK_IMAGES.news);
  }
  
  // Default to placeholder
  return getImagePath(AVAILABLE_FALLBACK_IMAGES.placeholder);
}

/**
 * Checks if an image URL points to a file that actually exists in the project
 * 
 * @param imageUrl The image URL to check
 * @returns Whether the image likely exists based on known available images
 */
export function isImageAvailable(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // If it's a Supabase URL, assume it might be available
  if (imageUrl.includes('supabase.co')) {
    return true; // Let the browser handle the 404
  }
  
  // Check against known available images
  const availableImages = Object.values(AVAILABLE_FALLBACK_IMAGES);
  const normalizedUrl = imageUrl.replace(/^\//, '').replace(/^images\//, 'images/');
  
  return availableImages.some(img => img.includes(normalizedUrl) || normalizedUrl.includes(img));
}
