import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { throttle } from '@/utils/performance';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down with throttled scroll handler
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Use throttled scroll handler to prevent performance violations
    const throttledToggleVisibility = throttle(toggleVisibility, 16); // ~60fps

    window.addEventListener('scroll', throttledToggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', throttledToggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <Button 
          onClick={scrollToTop} 
          className="fixed bottom-20 right-6 z-40 bg-warm-teal hover:bg-warm-teal-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-fade-in"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default BackToTopButton;