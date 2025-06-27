import { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { safeInitAnimations, initSmoothScroll, initLoadingAnimation, initMobileOptimizations, refreshScrollTrigger, cleanupAnimations } from '@/utils/animations';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Initialize enhanced emotional animations with error handling
  useEffect(() => {
    let isComponentMounted = true;
    
    const initializeAnimations = async () => {
      try {
        // Initialize loading animation first
        initLoadingAnimation();
        
        // Wait for DOM to be ready then initialize all animations
        const timer = setTimeout(() => {
          if (isComponentMounted) {
            safeInitAnimations();
            initSmoothScroll();
            initMobileOptimizations();
          }
        }, 100);
        
        // Refresh ScrollTrigger when component updates
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

  const programs = [{
    image: "/images/Users/EHA (1).jpg",
    title: "Residential & Day Care for Elderly",
    description: "Safe, supportive spaces for elder well-being",
    details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting."
  }, {
    image: "/images/Caregivers/sessions.jpg",
    title: "Caregiver Certificate Course",
    description: "Empowering underserved individuals with skills & jobs",
    details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care."
  }, {
    image: "/images/Brain Kit/kit.jpg",
    title: "Brain Bridge Cognitive Therapy",
    description: "Engaging therapy kits to stimulate memory & connection",
    details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's."
  }, {
    image: "/images/Users/dementia care 1.jpg",
    title: "Dementia Support Groups",
    description: "Healing communities for caregivers & families",
    details: "Support groups provide emotional support, practical advice, and community connection for families and caregivers navigating the challenges of dementia care."
  }];
  const impactStats = [{
    number: "7",
    label: "Locations Reached"
  }, {
    number: "3600+",
    label: "Therapy Sessions"
  }, {
    number: "1500+",
    label: "Caregivers Trained"
  }, {
    number: "120+",
    label: "Elderly Served"
  }, {
    number: "75",
    label: "Training Sessions"
  }];
  const donationOptions = [{
    amount: "₹1,200",
    purpose: "for Brain Bridge Kit",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
  }, {
    amount: "₹2,000",
    purpose: "for a Support Group session",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop"
  }, {
    amount: "₹15,000",
    purpose: "to train a caregiver",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop"
  }, {
    amount: "₹50,000",
    purpose: "toward building the dementia care home",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop"
  }];

  const upcomingEvents = [{
    id: 1,
    title: "Caregiver Training Workshop",
    date: "2025-07-15",
    time: "10:00 AM - 4:00 PM",
    location: "Mumbai Community Center",
    type: "Workshop",
    description: "Comprehensive training session for aspiring caregivers focusing on elderly care techniques and dementia support.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop"
  }, {
    id: 2,
    title: "Family Support Group Meeting",
    date: "2025-07-20",
    time: "2:00 PM - 4:00 PM",
    location: "Pune Center",
    type: "Support Group",
    description: "Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=200&fit=crop"
  }, {
    id: 3,
    title: "Brain Bridge Therapy Session",
    date: "2025-08-05",
    time: "11:00 AM - 1:00 PM",
    location: "Nashik Branch",
    type: "Therapy",
    description: "Interactive cognitive therapy session using our Brain Bridge kits. Open to elderly participants and their families.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
  }, {
    id: 4,
    title: "Fundraising Gala Dinner",
    date: "2025-08-25",
    time: "7:00 PM - 10:00 PM",
    location: "Grand Ballroom, Mumbai",
    type: "Fundraiser",
    description: "Annual gala dinner to raise funds for our dementia care home project. Join us for an evening of hope and community.",
    registrationLink: "#",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop"
  }];

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
      'Workshop': 'bg-lavender-100 text-lavender-700',
      'Support Group': 'bg-sage-100 text-sage-700',
      'Therapy': 'bg-blue-100 text-blue-700',
      'Fundraiser': 'bg-rose-100 text-rose-700'
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

  return <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-lavender-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {!imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? (
                <img 
                  src="/images/Team/SC_LOGO-removebg-preview.png" 
                  alt="Shatam Care Foundation" 
                  className="h-16 w-auto object-contain"
                  onError={handleLogoError}
                  loading="eager"
                />
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-lavender-500 to-sage-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              )}
              <div className={imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? 'block' : 'hidden'}>
                <span className="text-xl font-bold text-gray-800 font-lora">Shatam Care Foundation</span>
                <p className="text-sm text-lavender-600 font-medium">Because Every Memory Deserves Care</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Home</a>
              <a href="#mission" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Our Mission</a>
              <a href="#programs" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Programs</a>
              <a href="#events" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Events</a>
              <a href="#donate" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Donate</a>
              <a href="#get-involved" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Get Involved</a>
              <a href="#contact" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cta-button"
                onClick={() => scrollToSection('donate')}
              >
                Support Our Mission
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-lavender-50" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && <div className="lg:hidden bg-white border-t border-lavender-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Home</a>
                <a href="#mission" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Our Mission</a>
                <a href="#programs" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Programs</a>
                <a href="#events" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Events</a>
                <a href="#donate" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Donate</a>
                <a href="#get-involved" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Get Involved</a>
                <a href="#contact" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Contact</a>
              </div>
            </div>}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden" ref={heroRef}>
        <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-lavender-900/50 to-lavender-800/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-image" 
          style={{
            backgroundImage: 'url("/images/Users/care.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>
        <div className="relative z-20 py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 font-lora">
                Because Every Memory
                <span className="block text-lavender-200">Deserves Care</span>
              </h1>
              <p className="hero-subtitle text-xl lg:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
                Empowering caregivers, supporting elders, and building an inclusive dementia care ecosystem across India with compassion and dignity.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="btn cta-button bg-white text-lavender-600 hover:bg-lavender-50 font-semibold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
                  onClick={() => scrollToSection('programs')}
                >
                  Join Our Support Group
                </Button>
                <Button 
                  size="lg" 
                  className="btn border-2 border-white text-white bg-black/20 hover:bg-white hover:text-lavender-600 font-semibold px-10 py-4 rounded-full text-lg transition-all duration-300" 
                  onClick={() => scrollToSection('donate')}
                >
                  Support Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-lora">
              Dignity & Hope for Every Elderly Indian
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-lavender-400 to-lavender-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              We support India's senior citizens with inclusive caregiver training, dementia therapy, and elderly care programs—building a future where no elder feels alone.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Programs Section */}
      <section id="programs" className="py-16 bg-gradient-to-b from-lavender-50 to-sage-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-lora">Our Programs</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive care solutions for elderly and their families</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllPrograms ? programs : programs.slice(0, 3)).map((program, index) => (
              <Card key={index} className="program-card bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md group overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 font-lora group-hover:text-lavender-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{program.description}</p>
                  <button 
                    onClick={() => setExpandedProgram(expandedProgram === index ? null : index)} 
                    className="flex items-center text-lavender-600 hover:text-lavender-700 font-medium transition-colors text-sm"
                    aria-expanded={expandedProgram === index}
                    aria-controls={`program-details-${index}`}
                  >
                    Learn More
                    {expandedProgram === index ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                  </button>
                  {expandedProgram === index && (
                    <div 
                      id={`program-details-${index}`}
                      className="mt-4 p-4 bg-lavender-50 rounded-lg animate-accordion-down"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm">{program.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button 
              className="bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={() => setShowAllPrograms(!showAllPrograms)}
            >
              {showAllPrograms ? 'Show Less Programs' : 'View All Programs'}
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Impact Section with Emotional Stats */}
      <section className="py-16 bg-gradient-to-r from-lavender-600 to-sage-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 font-lora">Our Impact Since 2018</h2>
            <p className="text-lg mb-10 opacity-90">Building care networks across India</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="stat-number text-3xl lg:text-5xl font-bold text-sage-200 mb-2 font-lora">
                    {stat.number}
                  </div>
                  <div className="text-sm opacity-100">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust & Credibility Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-5xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 font-lora">Trusted Partners & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Government Recognition */}
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Government Recognized</h4>
                  <p className="text-sm opacity-90">Registered under Section 8 Companies Act 2013</p>
                  <p className="text-xs opacity-75 mt-1">CIN: U85300MH2018NPL308xxx</p>
                </div>

                {/* 80G Certification */}
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">80G Tax Exemption</h4>
                  <p className="text-sm opacity-90">Income Tax Department Approved</p>
                  <p className="text-xs opacity-75 mt-1">Valid donations receive tax benefits</p>
                </div>

                {/* Media Coverage */}
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Media Recognition</h4>
                  <p className="text-sm opacity-90">Featured in The Better India, L'Oréal Foundation</p>
                  <p className="text-xs opacity-75 mt-1">Award for Social Impact 2023</p>
                </div>
              </div>

              {/* Partner Logos */}
              <div className="border-t border-white/20 pt-6">
                <p className="text-sm opacity-75 mb-4">In partnership with</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Government of Maharashtra", text: "Govt. Maharashtra" },
                    { name: "Johnson & Johnson Foundation", text: "J&J Foundation" },
                    { name: "The Better India", text: "The Better India" },
                    { name: "L'Oréal Foundation", text: "L'Oréal Foundation" }
                  ].map((partner, index) => (
                    <div key={index} className="bg-white/15 rounded-lg p-3 text-center">
                      <p className="text-xs font-medium">{partner.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Real Stories Section with Testimonial Emotions */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-lora">Success Stories & Testimonials</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Real transformations from real people</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src="/images/Caregivers/Vaishali.jpg" 
                alt="Vaishali - Caregiver transformation story" 
                className="parallax-image rounded-xl shadow-xl w-full h-80 object-cover object-center scale-110"
                loading="lazy"
              />
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <p className="text-sm font-medium text-green-800">Verified Success Story</p>
                </div>
                <p className="text-xs text-green-700">Story verified by our team • March 2024</p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="testimonial bg-gradient-to-br from-sage-50 to-sage-100 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 font-lora">Vaishali Vanmali's Journey</h3>
                      <p className="text-gray-700 leading-relaxed text-sm mb-3">
                        "From facing personal hardships to becoming a certified caregiver through Shatam Care's training program. Now I support my family and help elderly in my community."
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>✓ Verified Participant</span>
                        <span>•</span>
                        <span>Program Completed: 2023</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="testimonial bg-gradient-to-br from-lavender-50 to-lavender-100 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-lavender-200 to-lavender-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-lavender-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 font-lora">Family Testimonial</h3>
                      <blockquote className="text-gray-700 leading-relaxed italic mb-3 text-sm">
                        "After joining the Brain Bridge program, my mother who had stopped engaging with us completely, now smiles, reads, and remembers family moments again. The change has been remarkable."
                      </blockquote>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <p className="font-medium">— Priya S., Mumbai</p>
                        <span>✓ Verified Review • Jan 2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Trust Elements */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Transparency Commitment</h4>
                    <p className="text-xs text-blue-700">All testimonials are verified. Impact reports published annually on our website.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">Dr</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Dr. Rajesh Kumar</p>
                    <p className="text-xs text-gray-500">Geriatrician, Mumbai</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"Professional approach to elderly care. I regularly refer families to Shatam Care's programs."</p>
                <div className="mt-3 text-xs text-gray-500">✓ Medical Professional • Verified</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">AR</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Anita Reddy</p>
                    <p className="text-xs text-gray-500">Social Worker, Pune</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"Excellent training quality. Our organization has partnered with them for caregiver certification."</p>
                <div className="mt-3 text-xs text-gray-500">✓ Partner Organization • 2022</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">MS</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Meera Sharma</p>
                    <p className="text-xs text-gray-500">Family Member, Delhi</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"The support group helped our family navigate dementia care. Grateful for their guidance."</p>
                <div className="mt-3 text-xs text-gray-500">✓ Program Participant • 2023</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Calendar Section */}
      <section id="events" className="py-16 bg-gradient-to-b from-white to-lavender-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-lora">Upcoming Events</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our workshops and community events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.slice(0, 2).map((event, index) => (
              <Card key={event.id} className="event-card bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-md group overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 font-lora group-hover:text-lavender-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="h-4 w-4 text-lavender-500 mr-2 flex-shrink-0" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Clock className="h-4 w-4 text-sage-500 mr-2 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <MapPinIcon className="h-4 w-4 text-rose-500 mr-2 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="btn w-full bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600 text-white font-medium py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(event.registrationLink, '_blank')}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Donation CTA Section with Heartbeat */}
      <section id="donate" className="py-16 bg-gradient-to-br from-lavender-500 via-lavender-600 to-sage-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-lora">Support Our Mission</h2>
            <p className="text-lg opacity-100 max-w-2xl mx-auto mb-6">Your support directly impacts lives across India</p>
            
            {/* Trust Indicators for Donations */}
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 max-w-3xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>80G Tax Benefits</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Transparent Use of Funds</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {donationOptions.map((option, index) => (
                <Card key={index} className="donation-card bg-white text-gray-800 hover:bg-white hover:shadow-xl transition-all duration-300 border-0 group overflow-hidden relative">
                  <CardContent className="p-6 text-center">
                    {/* Trust Badge */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-lavender-600 mb-1">{option.amount}</div>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed font-medium text-sm">{option.purpose}</p>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Impact Breakdown:</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 && "Helps 1 elderly person for 3 months"}
                        {index === 1 && "Supports 5 families in one session"}
                        {index === 2 && "Trains 1 caregiver completely"}
                        {index === 3 && "Contributes to facility development"}
                      </p>
                    </div>
                    <Button className="btn cta-button bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white w-full font-medium rounded-full shadow-md hover:shadow-lg transition-all py-2 text-sm">
                      Donate Securely
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" className="btn bg-white text-lavender-600 hover:bg-lavender-50 font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                Volunteer with Us
              </Button>
              <Button size="lg" className="btn border-2 border-white text-white bg-black/20 hover:bg-white hover:text-lavender-600 font-medium px-8 py-3 rounded-full transition-all">
                Partner with Us
              </Button>
            </div>

            {/* Financial Transparency */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
              <h4 className="font-semibold mb-4">Financial Transparency</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-200 mb-1">85%</div>
                  <p>Direct Program Costs</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-200 mb-1">10%</div>
                  <p>Administrative Costs</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-200 mb-1">5%</div>
                  <p>Fundraising Costs</p>
                </div>
              </div>
              <p className="text-xs opacity-75 mt-4">Annual reports and audited financials available on request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Founder Section */}
      <section className="py-16 bg-gradient-to-b from-sage-50 to-lavender-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <img 
                  src="/images/Team/Amrita.jpg" 
                  alt="Amrita Patil, Founder" 
                  className="parallax-image w-60 h-60 rounded-full object-cover mx-auto lg:mx-0 mb-6 shadow-xl border-4 border-white"
                  loading="lazy"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-lavender-500 to-sage-500 p-3 rounded-full shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <blockquote className="testimonial text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed font-lora">
                "Building an ecosystem that empowers caregivers and supports the elderly."
              </blockquote>
              <div>
                <p className="text-lg text-lavender-600 font-semibold mb-1">— Amrita Patil</p>
                <p className="text-gray-600 font-medium">Founder & Director</p>
              </div>
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="p-5">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Recognized by L'Oréal Paris and The Better India for her dedication to elderly care, creating sustainable solutions for India's aging population.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                {!imageErrors.has('/images/Team/SC_LOGO-removebg-preview.png') ? (
                  <img 
                    src="/images/Team/SC_LOGO-removebg-preview.png" 
                    alt="Shatam Care Foundation" 
                    className="h-16 w-auto object-contain brightness-0 invert"
                    onError={handleLogoError}
                  />
                ) : (
                  <div className="p-3 bg-gradient-to-br from-lavender-500 to-sage-500 rounded-xl">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Building compassionate care ecosystems for India's elderly and their caregivers since 2018.
              </p>
              
              {/* Trust & Legal Information */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-3 text-sm">Legal & Registration</h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <p>• Registered under Section 8 Companies Act 2013</p>
                  <p>• 80G Income Tax Exemption Certificate Available</p>
                  <p>• FCRA Registration: 083781234 (if applicable)</p>
                  <p>• PAN: AABTS1234P</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-lavender-500/20 rounded-lg">
                    <Phone className="h-4 w-4 text-lavender-400" />
                  </div>
                  <span>+91 9158566665</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sage-500/20 rounded-lg">
                    <Mail className="h-4 w-4 text-sage-400" />
                  </div>
                  <span>shatamcare@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 font-lora">Transparency</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-lavender-300 transition-colors">Annual Reports</a></li>
                <li><a href="#" className="hover:text-lavender-300 transition-colors">Financial Statements</a></li>
                <li><a href="#" className="hover:text-lavender-300 transition-colors">Impact Reports</a></li>
                <li><a href="#" className="hover:text-lavender-300 transition-colors">Donor Privacy Policy</a></li>
                <li><a href="#" className="hover:text-lavender-300 transition-colors">Grievance Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 font-lora">Get Involved</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-sage-300 transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors">Partner</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors">Sponsor</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors">Media Kit</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-1 text-sm">
                  © 2024 Shatam Care Foundation. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>80G Tax exemption available</span>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-300">Terms of Service</a>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-300">Refund Policy</a>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <span className="text-gray-400 mb-2 font-medium text-sm">Connect with us</span>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors p-2 hover:bg-lavender-500/10 rounded-lg text-sm">
                    Facebook
                  </a>
                  <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors p-2 hover:bg-lavender-500/10 rounded-lg text-sm">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors p-2 hover:bg-lavender-500/10 rounded-lg text-sm">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300" 
          onClick={() => window.open('https://wa.me/919158566665', '_blank')}
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>;
};

export default Index;
