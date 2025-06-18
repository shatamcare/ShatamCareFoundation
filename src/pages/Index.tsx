
import { useState } from 'react';
import { Menu, X, Heart, Users, Home, Award, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);

  const programs = [
    {
      icon: "🏡",
      title: "Residential & Day Care for Elderly",
      description: "Safe, supportive spaces for elder well-being",
      details: "Our residential and day care programs provide a nurturing environment where elderly individuals receive comprehensive care, engaging activities, and social interaction in a home-like setting."
    },
    {
      icon: "🎓",
      title: "Caregiver Certificate Course",
      description: "Empowering underserved individuals with skills & jobs",
      details: "We train caregivers from underserved communities, providing them with professional skills and certification to create dignified employment opportunities while addressing the growing need for elderly care."
    },
    {
      icon: "🧠",
      title: "Brain Bridge Cognitive Therapy",
      description: "Engaging therapy kits to stimulate memory & connection",
      details: "Our innovative therapy kits use evidence-based activities to stimulate cognitive function, improve memory, and maintain connections for individuals with dementia and Alzheimer's."
    },
    {
      icon: "🤝",
      title: "Dementia Support Groups",
      description: "Healing communities for caregivers & families",
      details: "Support groups provide emotional support, practical advice, and community connection for families and caregivers navigating the challenges of dementia care."
    },
    {
      icon: "🏥",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-orange-400" />
              <span className="text-xl font-bold text-blue-900">Shatam Care Foundation</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#mission" className="text-gray-700 hover:text-blue-600 transition-colors">Our Mission</a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600 transition-colors">Programs</a>
              <a href="#donate" className="text-gray-700 hover:text-blue-600 transition-colors">Donate</a>
              <a href="#get-involved" className="text-gray-700 hover:text-blue-600 transition-colors">Get Involved</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-full">
                Donate Now
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</a>
                <a href="#mission" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Our Mission</a>
                <a href="#programs" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Programs</a>
                <a href="#donate" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Donate</a>
                <a href="#get-involved" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Get Involved</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 bg-gradient-to-r from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-blue-900 leading-tight">
                Compassionate Care for India's Ageing Future
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Empowering caregivers, supporting elders, and building an inclusive dementia care ecosystem across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg"
                  onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Join the Mission
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-orange-400 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 rounded-full text-lg"
                  onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Donate to Make a Difference
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" 
                alt="Caregiver with elderly person in therapy session"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-400" />
                  <span className="font-semibold text-gray-800">Since 2018</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">
            Dignity, Support, and Hope for Every Elderly Indian
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Shatam Care Foundation is a nonprofit organization committed to supporting the emotional, medical, and social well-being of India's senior citizens—especially those affected by dementia and Alzheimer's. With inclusive caregiver training, dementia therapy, and elderly support programs, we strive to build a future where no elder or caregiver feels alone.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-16">Our Key Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{program.icon}</div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <button
                    onClick={() => setExpandedProgram(expandedProgram === index ? null : index)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn More
                    {expandedProgram === index ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    }
                  </button>
                  {expandedProgram === index && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-700">{program.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Impact Since 2018</h2>
          <p className="text-xl mb-12 opacity-90">Building a network of care across India</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-orange-300 mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-semibold mb-4">Our Partners</h3>
            <p className="text-lg opacity-90">
              Govt of Maharashtra • J&J Foundation • The Better India • L'Oréal Paris
            </p>
          </div>
        </div>
      </section>

      {/* Real Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-16">Lives Changed Through Care</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop" 
                alt="Therapy session with elderly participants"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Vaishali's Journey</h3>
                <p className="text-gray-700 leading-relaxed">
                  "From facing personal hardships to becoming a certified caregiver, Vaishali Vanmali's transformation through our program shows how we're not just caring for elders, but empowering entire communities."
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Family Testimonial</h3>
                <p className="text-gray-700 leading-relaxed italic">
                  "After joining the Brain Bridge program, my mother who had stopped engaging with us completely, now smiles, reads, and remembers family moments again. It's given us our mother back."
                </p>
                <p className="text-sm text-gray-600 mt-2">— Priya S., Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA Section */}
      <section id="donate" className="py-20 bg-gradient-to-r from-orange-400 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-8">Be a Part of the Change</h2>
          <p className="text-xl mb-12 opacity-90">Your support directly impacts lives and builds hope for families across India</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {donationOptions.map((option, index) => (
              <Card key={index} className="bg-white text-gray-800 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{option.amount}</div>
                  <p className="text-gray-700">{option.purpose}</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Donate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full">
              Volunteer with Us
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 rounded-full">
              Partner with Shatam
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" 
                alt="Amrita Patil, Founder"
                className="w-64 h-64 rounded-full object-cover mx-auto lg:mx-0 mb-6 shadow-lg"
              />
              <div className="flex justify-center lg:justify-start space-x-4 mb-4">
                <Award className="h-8 w-8 text-orange-400" />
                <Award className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="space-y-6">
              <blockquote className="text-2xl lg:text-3xl font-medium text-blue-900 leading-relaxed">
                "We are committed to building an ecosystem that empowers caregivers and supports the elderly."
              </blockquote>
              <p className="text-lg text-gray-700">
                <strong>— Amrita Patil, Founder</strong>
              </p>
              <p className="text-gray-600 leading-relaxed">
                Recognized by L'Oréal Paris and The Better India for her dedication to elderly care, Amrita has dedicated her life to creating sustainable solutions for India's aging population and their caregivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-orange-400" />
                <span className="text-xl font-bold">Shatam Care Foundation</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Building compassionate care ecosystems for India's elderly and their caregivers since 2018.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-orange-400" />
                  <span>+91 9158566665</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <span>shatamcare@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#donate" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#mission" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sponsor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">
                © 2024 Shatam Care Foundation. All rights reserved. 80G Tax exemption available.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <span className="text-gray-300 text-sm">Follow us:</span>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
