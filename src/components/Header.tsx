import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <header className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="sticky-header-inner">
        <div className="sticky-header-logo">
          <Link to="/">
            <img 
              src="/images/shatam-care-foundation-logo.png" 
              alt="Shatam Care Foundation" 
              className="h-full w-auto"
            />
          </Link>
        </div>

        <nav className={`sticky-header-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/programs" className="nav-link">Programs</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </nav>

        <div className="sticky-header-actions">
          <Link to="/donate" className="btn-cta">
            Donate Now
          </Link>
        </div>

        <button
          className="lg:hidden ml-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
