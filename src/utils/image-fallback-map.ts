/**
 * image-fallback-map.ts
 * 
 * Centralized mapping for providing fallback images. This ensures that if an image
 * fails to load from Supabase or another external source, the application can
 * gracefully fall back to a local image that is guaranteed to exist.
 */

import { getImagePath } from './imagePaths';

/**
 * A map of keywords to available local fallback images.
 * The keys are lowercase strings that might appear in filenames.
 * The values are paths to existing images in the `public` directory.
 */
export const FALLBACK_IMAGE_MAP: Record<string, string> = {
  'art': getImagePath('images/Media/EHA9.jpg'),
  'activity': getImagePath('images/Media/EHA9.jpg'),
  'event': getImagePath('images/Media/EHA9.jpg'),
  'news': getImagePath('images/Media/News.jpg'),
  'media': getImagePath('images/Media/News.jpg'),
  'tweet': getImagePath('images/Media/tweet.jpg'),
  'default': getImagePath('images/placeholder.jpg')
};

/**
 * Gets a suitable fallback image based on the original filename.
 * It searches for keywords from the map in the provided URL.
 * 
 * @param originalUrl The original image URL that failed to load.
 * @returns A URL to a local fallback image that is known to exist.
 */
export function getFallbackImageByKeyword(originalUrl: string | null | undefined): string {
  if (!originalUrl) {
    return FALLBACK_IMAGE_MAP.default;
  }

  const url = originalUrl.toLowerCase();
  
  for (const keyword in FALLBACK_IMAGE_MAP) {
    if (keyword !== 'default' && url.includes(keyword)) {
      return FALLBACK_IMAGE_MAP[keyword];
    }
  }
  
  // Return the default placeholder if no keywords match.
  return FALLBACK_IMAGE_MAP.default;
}
