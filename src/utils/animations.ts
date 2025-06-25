
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

// Initialize all enhanced animations
export const initAnimations = () => {
  // Set initial loading state
  document.body.classList.add('loading');
  
  // Initialize sophisticated animations
  initMemoryGlowEffect();
  initFloatingHeroAnimation();
  initSoftSectionTransitions();
  initCareCardAnimations();
  initTestimonialEmotions();
  initDonationHeartbeat();
  initBackgroundMagic();
  initFooterGentleness();
  initScrollStorytelling();
  
  // Remove loading state after animations are ready
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 500);
};

// Memory Glow Effect for Hero Background
const initMemoryGlowEffect = () => {
  const heroOverlay = document.querySelector('.hero-overlay');
  if (!heroOverlay) return;

  // Create gentle pulsing memory glow
  gsap.to(heroOverlay, {
    background: "linear-gradient(45deg, rgba(147, 51, 234, 0.7), rgba(139, 92, 246, 0.5), rgba(167, 139, 250, 0.6))",
    duration: 4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  // Add floating light particles effect
  createFloatingMemories();
};

// Floating memories particles
const createFloatingMemories = () => {
  const hero = document.querySelector('#home');
  if (!hero) return;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'memory-particle';
    particle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 15;
    `;
    hero.appendChild(particle);

    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    });

    gsap.to(particle, {
      y: "-=100",
      x: "+=50",
      opacity: 0.1,
      duration: 8 + Math.random() * 4,
      ease: "none",
      repeat: -1,
      delay: Math.random() * 4
    });
  }
};

// Enhanced Hero Animation with Emotional Intelligence
const initFloatingHeroAnimation = () => {
  const tl = gsap.timeline();
  
  // Memory-inspired text reveal
  tl.from(".hero-title", {
    y: 120,
    opacity: 0,
    duration: config.emotional.duration,
    ease: config.emotional.ease,
    transformOrigin: "center bottom"
  })
  
  // Gentle subtitle flow
  .from(".hero-subtitle", {
    y: 60,
    opacity: 0,
    duration: config.gentle.duration,
    ease: config.gentle.ease
  }, "-=1.5")
  
  // Floating button animation
  .from(".hero-buttons .btn", {
    y: 40,
    opacity: 0,
    scale: 0.9,
    duration: config.primary.duration,
    stagger: config.primary.stagger,
    ease: config.primary.ease
  }, "-=1.2");

  // Add continuous floating motion to buttons
  gsap.to(".hero-buttons .btn", {
    y: -8,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2
  });
};

// Soft Section Transitions with Emotional Flow
const initSoftSectionTransitions = () => {
  const sections = gsap.utils.toArray("section");
  
  sections.forEach((section, index) => {
    const elements = section.querySelectorAll("h2, h3, p, .card, img");
    
    gsap.from(elements, {
      y: 80,
      opacity: 0,
      duration: config.gentle.duration,
      stagger: config.gentle.stagger,
      ease: config.gentle.ease,
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });

    // Add section background color transitions
    if (index % 2 === 0) {
      gsap.to(section, {
        background: "linear-gradient(135deg, rgba(147, 51, 234, 0.02), rgba(255, 255, 255, 1))",
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1
        }
      });
    }
  });
};

// Care Cards with Healing Energy
const initCareCardAnimations = () => {
  const cards = document.querySelectorAll(".program-card, .donation-card, .event-card");
  
  cards.forEach((card, index) => {
    // Healing glow on hover
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.05,
        y: -12,
        boxShadow: "0 25px 50px rgba(147, 51, 234, 0.15)",
        duration: 0.6,
        ease: "heartbeat"
      });
      
      // Inner glow effect
      gsap.to(card, {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(147, 51, 234, 0.05))",
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "rgba(255, 255, 255, 0.95)",
        duration: 0.6,
        ease: "power2.out"
      });
    });
    
    // Scroll reveal with memory-like delay
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: config.gentle.duration,
      ease: config.gentle.ease,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });
};

// Testimonial Emotions with Heart
const initTestimonialEmotions = () => {
  const testimonials = document.querySelectorAll('.testimonial, blockquote');
  
  testimonials.forEach(testimonial => {
    // Create quote mark animation
    const quoteMark = document.createElement('div');
    quoteMark.innerHTML = '"';
    quoteMark.style.cssText = `
      font-size: 120px;
      color: rgba(147, 51, 234, 0.1);
      position: absolute;
      top: -20px;
      left: -10px;
      font-family: serif;
      pointer-events: none;
    `;
    testimonial.style.position = 'relative';
    testimonial.appendChild(quoteMark);
    
    gsap.from(quoteMark, {
      scale: 0,
      rotation: -45,
      opacity: 0,
      duration: 1.5,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: testimonial,
        start: "top 85%"
      }
    });
    
    // Emotional text reveal
    gsap.from(testimonial, {
      opacity: 0,
      y: 40,
      duration: config.emotional.duration,
      ease: config.emotional.ease,
      scrollTrigger: {
        trigger: testimonial,
        start: "top 85%"
      }
    });
  });
};

// Donation Section Heartbeat
const initDonationHeartbeat = () => {
  const donateButtons = document.querySelectorAll('.cta-button, [class*="donate"]');
  
  donateButtons.forEach(button => {
    // Gentle heartbeat pulse
    gsap.to(button, {
      scale: 1.03,
      duration: 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Healing glow ring
    const glowRing = document.createElement('div');
    glowRing.style.cssText = `
      position: absolute;
      inset: -4px;
      border-radius: inherit;
      background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(139, 92, 246, 0.2));
      z-index: -1;
      opacity: 0;
      pointer-events: none;
    `;
    button.style.position = 'relative';
    button.appendChild(glowRing);
    
    button.addEventListener('mouseenter', () => {
      gsap.to(glowRing, {
        opacity: 1,
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out"
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(glowRing, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  });
};

// Background Magic - Subtle Memory Waves
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
    background: radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.02) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  `;
  body.appendChild(waveOverlay);
  
  // Gentle wave motion
  gsap.to(waveOverlay, {
    background: "radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.03) 0%, transparent 70%)",
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
};

// Enhanced Footer Gentleness
const initFooterGentleness = () => {
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Gentle reveal from bottom
  gsap.from(footer, {
    y: 100,
    opacity: 0,
    duration: config.gentle.duration,
    ease: config.gentle.ease,
    scrollTrigger: {
      trigger: footer,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });
  
  // Animate contact info with care
  const contactItems = footer.querySelectorAll('[class*="contact"], .flex:has(svg)');
  gsap.from(contactItems, {
    x: -30,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "gentleFlow",
    scrollTrigger: {
      trigger: footer,
      start: "top 90%"
    }
  });
};

// Scroll-based Storytelling
const initScrollStorytelling = () => {
  // Create progress indicator
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, rgba(147, 51, 234, 1), rgba(139, 92, 246, 1));
    z-index: 1000;
    transition: width 0.3s ease;
  `;
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => {
      gsap.to(progressBar, {
        width: `${self.progress * 100}%`,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
  
  // Section-based color transitions
  const sections = gsap.utils.toArray("section");
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        const colors = [
          "linear-gradient(90deg, rgba(147, 51, 234, 1), rgba(139, 92, 246, 1))",
          "linear-gradient(90deg, rgba(139, 92, 246, 1), rgba(167, 139, 250, 1))",
          "linear-gradient(90deg, rgba(167, 139, 250, 1), rgba(196, 181, 253, 1))"
        ];
        gsap.to(progressBar, {
          background: colors[index % colors.length],
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });
  });
};

// Impact Stats with Emotional Counter
export const initStatsAnimations = () => {
  const stats = document.querySelectorAll(".stat-number");
  
  stats.forEach(stat => {
    const finalNumber = stat.textContent || "0";
    const numericValue = parseInt(finalNumber.replace(/\D/g, '')) || 0;
    
    // Create heartbeat effect during counting
    gsap.set(stat, { scale: 1 });
    
    gsap.from(stat, {
      textContent: 0,
      duration: 3,
      ease: "gentleFlow",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      onUpdate: function() {
        const currentValue = Math.round(this.targets()[0].textContent);
        
        // Gentle pulse during counting
        if (currentValue % 100 === 0 && currentValue > 0) {
          gsap.to(stat, {
            scale: 1.1,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
        }
        
        // Format the number display
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

// Enhanced smooth scroll with emotional intelligence
export const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href') || '');
      if (target) {
        gsap.to(window, {
          duration: 2,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: "gentleFlow"
        });
      }
    });
  });
};

// Mobile optimizations for emotional animations
export const initMobileOptimizations = () => {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Reduce animation complexity for better performance
    gsap.globalTimeline.timeScale(1.3);
    
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

// Loading animation with memory theme
export const initLoadingAnimation = () => {
  const tl = gsap.timeline();
  
  // Create memory-inspired loading
  gsap.set("body", { 
    opacity: 0,
    background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(255, 255, 255, 1))"
  });
  
  tl.to("body", {
    opacity: 1,
    duration: 1.5,
    ease: "gentleFlow"
  })
  .to("body", {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))",
    duration: 1,
    ease: "power2.out"
  }, "-=0.8");
};

// Refresh ScrollTrigger with care
export const refreshScrollTrigger = () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
};
