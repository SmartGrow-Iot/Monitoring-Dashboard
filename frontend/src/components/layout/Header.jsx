import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, title, user, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left section - Mobile menu button and title */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 mr-3 rounded-lg text-neutral-500 hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        </div>

        {/* Right section - Notifications and User */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 relative"
            aria-label="View notifications"
            onClick={() => navigate('/alerts')}
          >
            <Bell size={20} />
            {/* Notification indicator */}
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error"></span>
          </button>
          
          <div className="ml-3 relative">
            <button
              className="flex items-center gap-2 text-sm rounded-full bg-neutral-100 p-1 pl-2 pr-3 hover:bg-neutral-200"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <User size={16} />
              </span>
              <span className="hidden sm:inline font-medium text-neutral-800">
                {user?.name || 'User'}
              </span>
            </button>

            {/* User menu dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <SettingsIcon size={16} />
                    Settings
                  </Link>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
