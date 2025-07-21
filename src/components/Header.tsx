import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white/95 transition-shadow duration-300
      ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src="/images/shatam-care-foundation-logo.png" 
              alt="Shatam Care Foundation" 
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="font-medium text-gray-700 transition-colors hover:text-primary">Home</Link>
          <Link to="/about" className="font-medium text-gray-700 transition-colors hover:text-primary">About</Link>
          <Link to="/programs" className="font-medium text-gray-700 transition-colors hover:text-primary">Programs</Link>
          <Link to="/admin" className="font-medium text-gray-700 transition-colors hover:text-primary">Admin</Link>
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Link 
              to="/donate" 
              className="inline-block rounded-full bg-primary px-5 py-2 font-bold text-white no-underline transition-colors hover:bg-primary/90"
            >
              Donate Now
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="ml-2 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-4">
            <Link to="/" className="w-full py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="w-full py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/programs" className="w-full py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Programs</Link>
            <Link to="/admin" className="w-full py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
            <Link 
              to="/donate" 
              className="mt-4 w-full rounded-full bg-primary py-2 text-center font-bold text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donate Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;