
import { useEffect } from 'react';
import { initOptimizedAnimations } from '@/utils/optimizedAnimations';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Target, Star, ArrowRight, Facebook, Instagram, Linkedin, Mail } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    initOptimizedAnimations();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PerformanceMonitor />

      {/* Header & Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <OptimizedImage
                src="/images/shatam-care-foundation-logo.png"
                alt="Shatam Care Foundation Logo"
                width={80}
                height={80}
                className="w-20 h-20"
                priority
              />
              <div className="hidden md:block">
                <h1 className="font-bold text-xl text-gray-800">Shatam Care Foundation</h1>
                <p className="text-sm text-gray-600">Because Every Memory Deserves Care</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-teal-600 transition-colors">Home</a>
              <a href="#mission" className="text-gray-700 hover:text-teal-600 transition-colors">Our Mission</a>
              <a href="#programs" className="text-gray-700 hover:text-teal-600 transition-colors">Programs</a>
              <a href="#impact" className="text-gray-700 hover:text-teal-600 transition-colors">Impact</a>
              <a href="#involved" className="text-gray-700 hover:text-teal-600 transition-colors">Get Involved</a>
              <a href="#contact" className="text-gray-700 hover:text-teal-600 transition-colors">Contact</a>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">
                Donate Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className="w-full h-0.5 bg-gray-800"></span>
                <span className="w-full h-0.5 bg-gray-800"></span>
                <span className="w-full h-0.5 bg-gray-800"></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[80vh] bg-gradient-to-br from-teal-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <OptimizedImage
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop"
          alt="Caregiver assisting older adult with smile"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="hero-title text-6xl md:text-7xl font-bold font-poppins mb-6 leading-tight">
              Because Every Memory Deserves Care
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl mb-8 font-light">
              Empowering caregivers • Supporting elders • Building a dementia-aware community
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn cta-button bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg shadow-lg"
              >
                Donate Now
              </Button>
              <a 
                href="#mission" 
                className="text-white hover:text-orange-300 transition-colors underline-offset-4 hover:underline text-lg"
              >
                Learn More About Us →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision • Mission • Values Module */}
      <section id="mission" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-poppins text-gray-800 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on compassion, guided by purpose, driven by impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="program-card bg-gray-100 border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-2xl font-poppins text-gray-800">Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4 text-base leading-relaxed">
                  A world where every individual with dementia receives compassionate care and their caregivers are empowered with knowledge and support.
                </CardDescription>
                <a href="#vision" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="program-card bg-gray-100 border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-500" />
                </div>
                <CardTitle className="text-2xl font-poppins text-gray-800">Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4 text-base leading-relaxed">
                  To provide comprehensive training, resources, and support to caregivers while fostering dementia awareness in communities across India.
                </CardDescription>
                <a href="#mission-details" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="program-card bg-gray-100 border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-2xl font-poppins text-gray-800">Values</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-4 text-base leading-relaxed">
                  Compassion, dignity, empowerment, and community-centered care guide everything we do for elders and their families.
                </CardDescription>
                <a href="#values" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-up">
            <div className="flex justify-center items-center mb-4">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-3xl font-bold font-poppins">
                Trusted by 1,500+ caregivers & 800 families nationwide
              </h3>
              <Star className="w-8 h-8 text-yellow-400 ml-3" />
            </div>
            <a 
              href="#impact" 
              className="inline-flex items-center text-xl hover:text-orange-300 transition-colors underline-offset-4 hover:underline"
            >
              See Our Impact <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-poppins text-gray-800 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support for caregivers and families affected by dementia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="program-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <OptimizedImage
                src="/images/Caregivers/training.jpg"
                alt="Caregiver training session"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Caregiver Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Professional training programs to equip caregivers with essential skills and knowledge.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="program-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <OptimizedImage
                src="/images/Users/memory cafe.jpeg"
                alt="Memory cafe activities"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Memory Cafes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Social spaces where people with dementia and their families can connect and share experiences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="program-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <OptimizedImage
                src="/images/Brain Kit/kit.jpg"
                alt="Brain training kit"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle className="text-xl font-poppins">Brain Training Kits</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Cognitive stimulation tools and activities designed to support brain health and memory.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-poppins text-gray-800 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Making a difference in communities across India</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stat-number text-5xl font-bold text-teal-600 mb-2">1,500+</div>
              <p className="text-gray-700 font-medium">Trained Caregivers</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-5xl font-bold text-orange-500 mb-2">800</div>
              <p className="text-gray-700 font-medium">Families Supported</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-5xl font-bold text-teal-600 mb-2">50+</div>
              <p className="text-gray-700 font-medium">Training Sessions</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-5xl font-bold text-orange-500 mb-2">25</div>
              <p className="text-gray-700 font-medium">Cities Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <OptimizedImage
                  src="/images/shatam-care-foundation-logo.png"
                  alt="Shatam Care Foundation Logo"
                  width={60}
                  height={60}
                  className="w-15 h-15 mr-3"
                />
                <div>
                  <h3 className="font-bold text-xl">Shatam Care</h3>
                  <p className="text-gray-400 text-sm">Foundation</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Empowering caregivers and supporting families affected by dementia across India.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#mission" className="hover:text-teal-400 transition-colors">Our Mission</a></li>
                <li><a href="#programs" className="hover:text-teal-400 transition-colors">Programs</a></li>
                <li><a href="#impact" className="hover:text-teal-400 transition-colors">Impact</a></li>
                <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#volunteer" className="hover:text-teal-400 transition-colors">Volunteer</a></li>
                <li><a href="#donate" className="hover:text-teal-400 transition-colors">Donate</a></li>
                <li><a href="#partnerships" className="hover:text-teal-400 transition-colors">Partnerships</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
              <p className="text-gray-300 text-sm mb-4">Stay updated with our latest news and programs</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 text-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-r-md">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Shatam Care Foundation – Empowering Memory, Restoring Dignity.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
