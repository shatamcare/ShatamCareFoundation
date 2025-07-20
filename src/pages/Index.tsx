import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon, Star, Shield, CheckCircle, ArrowRight, Play, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getEvents, getPrograms, type EventForDisplay, type ProgramForDisplay } from '@/lib/supabase-secure';
import { safeInitAnimations, initSmoothScroll, initLoadingAnimation, initMobileOptimizations, refreshScrollTrigger, cleanupAnimations } from '@/utils/animations-simple';
import { getImagePath, getBackgroundImagePath, imagePaths, preloadCriticalImages, preloadNearbyImages, preloadHeroImage, optimizeImageLoading, fallbackImageDataUrl } from '@/utils/imagePaths';
import { throttle } from '@/utils/performance';
import ContactForm from '@/components/ContactForm';
import NewsletterSignup from '@/components/NewsletterSignup';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import BackToTopButton from '@/components/BackToTopButton';
import { enhanceAriaAttributes, announceToScreenReader } from '@/utils/accessibility';
import LoadingSpinner from '@/components/LoadingSpinner';

// Optimized icon mapping for programs (reduced to essential icons)
const ICON_MAP = {
  Heart,
  Users,
  BookOpen,
  Home,
  Award,
  Shield,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  MapPin
} as const;

// Force reload after cleanup
const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [databaseEvents, setDatabaseEvents] = useState<EventForDisplay[]>([]);
  const [databasePrograms, setDatabasePrograms] = useState<ProgramForDisplay[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isProgramsLoading, setIsProgramsLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Manual refresh function to force reload data
  const refreshData = async () => {
    setRefreshCount(prev => prev + 1);
  };

  // Fetch events and programs from database with error boundary and periodic refresh
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setIsEventsLoading(true);
        setIsProgramsLoading(true);
        
        // Fetch both events and programs
        const [events, programs] = await Promise.all([
          getEvents(),
          getPrograms()
        ]);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setDatabaseEvents(events);
          setDatabasePrograms(programs);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
        }
      } finally {
        if (isMounted) {
          setIsEventsLoading(false);
          setIsProgramsLoading(false);
        }
      }
    };

    // Initial fetch with small delay
    const timer = setTimeout(fetchData, 100);
    
    // Set up periodic refresh every 10 seconds to catch admin changes
    const refreshInterval = setInterval(fetchData, 10000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(refreshInterval);
    };
  }, [refreshCount]);
  
  // Section refs
  const heroRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  
  const getIconComponent = useCallback((iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || Heart;
  }, []);
  
  // Process programs from database with fallback images
  const programs = useMemo(() => {
    if (!databasePrograms || databasePrograms.length === 0) {
      return [];
    }
    
    return databasePrograms.map(program => ({
      icon: getIconComponent(program.icon),
      title: program.title,
      description: program.description,
      image: program.image_url ? getImagePath(program.image_url) : getImagePath('images/fallback.svg'),
      cta: program.cta_text,
      impact: program.impact_text,
      details: program.details
    }));
  }, [databasePrograms, getIconComponent]);

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80; // Height of your fixed header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Initialize enhanced emotional animations with error handling
  useEffect(() => {
    let isComponentMounted = true;
    
    const initializeAnimations = async () => {
      try {
        initLoadingAnimation();
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          if (isComponentMounted) {
            safeInitAnimations();
          }
        });
        
        // Break up the animation initialization to prevent blocking
        requestAnimationFrame(() => {
          if (isComponentMounted) {
            initSmoothScroll();
          }
        });
        
        requestAnimationFrame(() => {
          if (isComponentMounted) {
            initMobileOptimizations();
          }
        });
        
        // Delay refresh for better performance
        const refreshTimer = setTimeout(() => {
          if (isComponentMounted) {
            refreshScrollTrigger();
          }
        }, 200);
        
        // Preload critical images for better performance
        preloadCriticalImages();
        
        // Preload hero background image immediately after critical images
        setTimeout(() => {
          if (isComponentMounted) {
            preloadHeroImage();
          }
        }, 100);
        
        // Setup nearby image preloading after initial load
        setTimeout(() => {
          if (isComponentMounted) {
            preloadNearbyImages();
            optimizeImageLoading(); // Clean up unused preloads
          }
        }, 1000);
        
        // Enhance accessibility
        enhanceAriaAttributes();
        
        return () => {
          clearTimeout(refreshTimer);
        };
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    initializeAnimations();
    
    return () => {
      isComponentMounted = false;
      cleanupAnimations();
    };
  }, []);

  // Handle scroll events for header styling with performance optimization
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };

    // Use throttled scroll handler to prevent performance violations
    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);
  
  // Refresh ScrollTrigger when expanded program changes
  useEffect(() => {
    if (expandedProgram !== null) {
      const timer = setTimeout(() => refreshScrollTrigger(), 300);
      announceToScreenReader(`Program details expanded for ${programs[expandedProgram].title}`);
      return () => clearTimeout(timer);
    }
  }, [expandedProgram, programs]);

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, globalThis.Event>, imageSrc: string) => {
    // Only handle the error if we haven't already set a fallback
    if (!e.currentTarget.src.startsWith('data:image/svg+xml')) {
      console.warn(`Failed to load image: ${imageSrc}`);
      
      // Update error state
      setImageErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.add(imageSrc);
        return newErrors;
      });
      
      // Set fallback image using the data URL
      e.currentTarget.src = fallbackImageDataUrl;
      e.currentTarget.onerror = null; // Prevent infinite error loop
    }
  };

  useEffect(() => {
    // Preload critical images to avoid layout shifts
    preloadCriticalImages();
    
    // Log any image errors for debugging
    if (imageErrors.size > 0) {
      console.warn('Images failed to load:', Array.from(imageErrors));
    }
  }, [imageErrors]);

  // Create fallback image component
  const FallbackImage = ({ alt, className }: { alt: string; className?: string }) => (
    <div className={`bg-gradient-to-br from-warm-teal-100 to-warm-teal-200 flex items-center justify-center ${className}`}>
      <Heart className="h-8 w-8 text-warm-teal opacity-50" />
      <span className="sr-only">{alt}</span>
    </div>
  );

  // Enhanced impact stats with better formatting
  const impactStats = [{
    number: "7",
    label: "Cities Reached",
    description: "Expanding across India"
  }, {
    number: "3,600+",
    label: "Therapy Sessions",
    description: "Cognitive stimulation delivered"
  }, {
    number: "1,500+",
    label: "Caregivers Trained",
    description: "Professional certification provided"
  }, {
    number: "800+",
    label: "Families Supported",
    description: "Through our programs"
  }, {
    number: "120+",
    label: "Elderly Served",
    description: "In residential care"
  }];

  // Enhanced donation options with better impact messaging
  const donationOptions = [{
    amount: "₹1,200",
    purpose: "Brain Bridge Therapy Kit",
    impact: "Helps 1 elderly person for 3 months",
    popular: false
  }, {
    amount: "₹2,000",
    purpose: "Support Group Session",
    impact: "Supports 5 families in one session",
    popular: false
  }, {
    amount: "₹15,000",
    purpose: "Complete Caregiver Training",
    impact: "Trains 1 caregiver completely",
    popular: true
  }, {
    amount: "₹50,000",
    purpose: "Dementia Care Home Development",
    impact: "Contributes to facility development",
    popular: false
  }];

  // Events from database with flexible event type mapping
  const getEventType = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('workshop') || titleLower.includes('training')) return 'Workshop';
    if (titleLower.includes('support') || titleLower.includes('group') || titleLower.includes('café')) return 'Support Group';
    if (titleLower.includes('therapy') || titleLower.includes('session')) return 'Therapy';
    if (titleLower.includes('fundraiser') || titleLower.includes('fund')) return 'Fundraiser';
    if (titleLower.includes('seminar') || titleLower.includes('education')) return 'Workshop';
    return 'Event'; // Default fallback
  };
  
  const eventImages = {
    'Workshop': imagePaths.caregivers.training,
    'Support Group': imagePaths.caregivers.sessions,
    'Therapy': imagePaths.users.care,
    'Fundraiser': imagePaths.users.eha1,
    'Event': imagePaths.caregivers.sessions // Default fallback
  };
  
  // Map database events to frontend format
  const allUpcomingEvents = (databaseEvents && databaseEvents.length > 0) 
    ? databaseEvents.map(event => {
        // Determine event type dynamically
        const eventType = getEventType(event.title);
        
        // Priority: 1) Database image_url, 2) Type-based fallback, 3) Default fallback
        const finalImage = event.image_url || eventImages[eventType] || eventImages['Event'];
        
        return {
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          type: eventType,
          description: event.description,
          image: finalImage,
          spots: event.spots
        };
      })
    : []; // Return empty array if no database events

  // Show only first 4 events on homepage
  const upcomingEvents = allUpcomingEvents.slice(0, 4);

  // Enhanced trust indicators
  const trustIndicators = [
    { icon: Shield, text: "80G Tax Benefits", subtext: "Government Approved" },
    { icon: CheckCircle, text: "100% Secure Payments", subtext: "SSL Encrypted" },
    { icon: Award, text: "Transparent Reporting", subtext: "Annual Impact Reports" }
  ];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'Workshop': 'bg-warm-teal text-white',
      'Support Group': 'bg-sage-600 text-white',
      'Therapy': 'bg-blue-600 text-white',
      'Fundraiser': 'bg-sunrise-orange text-white'
    };
    return colorMap[type] || 'bg-gray-600 text-white';
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    handleImageError(e, imagePaths.team.logo);
  };

  return <div className="min-h-screen bg-background">
      {/* Skip to Content Link for Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      {/* Enhanced Header with Sticky Behavior */}
      <header className={`sticky-header ${isHeaderScrolled ? 'scrolled' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {!imageErrors.has(imagePaths.team.logo) ? (
                <img 
                  src={imagePaths.team.logo} 
                  alt="Shatam Care Foundation Logo" 
                  className="h-16 w-auto object-contain transition-all duration-300"
                  onError={handleLogoError}
                  loading="eager"
                />
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-warm-teal to-warm-teal-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              )}
              <div className={imageErrors.has(imagePaths.team.logo) ? 'block' : 'hidden'}>
                <span className="text-xl font-bold text-dark-charcoal font-poppins">Shatam Care Foundation</span>
                <p className="text-sm text-warm-teal-600 font-medium">Because Every Memory Deserves Care</p>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#home" onClick={(e) => handleNavigation(e, 'home')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Home</a>
              <a href="#mission" onClick={(e) => handleNavigation(e, 'mission')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Our Mission</a>
              <a href="#programs" onClick={(e) => handleNavigation(e, 'programs')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Programs</a>
              <a href="#impact" onClick={(e) => handleNavigation(e, 'impact')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Impact</a>
              <a href="#events" onClick={(e) => handleNavigation(e, 'events')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Events</a>
              <Link to="/events" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">All Events</Link>
              <a href="#founder" onClick={(e) => handleNavigation(e, 'founder')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Our Founder</a>
              <a href="#contact" onClick={(e) => handleNavigation(e, 'contact')} className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Get Involved</a>
              <Link to="/admin/login" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Admin</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                className="btn-cta hidden sm:flex"
                onClick={() => scrollToSection('donate')}
              >
                Donate Now
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && <div className="lg:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Home</a>
                <a href="#mission" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Our Mission</a>
                <a href="#programs" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Programs</a>
                <a href="#impact" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Impact</a>
                <a href="#events" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Events</a>
                <Link to="/events" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">All Events</Link>
                <a href="#founder" onClick={(e) => handleNavigation(e, 'founder')} className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Our Founder</a>
                <a href="#contact" onClick={(e) => handleNavigation(e, 'contact')} className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Get Involved</a>
                <Link to="/admin/login" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Admin</Link>
                <div className="px-4 py-3">
                  <Button 
                    className="btn-cta w-full"
                    onClick={() => scrollToSection('donate')}
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </div>}
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <main id="main-content">
      
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center" ref={heroRef}>
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-dark-charcoal/70 to-dark-charcoal/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-image" 
          style={{
            backgroundImage: getBackgroundImagePath('images/Users/care.jpg'),
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>
        <div className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 font-poppins">
                Because Every Memory
                <span className="block text-warm-teal-200">Deserves Care</span>
              </h1>
              <p className="hero-subtitle text-xl lg:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
                Empowering caregivers, supporting elders, and building an inclusive dementia care ecosystem across India with compassion and dignity.
              </p>
              
              {/* Enhanced Social Proof Strip */}
              <div className="hero-social-proof bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
                <p className="text-white/90 text-lg mb-4 font-medium">Trusted by families across India</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-warm-teal-200">1,500+</div>
                    <div className="text-sm text-white/80">Caregivers Trained</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warm-teal-200">800+</div>
                    <div className="text-sm text-white/80">Families Supported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warm-teal-200">3,600+</div>
                    <div className="text-sm text-white/80">Therapy Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warm-teal-200">7</div>
                    <div className="text-sm text-white/80">Cities Reached</div>
                  </div>
                </div>
              </div>
              
              <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="btn-cta text-lg px-12 py-4" 
                  onClick={() => scrollToSection('programs')}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Join Our Support Group
                </Button>
                <Button 
                  size="lg" 
                  className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-dark-charcoal font-semibold px-12 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm" 
                  onClick={() => scrollToSection('donate')}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Support Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Vision • Mission • Values Section */}
      <section id="mission" className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-charcoal mb-6 font-poppins">
              Our Foundation
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Building a compassionate ecosystem where every elderly person receives dignified care and every caregiver is empowered with professional skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-warm-teal-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-warm-teal rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A society where aging with dignity is a reality for every Indian elder.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-sunrise-orange-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sunrise-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Empowering caregivers and creating inclusive dementia care solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-sage-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins">Our Values</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compassion, dignity, transparency, and community-driven impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Programs Section */}
      <section id="programs" className="section-padding bg-gradient-to-b from-light-gray to-off-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-charcoal mb-6 font-poppins">Our Programs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive care solutions designed to empower caregivers and enhance quality of life for those living with dementia
            </p>
          </div>
          
          {isProgramsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-teal mb-4"></div>
              <p className="text-gray-600">Loading programs...</p>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {programs.map((program, index) => (
                <Card key={index} className="program-card bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => handleImageError(e, program.image)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <program.icon className="h-6 w-6 text-warm-teal" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-medium bg-warm-teal/80 px-3 py-1 rounded-full">
                        {program.impact}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins group-hover:text-warm-teal transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    <button 
                      onClick={() => setExpandedProgram(expandedProgram === index ? null : index)} 
                      className="flex items-center text-warm-teal hover:text-warm-teal-600 font-medium transition-colors"
                      aria-expanded={expandedProgram === index}
                      aria-controls={`program-details-${index}`}
                    >
                      Learn More
                      {expandedProgram === index ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </button>
                    {expandedProgram === index && (
                      <div 
                        id={`program-details-${index}`}
                        className="mt-6 p-6 bg-warm-teal rounded-xl animate-accordion-down"
                      >
                        <p className="text-white leading-relaxed mb-4">{program.details}</p>
                        <Button className="btn-cta">
                          {program.cta} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Available</h3>
              <p className="text-gray-500 text-center max-w-md">
                Our programs are being updated. Please check back soon or contact us for more information.
              </p>
            </div>
          )}
          
          {/* Removed "View All Programs" button since all programs are now always shown */}
        </div>
      </section>

      {/* Modern Impact Section */}
      <section id="impact" className="section-padding bg-gradient-to-r from-warm-teal to-warm-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-charcoal/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins text-white">Our Impact Since 2018</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Transforming lives through compassionate care and professional training across India
            </p>
          </div>
          
          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-20">
            {impactStats.map((stat, index) => (
              <Card key={index} className="bg-white/15 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 font-poppins group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-warm-teal-100 mb-1">{stat.label}</div>
                  <div className="text-xs text-white/70">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>      {/* Enhanced Events Section */}
      <section id="events" className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-charcoal mb-6 font-poppins">Join Our Next Events</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dementia care workshops, support groups, and community events designed to empower and connect
            </p>
          </div>
          
          {isEventsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-teal mb-4"></div>
              <p className="text-gray-600">Loading upcoming events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {upcomingEvents.map((event, index) => (
                <Card key={event.id} className="event-card bg-white hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => handleImageError(e, event.image)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-sunrise-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.spots}
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-dark-charcoal mb-4 font-poppins group-hover:text-warm-teal transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 text-warm-teal mr-3 flex-shrink-0" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 text-sunrise-orange mr-3 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 text-sage-600 mr-3 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <EventRegistrationModal
                      eventId={event.id}
                      eventTitle={event.title}
                      eventDate={event.date}
                      eventTime={event.time}
                      eventLocation={event.location}
                      spotsLeft={event.spots}
                    >
                      <Button className="btn-cta w-full">
                        Reserve Your Seat <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </EventRegistrationModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Available</h3>
              <p className="text-gray-500 text-center max-w-md">
                There are currently no upcoming events. Check back soon or contact us for more information about future programs.
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/events">
              <Button className="btn-secondary-cta">
                View All Events <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Donation Section */}
      <section id="donate" className="section-padding bg-gradient-to-br from-warm-teal via-warm-teal-600 to-sunrise-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-charcoal/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins text-white">Transform a Life Today</h2>
            <p className="text-xl opacity-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Choose your impact - every donation directly supports our mission to provide dignified care
            </p>
            
            {/* Enhanced Trust Indicators */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-center space-x-3">
                    <indicator.icon className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">{indicator.text}</div>
                      <div className="text-sm opacity-80">{indicator.subtext}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {donationOptions.map((option, index) => (
                <div key={index} className={`relative ${option.popular ? 'mt-4' : ''}`}>
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-sunrise-orange text-white text-xs px-3 py-1 rounded-full font-medium z-10">
                      Most Popular
                    </div>
                  )}
                  <Card className={`donation-card bg-white text-dark-charcoal hover:shadow-2xl transition-all duration-500 border-0 group h-full ${option.popular ? 'ring-2 ring-sunrise-orange shadow-lg' : ''}`}>
                    <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="pt-2">
                          <div className="text-2xl lg:text-3xl font-bold text-warm-teal mb-2 font-poppins">{option.amount}</div>
                          <div className="text-base font-medium text-gray-700 leading-tight">{option.purpose}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-600 mb-2 font-medium">Impact:</p>
                          <p className="text-sm text-gray-700 leading-snug">{option.impact}</p>
                        </div>
                      </div>
                      <Button className="btn-cta w-full mt-4">
                        Donate Securely <Heart className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-warm-teal hover:bg-gray-100 font-medium px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Users className="mr-2 h-5 w-5" />
                Volunteer with Us
              </Button>
              <Button size="lg" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-warm-teal font-medium px-10 py-4 rounded-full transition-all backdrop-blur-sm">
                <Award className="mr-2 h-5 w-5" />
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Founder Section */}
      <section id="founder" className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Founder Image */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <img 
                  src={imagePaths.team.amrita} 
                  alt="Amrita Patil, Founder" 
                  className="w-64 h-64 lg:w-72 lg:h-72 rounded-2xl object-cover mx-auto lg:mx-0 shadow-xl"
                  loading="lazy"
                  onError={(e) => handleImageError(e, imagePaths.team.amrita)}
                />
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-warm-teal to-sunrise-orange p-3 rounded-xl shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Founder Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-dark-charcoal mb-4 font-poppins">Meet Our Founder</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mb-6"></div>
              </div>
              
              <blockquote className="text-lg lg:text-xl font-medium text-dark-charcoal leading-relaxed italic">
                "Building an ecosystem that empowers caregivers and supports the elderly with dignity and compassion."
              </blockquote>
              
              <div>
                <p className="text-lg text-warm-teal font-semibold">Amrita Patil</p>
                <p className="text-gray-600 font-medium mb-4">Founder & Director</p>
              </div>
              
              <div className="bg-gradient-to-br from-warm-teal-50 to-white p-5 rounded-xl border border-warm-teal-100">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Recognized by The Better India for her dedication to elderly care, Amrita has pioneered sustainable solutions for India's aging population.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-sunrise-orange text-white px-3 py-1 rounded-full text-sm font-medium">Social Impact Leader</span>
                  <span className="bg-warm-teal text-white px-3 py-1 rounded-full text-sm font-medium">Healthcare Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Simplified Footer */}
      <footer className="bg-gradient-to-br from-dark-charcoal to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand and Contact */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {!imageErrors.has(imagePaths.team.logo) ? (
                  <img 
                    src={imagePaths.team.logo} 
                    alt="Shatam Care Foundation Logo" 
                    className="h-10 w-auto object-contain brightness-0 invert"
                    onError={handleLogoError}
                  />
                ) : (
                  <div className="p-2 bg-warm-teal rounded-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">Shatam Care</h3>
                  <p className="text-sm text-warm-teal-300">Foundation</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-warm-teal" />
                  +91 9158566665
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-warm-teal" />
                  shatamcare@gmail.com
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-warm-teal" />
                  Mumbai, India
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#programs" className="text-gray-300 hover:text-warm-teal transition-colors">Our Programs</a></li>
                <li><a href="#impact" className="text-gray-300 hover:text-warm-teal transition-colors">Our Impact</a></li>
                <li><a href="#events" className="text-gray-300 hover:text-warm-teal transition-colors">Events</a></li>
                <li><a href="#donate" className="text-gray-300 hover:text-warm-teal transition-colors">Donate</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-warm-teal transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a 
                  href="https://www.facebook.com/shatamcare" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white/10 hover:bg-warm-teal rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/shatamcare" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white/10 hover:bg-warm-teal rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.061-1.26.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913-.306-.789-.717-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/shatam-care-foundation" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white/10 hover:bg-warm-teal rounded-lg transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <div className="text-sm text-gray-300">
                <p>80G Tax Benefits Available</p>
                <p>Healthcare Innovation Leader</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 Shatam Care Foundation. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-warm-teal transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-warm-teal transition-colors">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-warm-teal transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
      </main>

      {/* Enhanced WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 animate-gentle-float" 
          onClick={() => window.open('https://wa.me/919158566665', '_blank')}
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>;
};

export default React.memo(Index);