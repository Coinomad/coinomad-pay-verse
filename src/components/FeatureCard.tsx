
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col bg-coinomad-card rounded-lg p-6 border border-coinomad-border hover:border-coinomad-primary transition-all duration-300">
      <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center mb-5">
        <Icon className="text-coinomad-primary" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-coinomad-textGray">{description}</p>
    </div>
  );
};

export default FeatureCard;
