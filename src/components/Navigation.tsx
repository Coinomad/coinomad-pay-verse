
import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Search, LogOut, User, Settings, Menu } from 'lucide-react';
import { UserIcon } from "./icons";
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', clickable: true },
    { name: 'Employees', path: '/employees', clickable: true },
    { name: 'Payroll', path: '/payroll', clickable: true },
    { name: 'Reports', path: '/reports', clickable: true },
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
    <nav className="border-b border-[#2C2C2C] bg-[#1E1E1E]/50 rounded-[45px] backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-center ">
                <Logo />
              </div>
            </Link>
          </div>


          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const baseClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                ? 'text-[#ECE147]'
                : 'text-white hover:text-[#ECE147]'
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

          {/* Right side - Sign Out Button */}
          <div className="relative" ref={menuRef}>
            {/* Button that toggles the dropdown */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {/* <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-200">
                <Menu className="w-4 h-4" />
              </div> */}
              <ChevronDown
                className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="md:hidden">
                  {menuItems.map((item) => {
                    if (item.clickable) {
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            location.pathname === item.path
                              ? 'text-[#ECE147]'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      );
                    }
                    return (
                      <div
                        key={item.name}
                        className="flex items-center px-4 py-2 text-sm text-gray-400 cursor-not-allowed opacity-60"
                      >
                        {item.name}
                        <span className="ml-2 text-xs text-gray-400">(Soon)</span>
                      </div>
                    );
                  })}
                  <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
