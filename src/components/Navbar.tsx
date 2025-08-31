
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-coinomad-background bg-opacity-90 backdrop-blur-md border-b border-coinomad-border' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li>
                <a href="#hero" className="text-coinomad-text hover:text-coinomad-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#chains" className="text-coinomad-text hover:text-coinomad-primary transition-colors">
                  Supported Chains
                </a>
              </li>
              <li>
                <a href="#why" className="text-coinomad-text hover:text-coinomad-primary transition-colors">
                  Why Us?
                </a>
              </li>
              <li>
                <a href="#faq" className="text-coinomad-text hover:text-coinomad-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
            
            <Button 
              onClick={() => {
                const element = document.getElementById('waitlist');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-coinomad-primary hover:bg-coinomad-primary text-black font-medium neon-glow-primary hover:scale-105 transition-transform duration-200"
            >
              Waitlist
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-coinomad-text focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-coinomad-card border-t border-coinomad-border">
          <div className="container mx-auto px-6 pt-4 pb-8">
            <ul className="space-y-6">
              <li>
                <a 
                  href="#hero" 
                  className="text-coinomad-text hover:text-coinomad-primary text-lg block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#chains" 
                  className="text-coinomad-text hover:text-coinomad-primary text-lg block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Supported Chains
                </a>
              </li>
              <li>
                <a 
                  href="#why" 
                  className="text-coinomad-text hover:text-coinomad-primary text-lg block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Why Us?
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="text-coinomad-text hover:text-coinomad-primary text-lg block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
              <li className="pt-2">
                <Button 
                  className="bg-coinomad-primary hover:bg-coinomad-primary text-black font-medium w-full neon-glow-primary hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    setIsMenuOpen(false);
                    const element = document.getElementById('waitlist');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Waitlist
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
