// Performance utilities to optimize event handlers and prevent violations

/**
 * Throttle function to limit how often a function can be called
 * Useful for scroll, resize, and other high-frequency events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Debounce function to delay execution until after a period of inactivity
 * Useful for search inputs, resize events, etc.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * RequestAnimationFrame-based throttling for smooth animations
 * Better for scroll handlers that update visual elements
 */
export const rafThrottle = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
};

/**
 * Passive event listener options for better scroll performance
 */
export const passiveEventOptions = {
  passive: true,
  capture: false
} as const;

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Optimize long-running tasks by breaking them into chunks
 */
export const yieldToMain = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
};

/**
 * Check if device is likely low-end based on hardware hints
 */
export const isLowEndDevice = (): boolean => {
  // Check for hardware hints
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory <= 4) {
    return true;
  }
  
  // Check for slow connection
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true;
    }
  }
  
  return false;
};
