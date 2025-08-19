
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import SupportedAssets from '@/components/sections/SupportedAssets';
import Benefits from '@/components/sections/Benefits';
import PayrollDemo from '@/components/sections/PayrollDemo';
import Trust from '@/components/sections/Trust';
import Security from '@/components/sections/Security';
import Faq from '@/components/sections/Faq';
import Cta from '@/components/sections/Cta';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-coinomad-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <SupportedAssets />
        <Benefits />
        <PayrollDemo />
        <Faq />
        <Cta/>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
