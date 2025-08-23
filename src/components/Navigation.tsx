
import { Bell, ChevronDown, Search, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/Data/authAPI';
import { jwtDecode } from 'jwt-decode';
import Logo from './Logo';

// Add interface for JWT payload
interface JWTPayload {
  email: string;
  id: string; // This is the employerId
  iat: number;
  exp: number;
}

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', clickable: true },
    { name: 'Employees', path: '/employees', clickable: true },
    { name: 'Payroll', path: '/payroll', clickable: false },
    { name: 'Reports', path: '/reports', clickable: false },
    { name: 'Settings', path: '/settings', clickable: false }
  ];

  const handleSignOut = async () => {
    try {
      // Get the user ID from JWT token for the logout API
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode<JWTPayload>(token);
        
        // Call the logout API
        await authAPI.logout();
        
        // Clear all stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        
        // Navigate to login page
        navigate('/login');
      } else {
        // If no token, just clear storage and navigate
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage and navigate
      localStorage.clear();
      navigate('/login');
    }
  };

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
              {menuItems.map((item) => {
                const baseClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#ECE147] text-black' 
                    : 'text-[#B3B3B3] hover:text-white'
                }`;
                
                if (item.clickable) {
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={baseClasses}
                    >
                      {item.name}
                    </Link>
                  );
                } else {
                  return (
                    <div key={item.name} className="relative group">
                      <span
                        className={`${baseClasses} cursor-not-allowed opacity-60`}
                      >
                        {item.name}
                      </span>
                      {/* Coming Soon tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Coming Soon
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* Right side - Sign Out Button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-[#2C2C2C] bg-transparent text-[#B3B3B3] hover:text-white hover:bg-[#2C2C2C] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
