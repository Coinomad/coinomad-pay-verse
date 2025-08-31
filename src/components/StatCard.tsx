
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-coinomad-text mb-2">
        {value}
      </div>
      <div className="text-coinomad-textGray text-sm md:text-base">
        {label}
      </div>
    </div>
  );
};

export default StatCard;
