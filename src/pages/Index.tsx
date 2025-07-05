import { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon, Star, Shield, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { safeInitAnimations, initSmoothScroll, initLoadingAnimation, initMobileOptimizations, refreshScrollTrigger, cleanupAnimations } from '@/utils/animations';
import { getImagePath, getBackgroundImagePath, imagePaths } from '@/utils/imagePaths';

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
    image: imagePaths.users.eha1,
    title: "Residential & Day Care for Elderly",
    description: "Safe, supportive spaces for elder well-being with 24/7 professional care",
    details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting.",
    impact: "120+ elderly served",
    icon: Home
  }, {
    image: imagePaths.caregivers.sessions,
    title: "Caregiver Certificate Course",
    description: "Empowering underserved individuals with professional skills & dignified jobs",
    details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care.",
    impact: "1,500+ caregivers trained",
    icon: Users
  }, {
    image: imagePaths.brainKit.kit,
    title: "Brain Bridge Cognitive Therapy",
    description: "Evidence-based therapy kits to stimulate memory & cognitive connection",
    details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's.",
    impact: "3,600+ therapy sessions",
    icon: Heart
  }, {
    image: imagePaths.users.dementiaCare1,
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
    registrationLink: "mailto:shatamcare@gmail.com?subject=Caregiver Training Workshop Registration&body=I would like to register for the Caregiver Training Workshop on July 15, 2025 in Mumbai.",
    image: imagePaths.caregivers.training,
    spots: "15 spots left"
  }, {
    id: 2,
    title: "Family Support Group Meeting",
    date: "2025-07-20",
    time: "2:00 PM - 4:00 PM",
    location: "Pune Center",
    type: "Support Group",
    description: "Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.",
    registrationLink: "mailto:shatamcare@gmail.com?subject=Family Support Group Registration&body=I would like to join the Family Support Group meeting on July 20, 2025 in Pune.",
    image: imagePaths.caregivers.sessions,
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
      'Workshop': 'bg-warm-teal text-white',
      'Support Group': 'bg-sage-600 text-white',
      'Therapy': 'bg-blue-600 text-white',
      'Fundraiser': 'bg-sunrise-orange text-white'
    };
    return colorMap[type] || 'bg-gray-600 text-white';
  };

  const handleLogoError = () => {
    handleImageError(imagePaths.team.logo);
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
              <div className={imageErrors.has(imagePaths.team.logo) ? 'block' : 'hidden'}>
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
      <main id="main-content">
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center" ref={heroRef}>
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-dark-charcoal/70 to-dark-charcoal/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-image" 
          style={{
            backgroundImage: getBackgroundImagePath('/images/Users/care.jpg'),
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
                      className="mt-6 p-6 bg-warm-teal rounded-xl animate-accordion-down"
                    >
                      <p className="text-white leading-relaxed mb-4">{program.details}</p>
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

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Recognition Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-white">Recognition & Trust</h3>
              
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-colors">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">Government Recognized</h4>
                      <p className="text-xs text-white/80">Section 8 Company Registration</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-colors">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">80G Tax Benefits</h4>
                      <p className="text-xs text-white/80">Income Tax Approved Donations</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-colors">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">Media Recognition</h4>
                      <p className="text-xs text-white/80">Featured by The Better India</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Key Partners */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-6 text-white">Key Partners</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: "L'Oréal Foundation", type: "Award Partner", icon: Award },
                  { name: "Johnson & Johnson", type: "Healthcare Partner", icon: Heart },
                  { name: "Government of Maharashtra", type: "Policy Partner", icon: Shield },
                  { name: "The Better India", type: "Media Partner", icon: Star }
                ].map((partner, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-colors">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="bg-sunrise-orange/30 rounded-lg p-2 flex-shrink-0">
                        <partner.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{partner.name}</h4>
                        <p className="text-xs text-white/70">{partner.type}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
              <h4 className="text-2xl font-semibold mb-6 font-poppins text-white">Financial Transparency</h4>
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
                  src={imagePaths.team.amrita} 
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
                    <span className="bg-warm-teal text-white px-3 py-1 rounded-full text-sm font-medium">L'Oréal Award Winner</span>
                    <span className="bg-sunrise-orange text-white px-3 py-1 rounded-full text-sm font-medium">Social Impact Leader</span>
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

      {/* Modern Clean Footer */}
      <footer id="contact" className="bg-dark-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Content */}
          <div className="py-16 border-b border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  {!imageErrors.has(imagePaths.team.logo) ? (
                    <img 
                      src={imagePaths.team.logo} 
                      alt="Shatam Care Foundation" 
                      className="h-12 w-auto object-contain brightness-0 invert"
                      onError={handleLogoError}
                    />
                  ) : (
                    <div className="p-2 bg-gradient-to-br from-warm-teal to-sunrise-orange rounded-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white font-poppins">Shatam Care</h3>
                    <p className="text-xs text-warm-teal-200">Every Memory Deserves Care</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                  Empowering caregivers and creating dignified care solutions for India's elderly since 2018.
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-warm-teal">1,500+</div>
                    <div className="text-xs text-gray-400">Caregivers Trained</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-sunrise-orange">800+</div>
                    <div className="text-xs text-gray-400">Families Helped</div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Navigate</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#mission" className="text-gray-400 hover:text-warm-teal transition-colors">Our Mission</a></li>
                      <li><a href="#programs" className="text-gray-400 hover:text-warm-teal transition-colors">Programs</a></li>
                      <li><a href="#impact" className="text-gray-400 hover:text-warm-teal transition-colors">Impact</a></li>
                      <li><a href="#events" className="text-gray-400 hover:text-warm-teal transition-colors">Events</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Support</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#donate" className="text-gray-400 hover:text-sunrise-orange transition-colors">Donate</a></li>
                      <li><a href="mailto:shatamcare@gmail.com?subject=Volunteer Interest" className="text-gray-400 hover:text-sunrise-orange transition-colors">Volunteer</a></li>
                      <li><a href="mailto:shatamcare@gmail.com?subject=Partnership Inquiry" className="text-gray-400 hover:text-sunrise-orange transition-colors">Partner</a></li>
                      <li><a href="mailto:shatamcare@gmail.com?subject=Sponsorship Opportunity" className="text-gray-400 hover:text-sunrise-orange transition-colors">Sponsor</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact & Legal */}
              <div className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Get in Touch</h4>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-warm-teal/20 rounded">
                      <Phone className="h-3 w-3 text-warm-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">+91 9158566665</p>
                      <p className="text-xs text-gray-400">Mon-Sat, 9 AM - 6 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-sunrise-orange/20 rounded">
                      <Mail className="h-3 w-3 text-sunrise-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">shatamcare@gmail.com</p>
                      <p className="text-xs text-gray-400">Response in 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-800/30 rounded-lg p-3 mb-6">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3 w-3 text-warm-teal" />
                      <span className="text-gray-300">80G Tax Exemption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-3 w-3 text-sunrise-orange" />
                      <span className="text-gray-300">Section 8 Registered</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3">
                  <a href="https://www.facebook.com/shatamcare" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800/50 hover:bg-warm-teal/20 rounded transition-all duration-200">
                    <span className="sr-only">Facebook</span>
                    <div className="h-4 w-4 bg-gray-400 hover:bg-warm-teal transition-colors rounded-sm"></div>
                  </a>
                  <a href="https://www.instagram.com/shatamcare" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800/50 hover:bg-sunrise-orange/20 rounded transition-all duration-200">
                    <span className="sr-only">Instagram</span>
                    <div className="h-4 w-4 bg-gray-400 hover:bg-sunrise-orange transition-colors rounded-sm"></div>
                  </a>
                  <a href="https://www.linkedin.com/company/shatam-care-foundation" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800/50 hover:bg-warm-teal/20 rounded transition-all duration-200">
                    <span className="sr-only">LinkedIn</span>
                    <div className="h-4 w-4 bg-gray-400 hover:bg-warm-teal transition-colors rounded-sm"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400">
                  © 2024 Shatam Care Foundation. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CIN: U85300MH2018NPL308xxx
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-xs">
                <a href="mailto:shatamcare@gmail.com?subject=Privacy Policy Request" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
                <a href="mailto:shatamcare@gmail.com?subject=Terms of Service Request" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
                <a href="mailto:shatamcare@gmail.com?subject=Annual Report Request" className="text-gray-500 hover:text-gray-300 transition-colors">Reports</a>
                <a href="#contact" className="text-gray-500 hover:text-gray-300 transition-colors">Contact</a>
              </div>
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
    </div>;
};

export default Index;