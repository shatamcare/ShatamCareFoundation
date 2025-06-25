
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Animation configuration
const config = {
  ease: "power2.out",
  duration: 0.6,
  stagger: 0.1,
  mobile: window.innerWidth < 768
};

// Initialize all animations
export const initAnimations = () => {
  // Hero section animations
  initHeroAnimations();
  
  // Navigation animations
  initNavAnimations();
  
  // Section reveal animations
  initSectionAnimations();
  
  // Card animations
  initCardAnimations();
  
  // Impact stats animations
  initStatsAnimations();
  
  // Footer animations
  initFooterAnimations();
  
  // Button hover animations
  initButtonAnimations();
  
  // Image parallax animations
  initParallaxAnimations();
};

// Hero section animations
const initHeroAnimations = () => {
  const tl = gsap.timeline();
  
  // Animate hero background overlay
  tl.from(".hero-overlay", {
    opacity: 0,
    duration: 1,
    ease: "power2.inOut"
  })
  
  // Animate hero title with split text effect
  .from(".hero-title", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  }, "-=0.5")
  
  // Animate hero subtitle
  .from(".hero-subtitle", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.8")
  
  // Animate hero buttons
  .from(".hero-buttons .btn", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.7)"
  }, "-=0.4");
};

// Navigation animations
const initNavAnimations = () => {
  // Animate navigation on load
  gsap.from("header", {
    y: -100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.2
  });
  
  // Navigation items hover effect
  const navItems = document.querySelectorAll("nav a");
  navItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
};

// Section reveal animations
const initSectionAnimations = () => {
  // Animate sections on scroll
  gsap.utils.toArray("section").forEach((section: any) => {
    gsap.from(section.children, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });
  });
  
  // Animate headings with special effect
  gsap.utils.toArray("h1, h2, h3").forEach((heading: any) => {
    gsap.from(heading, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Card animations
const initCardAnimations = () => {
  // Program cards hover animation
  const cards = document.querySelectorAll(".program-card, .donation-card, .event-card");
  
  cards.forEach(card => {
    // Initial state
    gsap.set(card, { transformOrigin: "center center" });
    
    // Hover animations
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.03,
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    // Scroll reveal animation
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Impact stats counter animation
const initStatsAnimations = () => {
  const stats = document.querySelectorAll(".stat-number");
  
  stats.forEach(stat => {
    const finalNumber = stat.textContent || "0";
    const numericValue = parseInt(finalNumber.replace(/\D/g, '')) || 0;
    
    gsap.from(stat, {
      textContent: 0,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      onUpdate: function() {
        const currentValue = Math.round(this.targets()[0].textContent);
        if (finalNumber.includes('+')) {
          stat.textContent = currentValue + '+';
        } else if (finalNumber.includes('₹')) {
          stat.textContent = '₹' + currentValue.toLocaleString();
        } else {
          stat.textContent = currentValue.toString();
        }
      }
    });
  });
};

// Footer animations
const initFooterAnimations = () => {
  gsap.from("footer", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "footer",
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });
};

// Button animations
const initButtonAnimations = () => {
  const buttons = document.querySelectorAll("button, .btn");
  
  buttons.forEach(button => {
    // Pulse effect for CTA buttons
    if (button.classList.contains('cta-button')) {
      gsap.to(button, {
        scale: 1.02,
        duration: 1.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });
    }
    
    // Hover effects
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });
    
    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    // Click effect
    button.addEventListener("click", () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    });
  });
};

// Parallax animations for images
const initParallaxAnimations = () => {
  const images = document.querySelectorAll(".parallax-image");
  
  images.forEach(image => {
    gsap.to(image, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });
};

// Smooth scroll implementation
export const initSmoothScroll = () => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href') || '');
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: target,
          ease: "power2.inOut"
        });
      }
    });
  });
};

// Loading animation
export const initLoadingAnimation = () => {
  const tl = gsap.timeline();
  
  // Hide page initially
  gsap.set("body", { opacity: 0 });
  
  // Fade in page
  tl.to("body", {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  });
};

// Utility function to refresh ScrollTrigger
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// Mobile optimizations
export const initMobileOptimizations = () => {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Reduce animation complexity on mobile
    gsap.globalTimeline.timeScale(1.5);
    
    // Disable parallax on mobile for performance
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scrub) {
        trigger.disable();
      }
    });
  }
};
