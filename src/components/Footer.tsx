
import React from 'react';
import Logo from './Logo';
import { Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black py-12 border-t border-coinomad-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-coinomad-textGray max-w-md">
              Simplifying crypto payroll for global teams. Automated, fast, and borderless salary payments in stablecoins.
            </p>
            <div className="mt-8 flex space-x-4">
              <a 
                href="https://twitter.com/coinomad_pay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-coinomad-textGray hover:text-coinomad-primary transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://linkedin.com/company/coinomad" 

                target="_blank" 
                rel="noopener noreferrer"
                className="text-coinomad-textGray hover:text-coinomad-primary transition-colors"
              >
                <Linkedin size={24} />
              </a>
            </div>
            <p className="mt-4 text-coinomad-textGray">
              &copy; {currentYear} Coinomad. All rights reserved.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
