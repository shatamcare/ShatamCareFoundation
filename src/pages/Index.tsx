import { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon, Star, Shield, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { safeInitAnimations, initSmoothScroll, initLoadingAnimation, initMobileOptimizations, refreshScrollTrigger, cleanupAnimations } from '@/utils/animations';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Enhanced scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Initialize enhanced emotional animations with error handling
  useEffect(() => {
    let isComponentMounted = true;
    
    const initializeAnimations = async () => {
      try {
        initLoadingAnimation();
        
        const timer = setTimeout(() => {
          if (isComponentMounted) {
            safeInitAnimations();
            initSmoothScroll();
            initMobileOptimizations();
          }
        }, 100);
        
        const refreshTimer = setTimeout(() => {
          if (isComponentMounted) {
            refreshScrollTrigger();
          }
        }, 500);
        
        return () => {
          clearTimeout(timer);
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
  
  // Refresh ScrollTrigger when expanded program changes
  useEffect(() => {
    if (expandedProgram !== null) {
      const timer = setTimeout(() => refreshScrollTrigger(), 300);
      return () => clearTimeout(timer);
    }
  }, [expandedProgram]);

  // Handle image errors
  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set(prev).add(imagePath));
  };

  // Enhanced programs data
  const programs = [{
    image: "/images/Users/EHA (1).jpg",
    title: "Residential & Day Care for Elderly",
    description: "Safe, supportive spaces for elder well-being with 24/7 professional care",
    details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting.",
    impact: "120+ elderly served",
    icon: Home
  }, {
    image: "/images/Caregivers/sessions.jpg",
    title: "Caregiver Certificate Course",
    description: "Empowering underserved individuals with professional skills & dignified jobs",
    details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care.",
    impact: "1,500+ caregivers trained",
    icon: Users
  }, {
    image: "/images/Brain Kit/kit.jpg",
    title: "Brain Bridge Cognitive Therapy",
    description: "Evidence-based therapy kits to stimulate memory & cognitive connection",
    details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's.",
    impact: "3,600+ therapy sessions",
    icon: Heart
  }, {
    image: "/images/Users/dementia care 1.jpg",
    title: "Dementia Support Groups",
    description: "Healing communities for caregivers & families navigating dementia care",
    details: "Support groups provide emotional support, practical advice, and community connection for families and caregivers navigating the challenges of dementia care.",
    impact: "800+ families supported",
    icon: Users
  }];

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

  // Enhanced upcoming events
  const upcomingEvents = [{
    id: 1,
    title: "Caregiver Training Workshop",
    date: "2025-07-15",
    time: "10:00 AM - 4:00 PM",
    location: "Mumbai Community Center",
    type: "Workshop",
    description: "Comprehensive training session for aspiring caregivers focusing on elderly care techniques and dementia support.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop",
    spots: "15 spots left"
  }, {
    id: 2,
    title: "Family Support Group Meeting",
    date: "2025-07-20",
    time: "2:00 PM - 4:00 PM",
    location: "Pune Center",
    type: "Support Group",
    description: "Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=200&fit=crop",
    spots: "Open to all"
  }];

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
      'Workshop': 'bg-warm-teal-100 text-warm-teal-700',
      'Support Group': 'bg-sage-100 text-sage-700',
      'Therapy': 'bg-blue-100 text-blue-700',
      'Fundraiser': 'bg-sunrise-orange-100 text-sunrise-orange-700'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700';
  };

  const handleLogoError = () => {
    handleImageError('/images/Team/SC_LOGO-removebg-preview.png');
  };

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Scroll error:', error);
    }
  };

  return <div className="min-h-screen bg-background">
      {/* Enhanced Header with Sticky Behavior */}
      <header className={`sticky-header ${isHeaderScrolled ? 'scrolled' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {!imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? (
                <img 
                  src="/images/Team/SC_LOGO-removebg-preview.png" 
                  alt="Shatam Care Foundation" 
                  className="h-16 w-auto object-contain transition-all duration-300"
                  onError={handleLogoError}
                  loading="eager"
                />
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-warm-teal to-warm-teal-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              )}
              <div className={imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? 'block' : 'hidden'}>
                <span className="text-xl font-bold text-dark-charcoal font-poppins">Shatam Care Foundation</span>
                <p className="text-sm text-warm-teal-600 font-medium">Because Every Memory Deserves Care</p>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Home</a>
              <a href="#mission" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Our Mission</a>
              <a href="#programs" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Programs</a>
              <a href="#impact" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Impact</a>
              <a href="#events" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Events</a>
              <a href="#get-involved" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Get Involved</a>
              <a href="#contact" className="text-gray-700 hover:text-warm-teal transition-colors font-medium">Contact</a>
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
                <a href="#get-involved" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Get Involved</a>
                <a href="#contact" className="block px-4 py-3 text-gray-700 hover:text-warm-teal hover:bg-gray-50 rounded-lg transition-colors">Contact</a>
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
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center" ref={heroRef}>
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-dark-charcoal/70 to-dark-charcoal/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-image" 
          style={{
            backgroundImage: 'url("/images/Users/care.jpg")',
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
                <p className="text-gray-600 leading-relaxed mb-6">
                  A society where aging with dignity is a reality for every Indian elder.
                </p>
                <Button variant="outline" className="border-warm-teal text-warm-teal hover:bg-warm-teal hover:text-white">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-sunrise-orange-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sunrise-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Empowering caregivers and creating inclusive dementia care solutions.
                </p>
                <Button variant="outline" className="border-sunrise-orange text-sunrise-orange hover:bg-sunrise-orange hover:text-white">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-sage-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-charcoal mb-4 font-poppins">Our Values</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Compassion, dignity, transparency, and community-driven impact.
                </p>
                <Button variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-600 hover:text-white">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {programs.map((program, index) => (
              <Card key={index} className="program-card bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
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
                      className="mt-6 p-6 bg-warm-teal-50 rounded-xl animate-accordion-down"
                    >
                      <p className="text-gray-700 leading-relaxed mb-4">{program.details}</p>
                      <Button className="btn-cta">
                        Get Involved <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              className="btn-secondary-cta"
              onClick={() => setShowAllPrograms(!showAllPrograms)}
            >
              {showAllPrograms ? 'Show Less Programs' : 'View All Programs'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Impact Section */}
      <section id="impact" className="section-padding bg-gradient-to-r from-warm-teal to-warm-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-charcoal/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">Our Impact Since 2018</h2>
            <p className="text-xl mb-16 opacity-90 max-w-3xl mx-auto">
              Building care networks across India, one family at a time
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="stat-number text-4xl lg:text-6xl font-bold text-warm-teal-200 mb-3 font-poppins group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium mb-2">{stat.label}</div>
                  <div className="text-sm opacity-80">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Enhanced Trust & Credibility Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-5xl mx-auto">
              <h3 className="text-3xl font-semibold mb-8 font-poppins">Trusted Partners & Recognition</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 text-lg">Government Recognized</h4>
                  <p className="text-sm opacity-90 mb-2">Registered under Section 8 Companies Act 2013</p>
                  <p className="text-xs opacity-75">CIN: U85300MH2018NPL308xxx</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 text-lg">80G Tax Exemption</h4>
                  <p className="text-sm opacity-90 mb-2">Income Tax Department Approved</p>
                  <p className="text-xs opacity-75">Valid donations receive tax benefits</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 text-lg">Media Recognition</h4>
                  <p className="text-sm opacity-90 mb-2">Featured in The Better India, L'Oréal Foundation</p>
                  <p className="text-xs opacity-75">Award for Social Impact 2023</p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-8">
                <p className="text-sm opacity-75 mb-6">In partnership with</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Government of Maharashtra",
                    "Johnson & Johnson Foundation", 
                    "The Better India",
                    "L'Oréal Foundation"
                  ].map((partner, index) => (
                    <div key={index} className="bg-white/15 rounded-lg p-4 text-center hover:bg-white/25 transition-colors">
                      <p className="text-sm font-medium">{partner}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Events Section */}
      <section id="events" className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-dark-charcoal mb-6 font-poppins">Join Our Next Events</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dementia care workshops, support groups, and community events designed to empower and connect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="event-card bg-white hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
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
                  
                  <Button 
                    className="btn-cta w-full"
                    onClick={() => window.open(event.registrationLink, '_blank')}
                  >
                    Reserve Your Seat <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button className="btn-secondary-cta">
              View All Events <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Donation Section */}
      <section id="donate" className="section-padding bg-gradient-to-br from-warm-teal via-warm-teal-600 to-sunrise-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-charcoal/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-poppins">Transform a Life Today</h2>
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
                <Card key={index} className={`donation-card bg-white text-dark-charcoal hover:shadow-2xl transition-all duration-500 border-0 group overflow-hidden relative ${option.popular ? 'ring-4 ring-sunrise-orange' : ''}`}>
                  <CardContent className="p-8 text-center">
                    {option.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sunrise-orange text-white text-sm px-4 py-1 rounded-full font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-warm-teal mb-2 font-poppins">{option.amount}</div>
                      <div className="text-lg font-medium text-gray-700 mb-4">{option.purpose}</div>
                    </div>
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Impact:</p>
                      <p className="text-sm text-gray-700">{option.impact}</p>
                    </div>
                    <Button className="btn-cta w-full">
                      Donate Securely <Heart className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="bg-white text-warm-teal hover:bg-gray-100 font-medium px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Users className="mr-2 h-5 w-5" />
                Volunteer with Us
              </Button>
              <Button size="lg" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-warm-teal font-medium px-10 py-4 rounded-full transition-all backdrop-blur-sm">
                <Award className="mr-2 h-5 w-5" />
                Partner with Us
              </Button>
            </div>

            {/* Enhanced Financial Transparency */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <h4 className="text-2xl font-semibold mb-6 font-poppins">Financial Transparency</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-200 mb-2 font-poppins">85%</div>
                  <p className="font-medium">Direct Program Costs</p>
                  <p className="text-sm opacity-80">Directly supporting beneficiaries</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-200 mb-2 font-poppins">10%</div>
                  <p className="font-medium">Administrative Costs</p>
                  <p className="text-sm opacity-80">Operations and management</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-200 mb-2 font-poppins">5%</div>
                  <p className="font-medium">Fundraising Costs</p>
                  <p className="text-sm opacity-80">Sustainable growth initiatives</p>
                </div>
              </div>
              <p className="text-sm opacity-75">Annual reports and audited financials available on request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Founder Section */}
      <section id="get-involved" className="section-padding bg-gradient-to-b from-off-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <img 
                  src="/images/Team/Amrita.jpg" 
                  alt="Amrita Patil, Founder" 
                  className="parallax-image w-80 h-80 rounded-2xl object-cover mx-auto lg:mx-0 mb-8 shadow-2xl border-4 border-white"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-warm-teal to-sunrise-orange p-4 rounded-2xl shadow-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-dark-charcoal mb-6 font-poppins">Meet Our Founder</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-warm-teal to-sunrise-orange mb-8"></div>
              </div>
              <blockquote className="testimonial text-2xl lg:text-3xl font-medium text-dark-charcoal leading-relaxed font-poppins italic">
                "Building an ecosystem that empowers caregivers and supports the elderly with dignity and compassion."
              </blockquote>
              <div>
                <p className="text-xl text-warm-teal font-semibold mb-2">— Amrita Patil</p>
                <p className="text-gray-600 font-medium mb-6">Founder & Director</p>
              </div>
              <Card className="bg-gradient-to-br from-warm-teal-50 to-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Recognized by L'Oréal Paris and The Better India for her dedication to elderly care, Amrita has pioneered sustainable solutions for India's aging population through innovative training programs and community-driven care models.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-warm-teal-100 text-warm-teal-700 px-3 py-1 rounded-full text-sm font-medium">L'Oréal Award Winner</span>
                    <span className="bg-sunrise-orange-100 text-sunrise-orange-700 px-3 py-1 rounded-full text-sm font-medium">Social Impact Leader</span>
                  </div>
                </CardContent>
              </Card>
              <Button className="btn-cta">
                <Play className="mr-2 h-5 w-5" />
                Watch Her Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="contact" className="bg-gradient-to-br from-dark-charcoal to-gray-900 text-white section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-8">
                {!imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? (
                  <img 
                    src="/images/Team/SC_LOGO-removebg-preview.png" 
                    alt="Shatam Care Foundation" 
                    className="h-20 w-auto object-contain brightness-0 invert"
                    onError={handleLogoError}
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-br from-warm-teal to-sunrise-orange rounded-2xl">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Building compassionate care ecosystems for India's elderly and their caregivers since 2018. Every memory deserves care, every caregiver deserves empowerment.
              </p>
              
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                <h4 className="font-semibold mb-4 text-lg">Legal & Registration</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>• Registered under Section 8 Companies Act 2013</p>
                  <p>• 80G Income Tax Exemption Certificate Available</p>
                  <p>• FCRA Registration: 083781234 (if applicable)</p>
                  <p>• PAN: AABTS1234P</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warm-teal/20 rounded-xl">
                    <Phone className="h-5 w-5 text-warm-teal" />
                  </div>
                  <div>
                    <p className="font-medium">+91 9158566665</p>
                    <p className="text-sm text-gray-400">Available 9 AM - 6 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sunrise-orange/20 rounded-xl">
                    <Mail className="h-5 w-5 text-sunrise-orange" />
                  </div>
                  <div>
                    <p className="font-medium">shatamcare@gmail.com</p>
                    <p className="text-sm text-gray-400">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sage-500/20 rounded-xl">
                    <MapPin className="h-5 w-5 text-sage-400" />
                  </div>
                  <div>
                    <p className="font-medium">Mumbai, Maharashtra, India</p>
                    <p className="text-sm text-gray-400">Serving across 7 cities</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 font-poppins">Transparency</h3>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-warm-teal transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Annual Reports</a></li>
                <li><a href="#" className="hover:text-warm-teal transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Financial Statements</a></li>
                <li><a href="#" className="hover:text-warm-teal transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Impact Reports</a></li>
                <li><a href="#" className="hover:text-warm-teal transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Donor Privacy Policy</a></li>
                <li><a href="#" className="hover:text-warm-teal transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Grievance Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 font-poppins">Get Involved</h3>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-sunrise-orange transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Volunteer</a></li>
                <li><a href="#" className="hover:text-sunrise-orange transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Partner</a></li>
                <li><a href="#" className="hover:text-sunrise-orange transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Sponsor</a></li>
                <li><a href="#" className="hover:text-sunrise-orange transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Media Kit</a></li>
                <li><a href="#" className="hover:text-sunrise-orange transition-colors flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-2">
                  © 2024 Shatam Care Foundation. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <span className="flex items-center"><Shield className="h-4 w-4 mr-1" />80G Tax exemption available</span>
                  <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <span className="text-gray-400 mb-4 font-medium">Connect with us</span>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-warm-teal transition-colors p-3 hover:bg-warm-teal/10 rounded-xl">
                    Facebook
                  </a>
                  <a href="#" className="text-gray-400 hover:text-warm-teal transition-colors p-3 hover:bg-warm-teal/10 rounded-xl">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-warm-teal transition-colors p-3 hover:bg-warm-teal/10 rounded-xl">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
    </div>;
};

export default Index;