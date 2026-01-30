import React from 'react';
import logo from '../assets/logo.png'
const Logo: React.FC = () => {
  return <div className="flex items-center justify-center">
      <img src={logo} alt="Coinomad Logo" className="h-8 md:h-10" />
    </div>;
};
export default Logo;