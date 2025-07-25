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
import { getFallbackImageUrl, isImageAvailable } from './image-fallback-helper';

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
    // Log for debugging
    console.debug(`[Image Resolver] Using direct Supabase URL: ${imageUrl.substring(0, 50)}...`);
  }
  // Case 2: Any other full URL (http/https)
  else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    resolvedUrl = imageUrl;
    // Log for debugging
    console.debug(`[Image Resolver] Using external URL: ${imageUrl.substring(0, 50)}...`);
  }
  // Case 3: Local path (with or without leading slash)
  else {
    // Check if it's a path within our media bucket in Supabase
    if (imageUrl.startsWith('media/')) {
      try {
        // Try Supabase storage first
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(imageUrl.replace('media/', ''));
          
        if (urlData && urlData.publicUrl) {
          resolvedUrl = urlData.publicUrl;
          console.debug(`[Image Resolver] Converted to Supabase URL: ${imageUrl} → ${resolvedUrl.substring(0, 50)}...`);
        } else {
          throw new Error('No public URL returned from Supabase');
        }
      } catch (err) {
        // If Supabase fails, use a smart fallback strategy
        console.warn(`[Image Resolver] Supabase failed for ${imageUrl}, using fallback strategy`);
        
        if (isProduction() && typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
          // For GitHub Pages, first try to construct the full URL
          const repoName = window.location.pathname.split('/')[1] || 'ShatamCareFoundation';
          const attemptedUrl = `${window.location.origin}/${repoName}/${imageUrl}`;
          
          // But since we know this file likely doesn't exist, use a fallback image instead
          resolvedUrl = getFallbackImageUrl(imageUrl);
          console.debug(`[Image Resolver] Using fallback image for ${imageUrl}: ${resolvedUrl}`);
        } else {
          // For local development, try the original path first, then fallback
          const localPath = getImagePath(imageUrl);
          if (isImageAvailable(localPath)) {
            resolvedUrl = localPath;
          } else {
            resolvedUrl = getFallbackImageUrl(imageUrl);
            console.debug(`[Image Resolver] Using fallback image for local ${imageUrl}: ${resolvedUrl}`);
          }
        }
      }
    } else {
      // Use our existing getImagePath utility for local paths
      // This handles the base URL based on environment
      resolvedUrl = getImagePath(imageUrl);
      console.debug(`[Image Resolver] Resolved local path: ${imageUrl} → ${resolvedUrl}`);
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
  
  // If URL is empty, use the fallback
  if (!resolvedUrl) {
    return getImagePath(fallbackPath);
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
  
  // If it's already a Supabase URL, extract just the path part
  if (imageUrl.includes('supabase.co/storage/v1/object/public')) {
    // Extract just the filename from the full URL
    const matches = imageUrl.match(/\/([^/]+)$/);
    if (matches && matches[1]) {
      return `media/${matches[1]}`;
    }
  }
  
  // If it starts with media/, it's already in the correct format
  if (imageUrl.startsWith('media/')) {
    return imageUrl;
  }
  
  // For local paths, add media/ prefix if needed
  const baseUrl = getBaseUrl();
  const cleanUrl = imageUrl
    .replace(baseUrl, '')
    .replace(/^\//, '')
    .replace(/^images\//, 'media/');
    
  return cleanUrl;
}
