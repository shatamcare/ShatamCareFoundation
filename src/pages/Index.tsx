
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Users, Brain, Award, ArrowRight, Calendar, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { initializeAnimations } from '@/utils/optimizedAnimations';
import OptimizedImage from '@/components/OptimizedImage';
import PerformanceMonitor from '@/components/PerformanceMonitor';

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const programsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    initializeAnimations({
      heroRef: heroRef.current,
      aboutRef: aboutRef.current,
      programsRef: programsRef.current,
      statsRef: statsRef.current,
    });
  }, []);

  return (
    <>
      <PerformanceMonitor />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <OptimizedImage
                  src="/images/shatam-care-foundation-logo.png"
                  alt="Shatam Care Foundation Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-gray-900">Shatam Care Foundation</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                <a href="#programs" className="text-gray-700 hover:text-blue-600 transition-colors">Programs</a>
                <a href="#team" className="text-gray-700 hover:text-blue-600 transition-colors">Team</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                <Button className="cta-button bg-blue-600 hover:bg-blue-700">Donate Now</Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/images/Users/care.jpg"
              alt="Caring for elderly"
              className="w-full h-full object-cover"
            />
            <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up">
              Empowering Elderly Lives with
              <span className="text-blue-300"> Compassionate Care</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 fade-in-up">
              Dedicated to enhancing the quality of life for elderly individuals through innovative programs, 
              community support, and dignified care services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up">
              <Button size="lg" className="cta-button bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3">
                Get Involved
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Seniors Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Caregivers Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-600">Years of Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Shatam Care Foundation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We are committed to transforming elderly care through innovative approaches, 
                community engagement, and unwavering dedication to dignity and respect.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <OptimizedImage
                  src="/images/Users/EHA.jpg"
                  alt="Elderly care activities"
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="h-8 w-8 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Care</h3>
                    <p className="text-gray-600">
                      Our approach centers on treating every elderly individual with the love, 
                      respect, and dignity they deserve.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Focus</h3>
                    <p className="text-gray-600">
                      Building strong support networks that connect families, caregivers, 
                      and community members in meaningful ways.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Brain className="h-8 w-8 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Holistic Wellness</h3>
                    <p className="text-gray-600">
                      Addressing physical, mental, and social well-being through 
                      comprehensive programs and activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section ref={programsRef} id="programs" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive initiatives designed to support elderly individuals 
                and their families at every stage of life.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Brain Kit/kit.jpg"
                    alt="Brain stimulation kit"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Brain Stimulation Kit</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Innovative cognitive tools designed to maintain and improve mental acuity 
                    through engaging exercises and activities.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Cognitive Health</Badge>
                </CardContent>
              </Card>

              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Caregivers/training.jpg"
                    alt="Caregiver training session"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Caregiver Training</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Comprehensive training programs for family members and professional 
                    caregivers to provide quality care with confidence.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Education</Badge>
                </CardContent>
              </Card>

              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Users/memory cafe.jpeg"
                    alt="Memory cafe gathering"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Memory Cafe</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Social gatherings that provide a supportive environment for individuals 
                    with memory challenges and their families.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Social Support</Badge>
                </CardContent>
              </Card>

              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Users/activities.jpg"
                    alt="Group activities"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Activity Programs</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Engaging recreational and therapeutic activities that promote 
                    physical health, mental stimulation, and social interaction.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Recreation</Badge>
                </CardContent>
              </Card>

              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Users/dementia care 1.jpg"
                    alt="Specialized dementia care"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Dementia Care</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Specialized support and resources for individuals living with 
                    dementia and their families, focusing on comfort and dignity.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Specialized Care</Badge>
                </CardContent>
              </Card>

              <Card className="program-card hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Caregivers/hospital.jpg"
                    alt="Health consultation"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3">Health Consultations</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    Regular health check-ups and consultations to monitor well-being 
                    and address medical concerns promptly.
                  </CardDescription>
                  <Badge variant="secondary" className="mb-2">Healthcare</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dedicated professionals committed to making a difference in elderly care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <OptimizedImage
                    src="/images/Team/Amrita.jpg"
                    alt="Dr. Amrita Behera"
                    className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                  />
                  <CardTitle className="text-xl">Dr. Amrita Behera</CardTitle>
                  <CardDescription>Founder & Director</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Passionate advocate for elderly rights with over 15 years of experience 
                    in geriatric care and community health initiatives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to make a difference? Contact us to learn more about our programs 
                or how you can get involved.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Bhubaneswar, Odisha, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@shatamcare.org</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <Facebook className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer" />
                    <Twitter className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer" />
                    <Instagram className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer" />
                    <Linkedin className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'd love to hear from you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <OptimizedImage
                    src="/images/shatam-care-foundation-logo.png"
                    alt="Shatam Care Foundation Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-xl font-bold">Shatam Care Foundation</span>
                </div>
                <p className="text-gray-400">
                  Empowering elderly lives with compassionate care and innovative solutions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
                  <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Programs</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Brain Stimulation Kit</li>
                  <li>Caregiver Training</li>
                  <li>Memory Cafe</li>
                  <li>Dementia Care</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Bhubaneswar, Odisha</li>
                  <li>+91 98765 43210</li>
                  <li>info@shatamcare.org</li>
                </ul>
              </div>
            </div>
            <Separator className="my-8 bg-gray-700" />
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Shatam Care Foundation. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
