import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import PlantProfiles from './pages/PlantProfiles';
import HistoricalData from './pages/HistoricalData';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Create auth context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // In a real app, this would make an API call
    setIsAuthenticated(true);
    setUser({ email, name: email.split('@')[0] });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const AppLayout = ({ children }) => (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

        <footer className="py-4 px-6 border-t border-neutral-200 text-sm text-neutral-500 text-center">
          <p>© 2025 SmartGrow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlantProfiles />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HistoricalData />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Alerts />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
