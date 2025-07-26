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
      if (targetId && !targetId.includes('/')) {
        e.preventDefault();
        try {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
