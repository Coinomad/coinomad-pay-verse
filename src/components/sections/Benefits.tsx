
import React from 'react';
import FeatureCard from '../FeatureCard';
import { Coins, Banknote, CalendarClock, Wallet } from 'lucide-react';

const Benefits = () => {
  const features = [
    {
      icon: Coins,
      title: 'Multi-chain Support',
      description: 'Pay Employees on Ethereum, Base, Celo & Polygon. Seamless cross-chain operations with insanely low gas fees'
    },
    {
      icon: Banknote,
      title: 'Gasless Smart Accounts',
      description: 'Every team member gets a smart wallet (ERC-4337) powered by a paymaster. No need to buy ETH or MATIC — fees are paid in stablecoins.'
    },
    {
      icon: CalendarClock,
      title: 'Automated Payroll',
      description: 'Schedule payments to go out daily, weekly, or monthly. Focus on building, not spreadsheets and reminders.'
    },
    {
      icon: Wallet,
      title: 'USDC & Stablecoin First',
      description: 'Send payments in USDC, CUSD, or USDT. No volatility, just fast, stable payroll in your currency of choice.'
    }
  ];

  return (
    <section id="why" className="py-20 bg-coinomad-background">
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
