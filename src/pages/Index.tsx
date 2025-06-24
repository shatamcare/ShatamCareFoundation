
import { useState } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);

  const programs = [
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
      title: "Residential & Day Care for Elderly",
      description: "Safe, supportive spaces for elder well-being",
      details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting."
    },
    {
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
      title: "Caregiver Certificate Course",
      description: "Empowering underserved individuals with skills & jobs",
      details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care."
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      title: "Brain Bridge Cognitive Therapy",
      description: "Engaging therapy kits to stimulate memory & connection",
      details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's."
    },
    {
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
      title: "Dementia Support Groups",
      description: "Healing communities for caregivers & families",
      details: "Support groups provide emotional support, practical advice, and community connection for families and caregivers navigating the challenges of dementia care."
    },
    {
      image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=300&fit=crop",
      title: "Care Home & Training Centre",
      description: "A model dementia care facility in Maharashtra (Upcoming)",
      details: "Our upcoming facility will serve as a model for dementia care in India, combining residential care with training programs to scale our impact nationwide."
    }
  ];

  const impactStats = [
    { number: "7", label: "Locations Reached" },
    { number: "3600+", label: "Therapy Sessions" },
    { number: "1500+", label: "Caregivers Trained" },
    { number: "120+", label: "Elderly Served" },
    { number: "75", label: "Training Sessions" }
  ];

  const donationOptions = [
    { amount: "₹1,200", purpose: "for Brain Bridge Kit" },
    { amount: "₹2,000", purpose: "for a Support Group session" },
    { amount: "₹15,000", purpose: "to train a caregiver" },
    { amount: "₹50,000", purpose: "toward building the dementia care home" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-lavender-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl">
                <Heart className="h-8 w-8 text-lavender-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800 font-lora">Shatam Care Foundation</span>
                <p className="text-sm text-lavender-600 font-medium">Because Every Memory Deserves Care</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Home</a>
              <a href="#mission" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Our Mission</a>
              <a href="#programs" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Programs</a>
              <a href="#donate" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Donate</a>
              <a href="#get-involved" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Get Involved</a>
              <a href="#contact" className="text-gray-700 hover:text-lavender-600 transition-colors font-medium">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Support Our Mission
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-lavender-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-lavender-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Home</a>
                <a href="#mission" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Our Mission</a>
                <a href="#programs" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Programs</a>
                <a href="#donate" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Donate</a>
                <a href="#get-involved" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Get Involved</a>
                <a href="#contact" className="block px-4 py-3 text-gray-700 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-900/60 to-lavender-800/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop")'
          }}
        ></div>
        <div className="relative z-20 py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-8 font-lora">
                Because Every Memory
                <span className="block text-lavender-200">Deserves Care</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Empowering caregivers, supporting elders, and building an inclusive dementia care ecosystem across India with compassion and dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-lavender-600 hover:bg-lavender-50 font-semibold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Join Our Support Group
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-lavender-600 font-semibold px-10 py-4 rounded-full text-lg backdrop-blur-sm transition-all duration-300"
                  onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                >
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
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
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
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-lora">Our Key Programs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg animate-fade-in-up group overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 font-lora group-hover:text-lavender-600 transition-colors">{program.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                  <button
                    onClick={() => setExpandedProgram(expandedProgram === index ? null : index)}
                    className="flex items-center text-lavender-600 hover:text-lavender-700 font-medium transition-colors"
                  >
                    Learn More
                    {expandedProgram === index ? 
                      <ChevronUp className="ml-2 h-4 w-4" /> : 
                      <ChevronDown className="ml-2 h-4 w-4" />
                    }
                  </button>
                  {expandedProgram === index && (
                    <div className="mt-6 p-6 bg-lavender-50 rounded-xl animate-accordion-down">
                      <p className="text-gray-700 leading-relaxed">{program.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-r from-lavender-600 to-sage-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-lora">Our Impact Since 2018</h2>
            <p className="text-xl mb-16 opacity-90">Building a network of care across India</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-4xl lg:text-6xl font-bold text-sage-200 mb-3 font-lora">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 animate-fade-in-up">
              <h3 className="text-2xl font-semibold mb-6 font-lora">Our Partners</h3>
              <p className="text-lg opacity-90">
                Govt of Maharashtra • J&J Foundation • The Better India • L'Oréal Paris
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 font-lora">Lives Changed Through Care</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop" 
                alt="Therapy session with elderly participants"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="space-y-8 animate-fade-in-up">
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

      {/* Donation CTA Section */}
      <section id="donate" className="py-24 bg-gradient-to-br from-lavender-500 via-lavender-600 to-sage-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-lora">Be a Part of the Change</h2>
            <p className="text-xl mb-16 opacity-90 max-w-3xl mx-auto">Your support directly impacts lives and builds hope for families across India</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {donationOptions.map((option, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white hover:shadow-2xl transition-all duration-300 border-0 animate-fade-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8 text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-lavender-600 mb-3 font-lora group-hover:scale-110 transition-transform">{option.amount}</div>
                    <p className="text-gray-700 mb-6 leading-relaxed">{option.purpose}</p>
                    <Button className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white w-full font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
              <Button size="lg" className="bg-white text-lavender-600 hover:bg-lavender-50 font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all">
                Volunteer with Us
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-lavender-600 font-semibold px-10 py-4 rounded-full backdrop-blur-sm transition-all">
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
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="relative inline-block">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" 
                  alt="Amrita Patil, Founder"
                  className="w-80 h-80 rounded-full object-cover mx-auto lg:mx-0 mb-8 shadow-2xl border-8 border-white"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-lavender-500 to-sage-500 p-4 rounded-full shadow-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-8 animate-fade-in-up">
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
                <div className="p-3 bg-gradient-to-br from-lavender-500 to-sage-500 rounded-xl">
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
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse"
          onClick={() => window.open('https://wa.me/919158566665', '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
