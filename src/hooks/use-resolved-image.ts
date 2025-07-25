import { useState, useEffect } from 'react';
import { resolveImageUrl } from '../utils/imageUrlResolver';
import { getFallbackImageByKeyword } from '../utils/image-fallback-map';

/**
 * A custom React hook to resolve an image URL asynchronously.
 * It handles loading and error states, and provides a reliable fallback.
 *
 * @param imageUrl The initial image URL to resolve.
 * @returns An object containing the resolved URL, loading state, and any error.
 */
export function useResolvedImage(imageUrl: string | null | undefined) {
  // Start with a default fallback. This ensures the initial render has a valid image source.
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => getFallbackImageByKeyword(imageUrl));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // If the image URL is invalid from the start, set the final fallback and stop.
    if (!imageUrl) {
      setResolvedUrl(getFallbackImageByKeyword(null));
      setIsLoading(false);
      return;
    }

    // Asynchronously resolve the URL.
    resolveImageUrl(imageUrl)
      .then(url => {
        if (isMounted) {
          // On success, update the URL.
          setResolvedUrl(url);
        }
      })
      .catch(err => {
        console.error(`[useResolvedImage] Error resolving image: ${imageUrl}`, err);
        if (isMounted) {
          setError(err);
          // On error, ensure a valid keyword-based fallback is set.
          setResolvedUrl(getFallbackImageByKeyword(imageUrl));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Cleanup function to prevent state updates on unmounted components.
    return () => {
      isMounted = false;
    };
  }, [imageUrl]); // Re-run the effect if the image URL changes.

  return { resolvedUrl, isLoading, error };
}
