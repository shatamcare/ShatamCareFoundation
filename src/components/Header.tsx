import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getImagePath } from '../utils/imagePaths';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Use the proper image path function
  const logoPath = getImagePath('images/Team/SC_LOGO-removebg-preview.png');

  // Check if we are on the homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (isHomePage) {
      // If we are on the homepage, just scroll
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 80; // Adjust if your header height is different
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to homepage and then scroll to section
      navigate('/');
      // Wait for navigation and then scroll
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const headerOffset = 80;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const navLinks = [
    { label: "Home", sectionId: "home" },
    { label: "Our Mission", sectionId: "mission" },
    { label: "Programs", sectionId: "programs" },
    { label: "Impact", sectionId: "impact" },
    { label: "Events", sectionId: "events" },
    { label: "Our Founder", sectionId: "founder" },
    { label: "Get Involved", sectionId: "contact" }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm transition-shadow duration-300
      ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo */}
        <div className="flex-shrink-0 ml-4">
          <Link to="/">
            <img 
              src={logoPath} 
              alt="Shatam Care Foundation" 
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={`#${link.sectionId}`} 
              onClick={(e) => handleNavClick(e, link.sectionId)}
              className="font-medium text-gray-700 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Link to="/admin" className="font-medium text-gray-700 transition-colors hover:text-primary">Admin</Link>
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                
                if (isHomePage) {
                  const section = document.getElementById('donate');
                  if (section) {
                    const headerOffset = 80;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                } else {
                  navigate('/');
                  setTimeout(() => {
                    const section = document.getElementById('donate');
                    if (section) {
                      const headerOffset = 80;
                      const elementPosition = section.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }, 100);
                }
              }}
              className="inline-block rounded-full bg-primary px-5 py-2 font-bold text-white no-underline transition-colors hover:bg-primary/90 cursor-pointer border-0"
            >
              Donate Now
            </button>
          </div>
          
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
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={`#${link.sectionId}`} 
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className="w-full py-2 text-lg"
              >
                {link.label}
              </a>
            ))}
            <Link to="/admin" className="w-full py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                
                if (isHomePage) {
                  const section = document.getElementById('donate');
                  if (section) {
                    const headerOffset = 80;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                } else {
                  navigate('/');
                  setTimeout(() => {
                    const section = document.getElementById('donate');
                    if (section) {
                      const headerOffset = 80;
                      const elementPosition = section.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }, 100);
                }
              }}
              className="mt-4 w-full rounded-full bg-primary py-2 text-center font-bold text-white border-0 cursor-pointer"
            >
              Donate Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;