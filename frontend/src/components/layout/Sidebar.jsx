import React, { useEffect, useState } from 'react';
import { Home, Plane as Plant, BarChart2, Bell, Settings, X, Leaf, BookOpen, Lightbulb } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAlertCount } from '../../pages/Alerts'; // <-- Import the alert count function

const Sidebar = ({ currentRoute, setCurrentRoute, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      const count = await getAlertCount();
      if (mounted) setAlertCount(count);
    };
    fetchCount();
    return () => { mounted = false; };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { id: 'profiles', label: 'Plant Profiles', icon: <Plant size={20} />, path: '/profiles' },
    { id: 'history', label: 'Historical Data', icon: <BarChart2 size={20} />, path: '/history' },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { id: 'resources', label: 'Resources', icon: <BookOpen size={20} />, path: '/resources'},
    { id: 'plantinformation', label: 'Plant Information',  icon: <Lightbulb size={20} />, path: '/plantinformation' }
  ];

  const handleNavigation = (route, path) => {
    setCurrentRoute(route);
    navigate(path);
    if (isOpen) onClose();
  };

  const isActive = (path) => location.pathname === path;

  const sidebarClasses = `
    fixed lg:relative lg:translate-x-0 
    inset-y-0 left-0 z-40 w-64 
    bg-white border-r border-neutral-200 
    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    transition-transform duration-300 ease-in-out 
    flex flex-col
  `;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('dashboard', '/dashboard')}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-lg blur opacity-25"></div>
              <div className="relative bg-white rounded-lg p-2">
                <Leaf size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Smart
              </span>
              <span className="text-xl font-bold text-primary-dark">Grow</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-full hover:bg-neutral-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 pt-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    ${isActive(item.path)
                      ? 'bg-primary-light/10 text-primary font-medium'
                      : 'text-neutral-700 hover:bg-neutral-100'}
                    transition-colors duration-200
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'alerts' && alertCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-error/10 text-error rounded-full">
                      {alertCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-neutral-700">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
