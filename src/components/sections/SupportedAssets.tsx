
import React from 'react';
import ChainLogo from '../ChainLogo';
import { images } from '@/assets/images';

const SupportedAssets = () => {
  const chains = [
    { name: 'Base', logo: images.base },
    { name: 'Polygon', logo: images.polygon },
    { name: 'Celo', logo: images.celo },
    { name: 'Ethereum', logo: images.ethereum },
  ];

  const stablecoins = [
    { name: 'USDC', logo: images.usdc },
    { name: 'USDT', logo: images.usdt },
    { name: 'cUSD', logo: images.celo },
  ];

  return (
    <section id="chains" className="py-20 bg-gradient-to-b from-black to-coinomad-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Payments Across Chains</h2>
          <p className="text-coinomad-textGray text-lg max-w-2xl mx-auto">
            Support for multiple blockchains and stablecoins, making global payroll simple and efficient.
          </p>
        </div>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">Supported Blockchains</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center max-w-2xl mx-auto">
              {chains.map((chain) => (
                <ChainLogo key={chain.name} name={chain.name} logo={chain.logo} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">Supported Stablecoins</h3>
            <div className="grid grid-cols-3 gap-6 justify-items-center max-w-md mx-auto">
              {stablecoins.map((coin) => (
                <ChainLogo key={coin.name} name={coin.name} logo={coin.logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportedAssets;
