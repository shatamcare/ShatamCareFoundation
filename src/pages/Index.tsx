
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { safeInitAnimations, initSmoothScroll, cleanupAnimations } from '@/utils/animations';
import { getImagePath, getBackgroundImagePath, imagePaths } from '@/utils/imagePaths';
import ContactForm from '@/components/ContactForm';
import NewsletterSignup from '@/components/NewsletterSignup';
import EventRegistrationModal from '@/components/EventRegistrationModal';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      safeInitAnimations();
      initSmoothScroll();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      cleanupAnimations();
    };
  }, []);

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set(prev).add(imagePath));
  };

  // Simplified and focused programs
  const programs = [
    {
      image: imagePaths.users.eha1,
      title: "Elderly Care Services",
      description: "Professional residential and day care with 24/7 support",
      impact: "120+ elderly served daily",
      icon: Home
    },
    {
      image: imagePaths.caregivers.training,
      title: "Caregiver Training",
      description: "Certified training program creating employment opportunities",
      impact: "1,500+ caregivers certified",
      icon: Users
    },
    {
      image: imagePaths.brainKit.kit,
      title: "Memory Care Therapy",
      description: "Evidence-based cognitive therapy for dementia patients",
      impact: "3,600+ therapy sessions delivered",
      icon: Heart
    }
  ];

  // Focused impact stats
  const impactStats = [
    { number: "1,500+", label: "Caregivers Trained" },
    { number: "800+", label: "Families Supported" },
    { number: "120+", label: "Elderly in Care" },
    { number: "7", label: "Cities Reached" }
  ];

  // Meaningful donation options
  const donationOptions = [
    {
      amount: "₹1,200",
      purpose: "Monthly Therapy Kit",
      impact: "Supports one elderly person for a month"
    },
    {
      amount: "₹15,000",
      purpose: "Train One Caregiver",
      impact: "Complete certification program",
      popular: true
    },
    {
      amount: "₹50,000",
      purpose: "Care Facility Support",
      impact: "Monthly operational support"
    }
  ];

  // Key upcoming events
  const upcomingEvents = [
    {
      id: "caregiver-workshop-jul",
      title: "Caregiver Training Workshop",
      date: "2025-07-15",
      time: "10:00 AM - 4:00 PM",
      location: "Mumbai Community Center",
      type: "Training",
      description: "Comprehensive caregiver training with certification",
      image: imagePaths.caregivers.training,
      spots: "12 spots available"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`sticky top-0 bg-white z-50 shadow-sm transition-all duration-300 ${isHeaderScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {!imageErrors.has(imagePaths.team.logo) ? (
                <img 
                  src={imagePaths.team.logo} 
                  alt="Shatam Care Foundation" 
                  className="h-16 w-auto object-contain"
                  onError={() => handleImageError(imagePaths.team.logo)}
                />
              ) : (
                <div className="h-16 w-16 bg-warm-teal rounded-xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            <nav className="hidden lg:flex space-x-8">
              <a href="#programs" className="text-gray-700 hover:text-warm-teal transition-colors">Programs</a>
              <a href="#impact" className="text-gray-700 hover:text-warm-teal transition-colors">Impact</a>
              <a href="#events" className="text-gray-700 hover:text-warm-teal transition-colors">Events</a>
              <a href="#contact" className="text-gray-700 hover:text-warm-teal transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                className="bg-warm-teal hover:bg-warm-teal-600 text-white hidden sm:flex"
                onClick={() => scrollToSection('donate')}
              >
                Donate Now
              </Button>
              
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#programs" className="block px-4 py-3 text-gray-700 hover:text-warm-teal">Programs</a>
                <a href="#impact" className="block px-4 py-3 text-gray-700 hover:text-warm-teal">Impact</a>
                <a href="#events" className="block px-4 py-3 text-gray-700 hover:text-warm-teal">Events</a>
                <a href="#contact" className="block px-4 py-3 text-gray-700 hover:text-warm-teal">Contact</a>
                <div className="px-4 py-3">
                  <Button 
                    className="bg-warm-teal hover:bg-warm-teal-600 text-white w-full"
                    onClick={() => scrollToSection('donate')}
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-warm-teal to-warm-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 font-poppins">
              Every Memory Deserves Care
            </h1>
            <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              Empowering caregivers and supporting elders with dementia across India since 2018
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-warm-teal hover:bg-gray-100 px-8 py-4"
                onClick={() => scrollToSection('programs')}
              >
                <Heart className="mr-2 h-5 w-5" />
                Our Programs
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-warm-teal px-8 py-4"
                onClick={() => scrollToSection('donate')}
              >
                Support Our Mission
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-charcoal mb-6">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive care solutions designed to empower caregivers and enhance quality of life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300 border-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                    <program.icon className="h-5 w-5 text-warm-teal" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-dark-charcoal mb-3">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="text-sm font-medium text-warm-teal mb-4">{program.impact}</div>
                  <button 
                    onClick={() => setExpandedProgram(expandedProgram === index ? null : index)} 
                    className="flex items-center text-warm-teal hover:text-warm-teal-600 font-medium"
                  >
                    Learn More
                    {expandedProgram === index ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                  </button>
                  {expandedProgram === index && (
                    <div className="mt-4 p-4 bg-warm-teal-50 rounded-lg">
                      <Button className="bg-warm-teal hover:bg-warm-teal-600 text-white">
                        Get Involved <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-warm-teal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
            Creating meaningful change in elderly care across India
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">L'Oréal Award Winner</h3>
                <p className="text-sm opacity-80">Recognized for social impact in elderly care</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">80G Tax Benefits</h3>
                <p className="text-sm opacity-80">Government approved donations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Transparent Impact</h3>
                <p className="text-sm opacity-80">Regular impact reports available</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-charcoal mb-6">Upcoming Events</h2>
            <p className="text-xl text-gray-600">
              Join our community workshops and training programs
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-white shadow-lg border-0 mb-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-warm-teal text-white px-3 py-1 rounded-full text-sm">
                        {event.type}
                      </span>
                      <span className="text-sunrise-orange font-medium text-sm">{event.spots}</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark-charcoal mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 text-warm-teal mr-2" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 text-sunrise-orange mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-4 w-4 text-sage-600 mr-2" />
                        <span className="text-sm">{event.location}</span>
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
                      <Button className="bg-warm-teal hover:bg-warm-teal-600 text-white w-full">
                        Register Now
                      </Button>
                    </EventRegistrationModal>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-20 bg-gradient-to-r from-warm-teal to-warm-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Make a Difference Today</h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
            Your donation directly supports our mission to provide dignified elderly care
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {donationOptions.map((option, index) => (
              <Card key={index} className={`bg-white text-dark-charcoal ${option.popular ? 'ring-2 ring-sunrise-orange' : ''}`}>
                <CardContent className="p-6 text-center">
                  {option.popular && (
                    <div className="bg-sunrise-orange text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <div className="text-3xl font-bold text-warm-teal mb-2">{option.amount}</div>
                  <div className="font-medium text-gray-700 mb-4">{option.purpose}</div>
                  <div className="text-sm text-gray-600 mb-6">{option.impact}</div>
                  <Button className="bg-warm-teal hover:bg-warm-teal-600 text-white w-full">
                    Donate <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm">80G Tax Benefits</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src={imagePaths.team.amrita} 
                alt="Amrita Patil, Founder" 
                className="w-80 h-80 rounded-2xl object-cover mx-auto lg:mx-0 shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark-charcoal mb-6">Meet Our Founder</h2>
              <blockquote className="text-2xl font-medium text-dark-charcoal mb-6 italic">
                "Building an ecosystem that empowers caregivers and supports the elderly with dignity."
              </blockquote>
              <div className="mb-6">
                <p className="text-xl text-warm-teal font-semibold">Amrita Patil</p>
                <p className="text-gray-600">Founder & Director</p>
              </div>
              <Card className="bg-warm-teal-50 border-0">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">
                    Recognized by L'Oréal Paris and The Better India for her dedication to elderly care, 
                    Amrita has pioneered sustainable solutions for India's aging population.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-warm-teal text-white px-3 py-1 rounded-full text-sm">L'Oréal Award Winner</span>
                    <span className="bg-sunrise-orange text-white px-3 py-1 rounded-full text-sm">Social Impact Leader</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Footer */}
      <footer className="bg-dark-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {!imageErrors.has(imagePaths.team.logo) ? (
                  <img 
                    src={imagePaths.team.logo} 
                    alt="Shatam Care Foundation" 
                    className="h-10 w-auto brightness-0 invert"
                  />
                ) : (
                  <Heart className="h-8 w-8 text-warm-teal" />
                )}
                <span className="text-lg font-bold">Shatam Care Foundation</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering caregivers and creating dignified care solutions for India's elderly since 2018.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-bold text-warm-teal">1,500+</div>
                  <div className="text-gray-400">Caregivers Trained</div>
                </div>
                <div>
                  <div className="font-bold text-sunrise-orange">800+</div>
                  <div className="text-gray-400">Families Helped</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#programs" className="text-gray-400 hover:text-warm-teal">Programs</a></li>
                <li><a href="#impact" className="text-gray-400 hover:text-warm-teal">Impact</a></li>
                <li><a href="#events" className="text-gray-400 hover:text-warm-teal">Events</a></li>
                <li><a href="#donate" className="text-gray-400 hover:text-warm-teal">Donate</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-warm-teal mr-2" />
                  <span>+91 9158566665</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-sunrise-orange mr-2" />
                  <span>shatamcare@gmail.com</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded">
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="h-3 w-3 text-warm-teal" />
                  <span>80G Tax Exemption Available</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Shatam Care Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg" 
          onClick={() => window.open('https://wa.me/919158566665', '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
