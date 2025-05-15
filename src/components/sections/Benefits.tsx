
import React from 'react';
import FeatureCard from '../FeatureCard';
import { Coins, Banknote, CalendarClock } from 'lucide-react';

const Benefits = () => {
  const features = [
    {
      icon: Coins,
      title: 'Multi-chain Support',
      description: 'Pay on Ethereum, Solana, Stellar & more. Seamless cross-chain operations.'
    },
    {
      icon: Banknote,
      title: 'No FX/Conversion Fees',
      description: 'Flat-fee crypto payroll — no hidden costs. Save on international transfers.'
    },
    {
      icon: CalendarClock,
      title: 'Automated Monthly Payments',
      description: 'Set once. Pay every month, stress-free. Reliable scheduling for your team.'
    }
  ];

  return (
    <section className="py-20 bg-coinomad-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Teams Choose Coinomad</h2>
          <p className="text-coinomad-textGray text-lg max-w-2xl mx-auto">
            Our platform offers unmatched features for crypto-native teams and DAOs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
