
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CustomEase } from 'gsap/CustomEase';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin, CustomEase);

// Custom easing for emotional appeal
CustomEase.create("memoryEase", "0.25, 0.46, 0.45, 0.94");
CustomEase.create("gentleFlow", "0.16, 1, 0.3, 1");
CustomEase.create("heartbeat", "0.68, -0.55, 0.265, 1.55");

// Animation configuration for emotional appeal
const config = {
  primary: {
    ease: "memoryEase",
    duration: 1.2,
    stagger: 0.15
  },
  gentle: {
    ease: "gentleFlow", 
    duration: 1.8,
    stagger: 0.08
  },
  emotional: {
    ease: "heartbeat",
    duration: 2.2,
    stagger: 0.12
  },
  mobile: window.innerWidth < 768
};

// Performance and accessibility checks
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

// Initialize all enhanced animations with performance considerations
export const initAnimations = () => {
  // Skip complex animations for users who prefer reduced motion
  if (prefersReducedMotion) {
    initBasicAnimations();
    return;
  }

  // Set initial loading state
  document.body.classList.add('loading');
  
  try {
    // Initialize core animations
    initFloatingHeroAnimation();
    initSoftSectionTransitions();
    initCareCardAnimations();
    initTestimonialEmotions();
    initDonationHeartbeat();
    initFooterGentleness();
    initScrollStorytelling();
    initStatsAnimations();
    
    // Initialize performance-intensive animations only on capable devices
    if (!isLowEndDevice && !config.mobile) {
      initMemoryGlowEffect();
      initBackgroundMagic();
    }
    
    // Remove loading state after animations are ready
    setTimeout(() => {
      document.body.classList.remove('loading');
    }, 500);
  } catch (error) {
    console.warn('Animation initialization failed:', error);
    // Fallback to basic animations
    initBasicAnimations();
    document.body.classList.remove('loading');
  }
};

// Basic animations for reduced motion or fallback
const initBasicAnimations = () => {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    gsap.set(section, { opacity: 1, y: 0 });
  });
  
  // Basic stats animation
  initStatsAnimations();
};

