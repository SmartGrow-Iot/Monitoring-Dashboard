import React, { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { AuthContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
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
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <LogIn size={18} />
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50">
                Google
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50">
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
