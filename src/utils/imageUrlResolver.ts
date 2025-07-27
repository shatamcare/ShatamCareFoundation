/**
 * Unified image URL resolution for the Shatam Care Foundation app
 * 
 * This utility provides centralized handling of image URLs to ensure consistency
 * across the application, especially when dealing with Supabase storage URLs
 * and local image paths.
 */

import { supabase } from '../lib/supabase-secure';
import { getImagePath } from './imagePaths';
import { getBaseUrl, isProduction } from './url-helpers';
import { logImageUrlDebug } from './debug-helpers';
import { getFallbackImageByKeyword } from './image-fallback-map';

// Cache for verified image paths
const imagePathCache = new Map<string, string>();

/**
 * Resolves any image URL to a consistent format
 * 
 * @param imageUrl The original image URL (could be local path, Supabase URL, etc)
 * @returns A properly formatted URL that works in the current environment
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    // Return default placeholder if URL is empty
    return getImagePath('images/placeholder.jpg');
  }
  
  // Check cache first
  if (imagePathCache.has(imageUrl)) {
    return imagePathCache.get(imageUrl)!;
  }

  let resolvedUrl: string;
  
  // Case 1: Already a Supabase URL
  if (imageUrl.includes('supabase.co/storage/v1/object/public')) {
    resolvedUrl = imageUrl;
    // Disabled excessive logging: console.debug(`[Image Resolver] Using direct Supabase URL: ${imageUrl.substring(0, 50)}...`);
  }
  // Case 2: Any other full URL (http/https)
  else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    resolvedUrl = imageUrl;
    // Disabled excessive logging: console.debug(`[Image Resolver] Using external URL: ${imageUrl.substring(0, 50)}...`);
  }
  // Case 3: Local path (with or without leading slash)
  else {
    // Check if it's a path within our media bucket in Supabase
    if (imageUrl.startsWith('media/')) {
      try {
        // Extract filename and ensure proper encoding
        const filename = imageUrl.replace('media/', '');
        const encodedFilename = encodeURIComponent(filename);
        
        // Try Supabase storage first
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filename); // Use original filename, Supabase handles encoding
          
        if (urlData && urlData.publicUrl) {
          resolvedUrl = urlData.publicUrl;
        } else {
          throw new Error('No public URL returned from Supabase');
        }
      } catch (err) {
        // If Supabase fails, use a smart fallback strategy
        console.warn(`[Image Resolver] Supabase failed for ${imageUrl}, using keyword-based fallback.`);
        resolvedUrl = getFallbackImageByKeyword(imageUrl);
      }
    } else {
      // Use our existing getImagePath utility for local paths
      // This handles the base URL based on environment
      resolvedUrl = getImagePath(imageUrl);
    }
  }

  // Store in cache
  imagePathCache.set(imageUrl, resolvedUrl);
  
  // Log detailed debug information
  logImageUrlDebug(imageUrl, resolvedUrl, 'resolveImageUrl');
  
  return resolvedUrl;
}

/**
 * Checks if the provided URL is a valid image path
 * and returns a fallback if not
 * 
 * Note: For most cases, use resolveImageUrl directly instead
 */
export function getImageWithFallback(imageUrl: string | null | undefined, fallbackPath = 'images/placeholder.jpg'): string {
  // First resolve the URL
  const resolvedUrl = resolveImageUrl(imageUrl);
  
  // If URL is empty or still resolves to a known problematic path, use a keyword-based fallback
  if (!resolvedUrl || resolvedUrl.includes('placeholder.jpg')) {
    return getFallbackImageByKeyword(imageUrl);
  }
  
  // Log that this function was used
  console.info('[Image Resolver] Used getImageWithFallback for:', imageUrl, '→', resolvedUrl);
  
  // Return the resolved URL
  return resolvedUrl;
}

/**
 * Standardizes image path format for storage in the database
 * to ensure consistency across the application
 */
export function standardizeImagePath(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';

  let filename: string;

  // Case 1: Full Supabase URL
  if (imageUrl.includes('supabase.co/storage/v1/object/public')) {
    // Extract the last part of the URL, which is the filename
    filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  } 
  // Case 2: Path that includes a directory, like 'media/...' or 'images/...'
  else if (imageUrl.includes('/')) {
    filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  } 
  // Case 3: Just the filename
  else {
    filename = imageUrl;
  }

  // Remove the numeric prefix (e.g., "12345-") from the extracted filename
  const strippedFilename = filename.replace(/^\d+-/, '');

  // Return the standardized path with the 'media/' prefix
  return `media/${strippedFilename}`;
}
