
import React from 'react';
import StatCard from '../StatCard';

const Stats = () => {
  const stats = [
    {
      value: '4',
      label: 'EVM Chains Supported'
    },
    {
      value: '3',
      label: 'Stablecoins Supported'
    },
    {
      value: '0',
      label: 'Native Tokens Needed'
    },
    {
      value: '0%',
      label: 'Hidden FX/Conversion Fees'
    }
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
