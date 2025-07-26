/**
 * robust-image-handler.tsx
 * 
 * A comprehensive solution for handling image loading with:
 * - Filename sanitization
 * - Infinite loop prevention
 * - Smart fallback handling
 * - Development logging
 * - React hook for easy integration
 */

import { useState, useCallback, useRef } from 'react';
import { getImagePath } from './imagePaths';
import { getFallbackImageByKeyword } from './image-fallback-map';

// Track failed images to prevent infinite loops
const failedImages = new Set<string>();
const maxRetries = 2;
const retryCount = new Map<string, number>();

/**
 * Sanitizes filenames by removing/replacing problematic characters
 * @param filename Original filename
 * @returns Sanitized filename safe for URLs
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9.-]/g, '')    // Remove special characters except dots and hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens
}

/**
 * Constructs a safe image path with fallback handling
 * @param imagePath Original image path
 * @param baseFolder Base folder (e.g., 'media', 'images')
 * @returns Sanitized and properly constructed image URL
 */
export function constructSafeImagePath(imagePath: string, baseFolder: string = 'media'): string {
  if (!imagePath) {
    return getFallbackImageByKeyword('default');
  }

  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's already a processed path, return as-is
  if (imagePath.includes('/ShatamCareFoundation/')) {
    return imagePath;
  }

  // Extract filename from path
  const filename = imagePath.split('/').pop() || imagePath;
  const sanitizedFilename = sanitizeFilename(filename);
  
  // Construct the full path
  const fullPath = `${baseFolder}/${sanitizedFilename}`;
  
  // Use existing image path utility for GitHub Pages compatibility
  return getImagePath(fullPath);
}

/**
 * Determines if an image should be retried or if we should give up
 * @param imageUrl The image URL that failed
 * @returns True if we should retry, false if we should use fallback
 */
function shouldRetryImage(imageUrl: string): boolean {
  const currentRetries = retryCount.get(imageUrl) || 0;
  return currentRetries < maxRetries && !failedImages.has(imageUrl);
}

/**
 * Logs image loading issues during development
 * @param issue Description of the issue
 * @param imageUrl The problematic image URL
 * @param suggestions Optional suggestions for fixing
 */
function logImageIssue(issue: string, imageUrl: string, suggestions?: string[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🖼️ Image Loading Issue: ${issue}`);
    console.log('URL:', imageUrl);
    if (suggestions && suggestions.length > 0) {
      console.log('Suggestions:');
      suggestions.forEach((suggestion, index) => {
        console.log(`  ${index + 1}. ${suggestion}`);
      });
    }
    console.groupEnd();
  }
}

/**
 * React hook for robust image handling with automatic fallbacks
 * @param initialImagePath Initial image path
 * @param baseFolder Base folder for the image (default: 'media')
 * @returns Object with imageSrc, onError handler, and loading state
 */
export function useRobustImage(initialImagePath: string, baseFolder: string = 'media') {
  const [imageSrc, setImageSrc] = useState<string>(() => 
    constructSafeImagePath(initialImagePath, baseFolder)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const errorHandledRef = useRef(false);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;

    // Prevent multiple error handling for the same event
    if (errorHandledRef.current) {
      return;
    }
    errorHandledRef.current = true;

    // Reset error handled flag after a short delay
    setTimeout(() => {
      errorHandledRef.current = false;
    }, 100);

    setIsLoading(false);
    setHasError(true);

    // Don't handle errors for our fallback SVG
    if (currentSrc.startsWith('data:image/svg+xml')) {
      return;
    }

    // Track retry attempts
    const currentRetries = retryCount.get(currentSrc) || 0;
    retryCount.set(currentSrc, currentRetries + 1);

    // Log the issue in development
    logImageIssue(
      'Failed to load image',
      currentSrc,
      [
        'Check if the file exists in the public folder',
        'Verify the filename matches exactly (case-sensitive)',
        'Ensure there are no special characters in the filename',
        'Consider using a different image format (jpg, png, webp)'
      ]
    );

    if (shouldRetryImage(currentSrc)) {
      // Try to get a contextual fallback first
      const fallbackUrl = getFallbackImageByKeyword(initialImagePath);
      
      if (fallbackUrl !== currentSrc) {
        console.log(`Trying fallback image: ${fallbackUrl}`);
        setImageSrc(fallbackUrl);
        return;
      }
    }

    // Mark as permanently failed and use the ultimate fallback
    failedImages.add(currentSrc);
    console.warn(`Image permanently failed, using SVG fallback: ${currentSrc}`);
    
    // Use the SVG fallback from imagePaths
    import('./imagePaths').then(({ fallbackImageDataUrl }) => {
      setImageSrc(fallbackImageDataUrl);
    });

    // Remove the error handler to prevent further events
    img.onerror = null;
  }, [initialImagePath]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Reset states when image path changes
  const resetStates = useCallback((newImagePath: string) => {
    setIsLoading(true);
    setHasError(false);
    errorHandledRef.current = false;
    setImageSrc(constructSafeImagePath(newImagePath, baseFolder));
  }, [baseFolder]);

  return {
    imageSrc,
    onError: handleImageError,
    onLoad: handleImageLoad,
    isLoading,
    hasError,
    resetImage: resetStates
  };
}

/**
 * Higher-order component for safe image rendering
 * @param props Standard img props plus some additional options
 */
interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError' | 'onLoad'> {
  src: string;
  baseFolder?: string;
  showLoadingSpinner?: boolean;
  fallbackClassName?: string;
}

export function SafeImage({ 
  src, 
  baseFolder = 'media', 
  showLoadingSpinner = false,
  fallbackClassName = '',
  className = '',
  alt = '',
  ...props 
}: SafeImageProps) {
  const { imageSrc, onError, onLoad, isLoading, hasError } = useRobustImage(src, baseFolder);

  return (
    <div className="relative">
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        onError={onError}
        onLoad={onLoad}
        alt={alt}
        className={`${className} ${hasError ? fallbackClassName : ''}`}
        {...props}
      />
    </div>
  );
}

/**
 * Utility function for immediate use without React hooks
 * @param imagePath Original image path
 * @param baseFolder Base folder
 * @returns Object with safe image properties
 */
export function createSafeImageProps(imagePath: string, baseFolder: string = 'media') {
  const safeImagePath = constructSafeImagePath(imagePath, baseFolder);
  
  return {
    src: safeImagePath,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      const currentSrc = img.src;

      if (currentSrc.startsWith('data:image/svg+xml')) {
        return;
      }

      logImageIssue('Image failed to load', currentSrc);

      const fallbackUrl = getFallbackImageByKeyword(imagePath);
      if (fallbackUrl !== currentSrc) {
        img.src = fallbackUrl;
      } else {
        import('./imagePaths').then(({ fallbackImageDataUrl }) => {
          img.src = fallbackImageDataUrl;
          img.onerror = null;
        });
      }
    }
  };
}

/**
 * Clear the failed images cache (useful for testing or manual retry)
 */
export function clearImageCache(): void {
  failedImages.clear();
  retryCount.clear();
  console.log('Image cache cleared');
}

/**
 * Get statistics about image loading failures (for debugging)
 */
export function getImageStats(): { failedCount: number; retryStats: Array<{url: string, retries: number}> } {
  return {
    failedCount: failedImages.size,
    retryStats: Array.from(retryCount.entries()).map(([url, retries]) => ({ url, retries }))
  };
}
