
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { images } from '@/assets/images';

const Hero = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-gradient min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
          Simplifying Crypto Payroll for Global Teams
        </h1>
        
        <p className="text-coinomad-textGray text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          Automated, fast, and borderless salary payments in stablecoins.
        </p>
        
        <div className="mb-16 flex justify-center">
          <Button 
            onClick={scrollToWaitlist}
            className="bg-coinomad-primary hover:bg-coinomad-primary text-black font-medium text-lg px-8 py-6 rounded-lg neon-glow-primary mr-4 hover:scale-105 transition-transform duration-200"
          >
            Get Started
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
        
        <div className="relative mx-auto max-w-3xl animate-float-slow">
          <div className="neon-glow-primary rounded-2xl overflow-hidden border border-coinomad-border">
            <img 
              src={images.heroIllustration} 
              alt="Crypto Payroll Illustration" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
