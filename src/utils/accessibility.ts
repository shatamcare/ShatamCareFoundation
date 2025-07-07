// Accessibility utilities for the Shatam Care Foundation website

/**
 * Announces a message to screen readers using ARIA live regions
 * @param message The message to be announced
 * @param priority The announcement priority (polite or assertive)
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  // Create a live region if it doesn't exist
  let liveRegion = document.getElementById('sr-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-relevant', 'additions');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('sr-only'); // Visually hidden
    document.body.appendChild(liveRegion);
  }
  
  // Set the message
  liveRegion.textContent = message;
  
  // Clear the message after a short delay (optional)
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 3000);
};

/**
 * Enhances focus management for modal dialogs and other interactive elements
 * @param containerId The ID of the container to trap focus within
 * @returns Functions to enable and disable focus trapping
 */
export const createFocusTrap = (containerId: string) => {
  let previousActiveElement: Element | null = null;
  
  const enableFocusTrap = () => {
    previousActiveElement = document.activeElement;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    // Focus the first element
    (focusableElements[0] as HTMLElement).focus();
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // If Shift+Tab and on first element, go to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If Tab and on last element, go to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };
  
  const disableFocusTrap = () => {
    if (previousActiveElement && previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }
  };
  
  return { enableFocusTrap, disableFocusTrap };
};

/**
 * Adds enhanced keyboard navigation for custom UI components
 * @param selector CSS selector for the elements to enhance
 * @param options Configuration options
 */
export const enhanceKeyboardNavigation = (
  selector: string,
  options: { 
    onEnter?: (element: HTMLElement) => void; 
    onArrow?: (element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right') => void;
  } = {}
) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      const keyboardEvent = e as KeyboardEvent;
      
      // Handle Enter/Space for click actions
      if (options.onEnter && (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ')) {
        keyboardEvent.preventDefault();
        options.onEnter(element as HTMLElement);
      }
      
      // Handle arrow keys for navigation
      if (options.onArrow) {
        const direction = 
          keyboardEvent.key === 'ArrowUp' ? 'up' :
          keyboardEvent.key === 'ArrowDown' ? 'down' :
          keyboardEvent.key === 'ArrowLeft' ? 'left' :
          keyboardEvent.key === 'ArrowRight' ? 'right' : null;
          
        if (direction) {
          keyboardEvent.preventDefault();
          options.onArrow(element as HTMLElement, direction as 'up' | 'down' | 'left' | 'right');
        }
      }
    });
  });
};

/**
 * Automatically adds proper ARIA roles and attributes to common UI patterns
 */
export const enhanceAriaAttributes = () => {
  // Add appropriate ARIA roles to common UI elements
  document.querySelectorAll('nav').forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });
  
  document.querySelectorAll('main').forEach(main => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
  
  document.querySelectorAll('header').forEach(header => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  });
  
  document.querySelectorAll('footer').forEach(footer => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  });
  
  // Add aria-current to active navigation items
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
};