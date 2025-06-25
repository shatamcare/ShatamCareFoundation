import { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle, Calendar, Clock, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { initAnimations, initSmoothScroll, initLoadingAnimation, initMobileOptimizations, refreshScrollTrigger } from '@/utils/animations';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Initialize animations on component mount
  useEffect(() => {
    // Initialize loading animation first
    initLoadingAnimation();
    
    // Wait for DOM to be ready then initialize all animations
    const timer = setTimeout(() => {
      initAnimations();
      initSmoothScroll();
      initMobileOptimizations();
    }, 100);
    
    // Refresh ScrollTrigger when component updates
    const refreshTimer = setTimeout(() => {
      refreshScrollTrigger();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(refreshTimer);
    };
  }, []);
  
  // Refresh ScrollTrigger when expanded program changes
  useEffect(() => {
    if (expandedProgram !== null) {
      setTimeout(() => refreshScrollTrigger(), 300);
    }
  }, [expandedProgram]);

  const programs = [{
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    title: "Residential & Day Care for Elderly",
    description: "Safe, supportive spaces for elder well-being",
    details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting."
  }, {
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
    title: "Caregiver Certificate Course",
    description: "Empowering underserved individuals with skills & jobs",
    details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care."
  }, {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    title: "Brain Bridge Cognitive Therapy",
    description: "Engaging therapy kits to stimulate memory & connection",
    details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's."
  }, {
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
    title: "Dementia Support Groups",
    description: "Healing communities for caregivers & families",
    details: "Support groups provide emotional support, practical advice, and community connection for families and caregivers navigating the challenges of dementia care."
  }, {
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop",
    title: "Care Home & Training Centre",
    description: "A model dementia care facility in Maharashtra (Upcoming)",
    details: "Our upcoming facility will serve as a model for dementia care in India, combining residential care with training programs to scale our impact nationwide."
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop':
        return 'bg-lavender-100 text-lavender-700';
      case 'Support Group':
        return 'bg-sage-100 text-sage-700';
      case 'Therapy':
        return 'bg-blue-100 text-blue-700';
      case 'Fundraiser':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-lavender-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/SC_LOGO-removebg-preview.png" 
                alt="Shatam Care Foundation" 
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  // Fallback to text if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden">
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
              <Button className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cta-button">
                Support Our Mission
              </Button>
              
              {/* Mobile menu button */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-lavender-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-900/60 to-lavender-800/40 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url("/images/sessions.jpg")'
      }}></div>
        <div className="relative z-20 py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 font-lora">
                Because Every Memory
                <span className="block text-lavender-200">Deserves Care</span>
              </h1>
              <p className="hero-subtitle text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Empowering caregivers, supporting elders, and building an inclusive dementia care ecosystem across India with compassion and dignity.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="btn bg-white text-lavender-600 hover:bg-lavender-50 font-semibold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" onClick={() => document.getElementById('programs')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Join Our Support Group
                </Button>
                <Button size="lg" className="btn border-2 border-white text-white bg-white/10 hover:bg-white hover:text-lavender-600 font-semibold px-10 py-4 rounded-full text-lg backdrop-blur-sm transition-all duration-300" onClick={() => document.getElementById('donate')?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  Support Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8 font-lora">
              Dignity, Support, and Hope for Every Elderly Indian
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-lavender-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Shatam Care Foundation is a nonprofit organization committed to supporting the emotional, medical, and social well-being of India's senior citizens—especially those affected by dementia and Alzheimer's. With inclusive caregiver training, dementia therapy, and elderly support programs, we strive to build a future where no elder or caregiver feels alone.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-gradient-to-b from-lavender-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-lora">Our Key Programs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => <Card key={index} className="program-card bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 font-lora group-hover:text-lavender-600 transition-colors">{program.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                  <button onClick={() => setExpandedProgram(expandedProgram === index ? null : index)} className="flex items-center text-lavender-600 hover:text-lavender-700 font-medium transition-colors">
                    Learn More
                    {expandedProgram === index ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </button>
                  {expandedProgram === index && <div className="mt-6 p-6 bg-lavender-50 rounded-xl animate-accordion-down">
                      <p className="text-gray-700 leading-relaxed">{program.details}</p>
                    </div>}
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-lavender-600 to-sage-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-lora">Our Impact Since 2018</h2>
            <p className="text-xl mb-12 opacity-90">Building a network of care across India</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
              {impactStats.map((stat, index) => <div key={index} className="text-center">
                  <div className="stat-number text-4xl lg:text-6xl font-bold text-sage-200 mb-3 font-lora">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>)}
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-8 font-lora text-center">Trusted Partners</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 flex items-center justify-center hover:shadow-lg transition-shadow h-16">
                  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop&crop=center" alt="Government of Maharashtra" className="max-h-10 w-auto object-contain" />
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center hover:shadow-lg transition-shadow h-16">
                  <img src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop&crop=center" alt="Johnson & Johnson Foundation" className="max-h-10 w-auto object-contain" />
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center hover:shadow-lg transition-shadow h-16">
                  <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=60&fit=crop&crop=center" alt="The Better India" className="max-h-10 w-auto object-contain" />
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-center hover:shadow-lg transition-shadow h-16">
                  <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=120&h=60&fit=crop&crop=center" alt="L'Oréal Paris" className="max-h-10 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-lora">Lives Changed Through Care</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop" alt="Therapy session with elderly participants" className="parallax-image rounded-2xl shadow-2xl w-full h-96 object-cover" />
            </div>
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-sage-50 to-sage-100 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 font-lora">Vaishali's Journey</h3>
                      <p className="text-gray-700 leading-relaxed">
                        "From facing personal hardships to becoming a certified caregiver, Vaishali Vanmali's transformation through our program shows how we're not just caring for elders, but empowering entire communities."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-lavender-50 to-lavender-100 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-lavender-200 to-lavender-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-8 w-8 text-lavender-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 font-lora">Family Testimonial</h3>
                      <p className="text-gray-700 leading-relaxed italic mb-4">
                        "After joining the Brain Bridge program, my mother who had stopped engaging with us completely, now smiles, reads, and remembers family moments again. It's given us our mother back."
                      </p>
                      <p className="text-sm text-gray-500 font-medium">— Priya S., Mumbai</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Events Calendar Section */}
      <section id="events" className="py-24 bg-gradient-to-b from-white to-lavender-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-lora">Upcoming Events</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for workshops, support groups, and community events designed to strengthen our care network
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="event-card bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 font-lora group-hover:text-lavender-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 text-lavender-500 mr-3 flex-shrink-0" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="btn w-full bg-gradient-to-r from-lavender-500 to-sage-500 hover:from-lavender-600 hover:to-sage-600 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => window.open(event.registrationLink, '_blank')}
                        >
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-lavender-100 to-sage-100 border-0 shadow-lg inline-block">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-lavender-500 to-sage-500 rounded-full">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-lora">Want to Stay Updated?</h3>
                    <p className="text-gray-600 mb-4">Subscribe to our newsletter for event notifications and updates</p>
                    <Button 
                      className="btn bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => window.open('mailto:shatamcare@gmail.com?subject=Newsletter Subscription', '_blank')}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation CTA Section */}
      <section id="donate" className="py-24 bg-gradient-to-br from-lavender-500 via-lavender-600 to-sage-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-lora">Be a Part of the Change</h2>
            <p className="text-xl mb-16 opacity-90 max-w-3xl mx-auto">Your support directly impacts lives and builds hope for families across India</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {donationOptions.map((option, index) => <Card key={index} className="donation-card bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white hover:shadow-2xl transition-all duration-300 border-0 group overflow-hidden">
                  <div className="relative h-32 overflow-hidden">
                    <img src={option.image} alt={option.purpose} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-white font-bold text-xl">{option.amount}</div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-700 mb-4 leading-relaxed font-medium">{option.purpose}</p>
                    <Button className="btn bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white w-full font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="btn bg-white text-lavender-600 hover:bg-lavender-50 font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all">
                Volunteer with Us
              </Button>
              <Button size="lg" className="btn border-2 border-white text-white bg-white/10 hover:bg-white hover:text-lavender-600 font-semibold px-10 py-4 rounded-full backdrop-blur-sm transition-all">
                Partner with Shatam
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-gradient-to-b from-sage-50 to-lavender-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" alt="Amrita Patil, Founder" className="parallax-image w-80 h-80 rounded-full object-cover mx-auto lg:mx-0 mb-8 shadow-2xl border-8 border-white" />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-lavender-500 to-sage-500 p-4 rounded-full shadow-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <blockquote className="text-3xl lg:text-4xl font-medium text-gray-800 leading-relaxed font-lora">
                "We are committed to building an ecosystem that empowers caregivers and supports the elderly."
              </blockquote>
              <div>
                <p className="text-xl text-lavender-600 font-semibold mb-2">— Amrita Patil</p>
                <p className="text-lg text-gray-600 font-medium">Founder & Director</p>
              </div>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Recognized by L'Oréal Paris and The Better India for her dedication to elderly care, Amrita has dedicated her life to creating sustainable solutions for India's aging population and their caregivers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/images/SC_LOGO-removebg-preview.png" 
                  alt="Shatam Care Foundation" 
                  className="h-12 w-auto object-contain brightness-0 invert"
                  onError={(e) => {
                    // Fallback to icon if logo fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden p-3 bg-gradient-to-br from-lavender-500 to-sage-500 rounded-xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold font-lora">Shatam Care Foundation</span>
                  <p className="text-lavender-200">Because Every Memory Deserves Care</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Building compassionate care ecosystems for India's elderly and their caregivers since 2018.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-lavender-500/20 rounded-lg">
                    <Phone className="h-5 w-5 text-lavender-400" />
                  </div>
                  <span className="text-lg">+91 9158566665</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sage-500/20 rounded-lg">
                    <Mail className="h-5 w-5 text-sage-400" />
                  </div>
                  <span className="text-lg">shatamcare@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 font-lora">Quick Links</h3>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#programs" className="hover:text-lavender-300 transition-colors text-lg">Programs</a></li>
                <li><a href="#events" className="hover:text-lavender-300 transition-colors text-lg">Events</a></li>
                <li><a href="#donate" className="hover:text-lavender-300 transition-colors text-lg">Donate</a></li>
                <li><a href="#mission" className="hover:text-lavender-300 transition-colors text-lg">About Us</a></li>
                <li><a href="#contact" className="hover:text-lavender-300 transition-colors text-lg">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 font-lora">Get Involved</h3>
              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-sage-300 transition-colors text-lg">Volunteer</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors text-lg">Partner</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors text-lg">Sponsor</a></li>
                <li><a href="#" className="hover:text-sage-300 transition-colors text-lg">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-lg mb-4 md:mb-0">
                © 2024 Shatam Care Foundation. All rights reserved. 80G Tax exemption available.
              </p>
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-lg">Follow us:</span>
                <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors text-lg">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors text-lg">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-lavender-300 transition-colors text-lg">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300" onClick={() => window.open('https://wa.me/919158566665', '_blank')}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>;
};
export default Index;
