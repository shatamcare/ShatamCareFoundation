import { useEffect, useRef, useState } from 'react';

/**
 * Hook for lazily loading components when they're about to enter the viewport
 * @param options Configuration options for the Intersection Observer
 * @returns An object with the ref to attach to the target element and a boolean indicating if the element is visible
 */
export const useLazyLoad = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    
    // Early return if ref not attached or IntersectionObserver not available
    if (!currentRef || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(currentRef);
      }
    }, {
      rootMargin: '100px',
      threshold: 0.1,
      ...options
    });

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

export default useLazyLoad;