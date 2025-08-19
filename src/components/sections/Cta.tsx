
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Cta = () => {
  return (
    <section id="waitlist" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-coinomad-primary to-yellow-500 opacity-90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
            Join the Coinomad Waitlist
          </h2>
          <p className="text-black text-opacity-80 text-lg mb-10 md:text-xl">
            Be among the first to experience simple, reliable crypto payroll.
          </p>
          
          <iframe
            src="https://tally.so/r/3j2pQ4"
            width="100%"
            height="500"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Coinomad Waitlist Form"
            className="bg-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default Cta;
