import React from 'react';
import logo from '../assets/logo.png'
const Logo: React.FC = () => {
  return <div className="flex items-center h-16 overflow-hidden">
      <img src={logo} alt="Coinomad Logo" className="h-[165px] w-[165px] object-contain" />
    </div>;
};
export default Logo;