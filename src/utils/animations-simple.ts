// Simple animations without GSAP for debugging
export const safeInitAnimations = () => {
  try {
    if (import.meta.env.DEV) console.log('Simple animations initialized');
    // Remove loading class immediately
    document.body.classList.remove('loading');
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const loadingElements = document.querySelectorAll('.loading, [class*="loading"]');
      loadingElements.forEach(el => el.classList.remove('loading'));
    });
    
    // Prevent any hash route conflicts
    if (typeof window !== 'undefined') {
      // Override any existing smooth scroll behavior that might interfere
      window.addEventListener('hashchange', (e) => {
        // Don't interfere with router hash changes
        if (window.location.hash.includes('/')) {
          return; // Let React Router handle this
        }
      });
    }
    
  } catch (error) {
    console.error('Animation initialization failed:', error);
    document.body.classList.remove('loading');
  }
};

export const initSmoothScroll = () => {
  if (import.meta.env.DEV) console.log('Smooth scroll initialized');
  // Lightweight scroll implementation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Only handle actual anchor links (like #home, #about), not route hashes (like #/admin)
      // Skip any href that contains forward slashes (route patterns)
      if (targetId && !targetId.includes('/') && targetId !== '#') {
        e.preventDefault();
        try {
          // Double-check that this is a valid CSS selector before using it
          if (targetId.match(/^#[a-zA-Z][\w-]*$/)) {
            const target = document.querySelector(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            console.warn('Skipping invalid CSS selector for smooth scroll:', targetId);
          }
        } catch (error) {
          console.warn('Invalid selector for smooth scroll:', targetId, error);
        }
      }
    });
  });
};

export const initLoadingAnimation = () => {
  if (import.meta.env.DEV) console.log('Loading animation initialized');
};

export const initMobileOptimizations = () => {
  if (import.meta.env.DEV) console.log('Mobile optimizations initialized');
};

export const refreshScrollTrigger = () => {
  if (import.meta.env.DEV) console.log('Scroll trigger refreshed');
};

export const cleanupAnimations = () => {
  if (import.meta.env.DEV) console.log('Animations cleaned up');
};
