
import { useEffect } from 'react';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { initOptimizedAnimations, cleanupAnimations } from '@/utils/optimizedAnimations';

const Index = () => {
  useEffect(() => {
    // Initialize animations when component mounts
    initOptimizedAnimations();
    
    // Cleanup animations when component unmounts
    return () => {
      cleanupAnimations();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-50 to-sage-50">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl md:text-6xl font-bold text-white mb-6">
            Shatam Care Foundation
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Empowering lives through compassionate care and innovative solutions for dementia and elder care.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Our Programs
            </button>
            <button className="btn bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Get Involved
            </button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Our Programs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="program-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-primary">Dementia Care</h3>
              <p className="text-gray-600">
                Comprehensive support and care programs for individuals living with dementia and their families.
              </p>
            </div>
            <div className="program-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-primary">Caregiver Training</h3>
              <p className="text-gray-600">
                Professional training programs to equip caregivers with essential skills and knowledge.
              </p>
            </div>
            <div className="program-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-primary">Community Support</h3>
              <p className="text-gray-600">
                Building supportive communities through awareness programs and social initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-lavender-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-800">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="stat-number text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Families Supported</p>
            </div>
            <div>
              <div className="stat-number text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-gray-600">Caregivers Trained</p>
            </div>
            <div>
              <div className="stat-number text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600">Programs Conducted</p>
            </div>
            <div>
              <div className="stat-number text-4xl font-bold text-primary mb-2">₹10L+</div>
              <p className="text-gray-600">Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Shatam Care Foundation</h3>
          <p className="text-gray-400 mb-6">
            Together, we can make a difference in the lives of those who need care the most.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Programs</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
