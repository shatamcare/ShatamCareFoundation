
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register only essential plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Performance configuration
const ANIMATION_CONFIG = {
  duration: 0.6,
  ease: "power2.out",
  stagger: 0.1,
  mobile: window.innerWidth < 768
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation manager class for better performance
class AnimationManager {
  private timelines: gsap.core.Timeline[] = [];
  private scrollTriggers: ScrollTrigger[] = [];
  
  constructor() {
    this.setupPerformanceOptimizations();
  }

  private setupPerformanceOptimizations() {
    // Set GSAP to use transforms for better performance
    gsap.set("*", { force3D: true });
    
    // Optimize ScrollTrigger refresh rate
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
  }

  // Optimized hero animation
  initHeroAnimation() {
    if (prefersReducedMotion) return;
    
    const heroTitle = document.querySelector(".hero-title");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroButtons = document.querySelectorAll(".hero-buttons .btn");
    
    if (!heroTitle) return;

    const tl = gsap.timeline();
    this.timelines.push(tl);
    
    tl.from(heroTitle, {
      y: 60,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease
    })
    .from(heroSubtitle, {
      y: 30,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease
    }, "-=0.4")
    .from(heroButtons, {
      y: 20,
      opacity: 0,
      duration: ANIMATION_CONFIG.duration,
      stagger: ANIMATION_CONFIG.stagger,
      ease: ANIMATION_CONFIG.ease
    }, "-=0.3");
  }

  // Optimized scroll animations
  initScrollAnimations() {
    if (prefersReducedMotion) return;
    
    const sections = document.querySelectorAll("section:not(#home)");
    
    sections.forEach((section, index) => {
      const elements = section.querySelectorAll("h2, h3, p, .card");
      if (!elements.length) return;
      
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.from(elements, {
            y: 30,
            opacity: 0,
            duration: ANIMATION_CONFIG.duration,
            stagger: ANIMATION_CONFIG.stagger,
            ease: ANIMATION_CONFIG.ease
          });
        }
      });
      
      this.scrollTriggers.push(trigger);
    });
  }

  // Optimized card hover effects
  initCardAnimations() {
    const cards = document.querySelectorAll(".program-card, .donation-card, .event-card");
    
    cards.forEach(card => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.02,
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  // Optimized stats animation with intersection observer
  initStatsAnimation() {
    const stats = document.querySelectorAll(".stat-number");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target as HTMLElement;
          const finalText = stat.textContent || "0";
          const numericValue = parseInt(finalText.replace(/\D/g, '')) || 0;
          
          gsap.from({ value: 0 }, {
            value: numericValue,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function() {
              const currentValue = Math.round(this.targets()[0].value);
              if (finalText.includes('+')) {
                stat.textContent = currentValue + '+';
              } else if (finalText.includes('₹')) {
                stat.textContent = '₹' + currentValue.toLocaleString();
              } else {
                stat.textContent = currentValue.toString();
              }
            }
          });
          
          observer.unobserve(stat);
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
  }

  // Cleanup method for better memory management
  cleanup() {
    this.timelines.forEach(tl => tl.kill());
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.timelines = [];
    this.scrollTriggers = [];
  }

  // Initialize all optimized animations
  init() {
    try {
      this.initHeroAnimation();
      this.initScrollAnimations();
      this.initCardAnimations();
      this.initStatsAnimation();
      
      // Mobile optimizations
      if (ANIMATION_CONFIG.mobile) {
        gsap.globalTimeline.timeScale(1.5);
      }
    } catch (error) {
      console.error('Animation initialization failed:', error);
    }
  }
}

// Export the animation manager
export const animationManager = new AnimationManager();

// Main initialization function
export const initOptimizedAnimations = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => animationManager.init());
  } else {
    animationManager.init();
  }
};

// Cleanup function for component unmounting
export const cleanupAnimations = () => {
  animationManager.cleanup();
};

// Refresh function for dynamic content
export const refreshAnimations = () => {
  ScrollTrigger.refresh();
};
