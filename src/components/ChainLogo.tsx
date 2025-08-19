
import React from 'react';

interface ChainLogoProps {
  name: string;
  logo: string;
}

const ChainLogo: React.FC<ChainLogoProps> = ({ name, logo }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-coinomad-card rounded-2xl border border-coinomad-border p-4 transition-all duration-300 group-hover:border-coinomad-primary group-hover:neon-glow-primary">
        <img src={logo} alt={name} className="w-full h-full object-contain" />
      </div>
      <p className="mt-3 text-coinomad-textGray text-sm">{name}</p>
    </div>
  );
};

export default ChainLogo;
