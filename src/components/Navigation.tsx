
import { Bell, ChevronDown, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export const Navigation = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Employees', path: '/employees' },
    { name: 'Payroll', path: '/payroll' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <nav className="border-b border-[#2C2C2C] bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
               <div className="text-center ">
                  <Logo />
                </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[#ECE147] text-black' 
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          {/* <div className="flex items-center space-x-4">
            <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#9AE66E] rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-[#B3B3B3]" />
            </div>
          </div> */}
        </div>
      </div>
    </nav>
  );
};
