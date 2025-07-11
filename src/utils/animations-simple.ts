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
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
