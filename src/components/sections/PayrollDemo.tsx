
import React from 'react';
import PayrollWidget from '../PayrollWidget';
import { Button } from '@/components/ui/button';

const PayrollDemo = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-coinomad-background to-black" id="pricing">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Calculate Your Team's Payroll</h2>
            <p className="text-coinomad-textGray text-lg mb-6">
              Easy to use, transparent pricing. No hidden fees or conversion costs. 
              Just a simple flat fee per transaction, regardless of amount or blockchain.
            </p>
            <p className="text-coinomad-textGray text-lg mb-8">
              Use our calculator to estimate your monthly payroll costs and see how much you could save.
            </p>
            <Button className="bg-coinomad-primary hover:bg-coinomad-primary text-black font-medium neon-glow-primary hover:scale-105 transition-transform duration-200">
              View Full Pricing
            </Button>
          </div>
          
          <div>
            <PayrollWidget />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayrollDemo;