// Memory Glow Effect for Hero Background (optimized)
const initMemoryGlowEffect = () => {
  const heroOverlay = document.querySelector('.hero-overlay') as HTMLElement;
  if (!heroOverlay) return;

  // Simplified glow effect
  gsap.to(heroOverlay, {
    background: "linear-gradient(45deg, rgba(147, 51, 234, 0.7), rgba(139, 92, 246, 0.5), rgba(167, 139, 250, 0.6))",
    duration: 4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  // Reduced particle count for performance
  if (!config.mobile) {
    createFloatingMemories();
  }
};

// Optimized floating memories particles
const createFloatingMemories = () => {
  const hero = document.querySelector('#home') as HTMLElement;
  if (!hero) return;

  // Reduced particle count for better performance
  const particleCount = config.mobile ? 2 : 4;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'memory-particle';
    particle.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      pointer-events: none;
      z-index: 15;
      will-change: transform;
    `;
    hero.appendChild(particle);

    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    });

    gsap.to(particle, {
      y: "-=80",
      x: "+=30",
      opacity: 0.1,
      duration: 6 + Math.random() * 3,
      ease: "none",
      repeat: -1,
      delay: Math.random() * 3
    });
  }
};

// Enhanced Hero Animation with error handling
const initFloatingHeroAnimation = () => {
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  
  if (!heroTitle) return;

  const tl = gsap.timeline();
  
  // Memory-inspired text reveal
  tl.from(heroTitle, {
    y: 80,
    opacity: 0,
    duration: config.emotional.duration * 0.7, // Reduced duration for performance
    ease: config.emotional.ease,
    transformOrigin: "center bottom"
  });
  
  if (heroSubtitle) {
    tl.from(heroSubtitle, {
      y: 40,
      opacity: 0,
      duration: config.gentle.duration * 0.8,
      ease: config.gentle.ease
    }, "-=1.2");
  }
  
  if (heroButtons.length > 0) {
    tl.from(heroButtons, {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: config.primary.duration,
      stagger: config.primary.stagger,
      ease: config.primary.ease
    }, "-=1.0");

    // Reduced floating motion intensity
    gsap.to(heroButtons, {
      y: -4,
      duration: 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.5
    });
  }
};

// Optimized Section Transitions
const initSoftSectionTransitions = () => {
  const sections = gsap.utils.toArray("section") as HTMLElement[];
  
  sections.forEach((section, index) => {
    if (!section) return;
    
    const elements = section.querySelectorAll("h2, h3, p, .card, img");
    if (elements.length === 0) return;
    
    gsap.from(elements, {
      y: 50, // Reduced movement for performance
      opacity: 0,
      duration: config.gentle.duration * 0.8,
      stagger: config.gentle.stagger,
      ease: config.gentle.ease,
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Optimized Care Cards Animation
const initCareCardAnimations = () => {
  const cards = document.querySelectorAll(".program-card, .donation-card, .event-card");
  
  cards.forEach((card, index) => {
    const cardElement = card as HTMLElement;
    if (!cardElement) return;
    
    // Simplified hover effects
    const handleMouseEnter = () => {
      gsap.to(cardElement, {
        scale: 1.03, // Reduced scale for subtlety
        y: -8,
        boxShadow: "0 20px 40px rgba(147, 51, 234, 0.12)",
        duration: 0.4,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(cardElement, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        duration: 0.4,
        ease: "power2.out"
      });
    };
    
    cardElement.addEventListener("mouseenter", handleMouseEnter);
    cardElement.addEventListener("mouseleave", handleMouseLeave);
    
    // Scroll reveal
    gsap.from(cardElement, {
      opacity: 0,
      y: 40,
      scale: 0.98,
      duration: config.gentle.duration * 0.8,
      ease: config.gentle.ease,
      delay: index * 0.08,
      scrollTrigger: {
        trigger: cardElement,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Simplified Testimonial Emotions
const initTestimonialEmotions = () => {
  const testimonials = document.querySelectorAll('.testimonial, blockquote');
  
  testimonials.forEach(testimonial => {
    const testimonialElement = testimonial as HTMLElement;
    if (!testimonialElement) return;
    
    gsap.from(testimonialElement, {
      opacity: 0,
      y: 30,
      duration: config.emotional.duration * 0.7,
      ease: config.emotional.ease,
      scrollTrigger: {
        trigger: testimonialElement,
        start: "top 85%"
      }
    });
  });
};

// Optimized Donation Section
const initDonationHeartbeat = () => {
  const donateButtons = document.querySelectorAll('.cta-button, [class*="donate"]');
  
  donateButtons.forEach(button => {
    const buttonElement = button as HTMLElement;
    if (!buttonElement) return;
    
    // Subtle heartbeat pulse
    gsap.to(buttonElement, {
      scale: 1.02,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  });
};

// Simplified Background Magic
const initBackgroundMagic = () => {
  const body = document.body;
  
  // Create memory wave overlay
  const waveOverlay = document.createElement('div');
  waveOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.015) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    will-change: transform;
  `;
  body.appendChild(waveOverlay);
  
  // Gentle wave motion
  gsap.to(waveOverlay, {
    background: "radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.02) 0%, transparent 70%)",
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
};

// Enhanced Footer Animation
const initFooterGentleness = () => {
  const footer = document.querySelector('footer') as HTMLElement;
  if (!footer) return;
  
  gsap.from(footer, {
    y: 60,
    opacity: 0,
    duration: config.gentle.duration * 0.8,
    ease: config.gentle.ease,
    scrollTrigger: {
      trigger: footer,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });
  
  const contactItems = footer.querySelectorAll('[class*="contact"], .flex:has(svg)');
  if (contactItems.length > 0) {
    gsap.from(contactItems, {
      x: -20,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "gentleFlow",
      scrollTrigger: {
        trigger: footer,
        start: "top 90%"
      }
    });
  }
};

// Optimized Scroll Storytelling
const initScrollStorytelling = () => {
  // Create progress indicator
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, rgba(147, 51, 234, 1), rgba(139, 92, 246, 1));
    z-index: 1000;
    will-change: width;
  `;
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => {
      gsap.set(progressBar, {
        width: `${self.progress * 100}%`
      });
    }
  });
};

// Optimized Impact Stats Animation
export const initStatsAnimations = () => {
  const stats = document.querySelectorAll(".stat-number");
  
  stats.forEach(stat => {
    const statElement = stat as HTMLElement;
    if (!statElement) return;
    
    const finalText = statElement.textContent || "0";
    const numericValue = parseInt(finalText.replace(/\D/g, '')) || 0;
    
    if (numericValue === 0) return;
    
    gsap.set(statElement, { textContent: "0" });
    
    gsap.to(statElement, {
      textContent: numericValue,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: statElement,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      onUpdate: function() {
        const currentValue = Math.round(this.targets()[0].textContent);
        
        // Gentle pulse effect
        if (currentValue % Math.max(1, Math.floor(numericValue / 10)) === 0 && currentValue > 0) {
          gsap.to(statElement, {
            scale: 1.05,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
        }
        
        // Format the number display to match original format
        if (finalText.includes('+')) {
          statElement.textContent = currentValue + '+';
        } else if (finalText.includes('₹')) {
          statElement.textContent = '₹' + currentValue.toLocaleString();
        } else {
          statElement.textContent = currentValue.toString();
        }
      }
    });
  });
};

// Enhanced smooth scroll
export const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: "power2.out"
        });
      }
    });
  });
};

// Mobile optimizations
export const initMobileOptimizations = () => {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Reduce animation complexity for better performance
    gsap.globalTimeline.timeScale(1.2);
    
    // Disable resource-intensive effects
    const memoryParticles = document.querySelectorAll('.memory-particle');
    memoryParticles.forEach(particle => particle.remove());
    
    // Simplify parallax effects
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scrub) {
        trigger.disable();
      }
    });
  }
};

// Optimized loading animation
export const initLoadingAnimation = () => {
  gsap.set("body", { 
    opacity: 0,
    background: "linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(255, 255, 255, 1))"
  });
  
  gsap.to("body", {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  });
};

// Cleanup function for better memory management
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
  
  // Remove created elements
  const particles = document.querySelectorAll('.memory-particle');
  particles.forEach(particle => particle.remove());
  
  const progressBar = document.querySelector('[style*="position: fixed"][style*="top: 0"]');
  if (progressBar) progressBar.remove();
};

// Refresh ScrollTrigger with optimization
export const refreshScrollTrigger = () => {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
};

// Error handling wrapper
export const safeInitAnimations = () => {
  try {
    initAnimations();
  } catch (error) {
    console.error('Animation initialization failed:', error);
    // Fallback to basic functionality
    document.body.classList.remove('loading');
  }
};
