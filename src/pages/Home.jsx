import React from 'react';
import { Link } from 'react-router-dom';
import { Plane as Plant, Droplets, LineChart, Bell, Leaf } from 'lucide-react';
import VideoTeaser from '../components/home/VideoTeaser';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-lg blur opacity-25"></div>
                <div className="relative bg-white rounded-lg p-2">
                  <Leaf size={24} className="text-primary" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Smart
              </span>
              <span className="text-xl font-bold text-primary-dark">Grow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-neutral-600 hover:text-primary font-medium">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Intelligent Plant Care
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Monitor, automate, and optimize your plant care with SmartGrow's intelligent system. Perfect for home gardens and professional growers alike.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="btn btn-primary px-8 py-3">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline px-8 py-3">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Video Teaser Section */}
      <VideoTeaser />

      {/* Features */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Smarter Growing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <Plant className="text-primary mb-4 h-8 w-8" />
              <h3 className="text-lg font-semibold mb-2">Plant Profiles</h3>
              <p className="text-neutral-600">Customize care settings for each plant's unique needs.</p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <Droplets className="text-accent mb-4 h-8 w-8" />
              <h3 className="text-lg font-semibold mb-2">Auto Watering</h3>
              <p className="text-neutral-600">Smart watering based on real-time soil moisture data.</p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <LineChart className="text-warning mb-4 h-8 w-8" />
              <h3 className="text-lg font-semibold mb-2">Data Insights</h3>
              <p className="text-neutral-600">Track and analyze your plants' growth patterns.</p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <Bell className="text-error mb-4 h-8 w-8" />
              <h3 className="text-lg font-semibold mb-2">Smart Alerts</h3>
              <p className="text-neutral-600">Get notified when your plants need attention.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={24} className="text-primary-light" />
                <span className="text-xl font-bold">SmartGrow</span>
              </div>
              <p className="text-neutral-400">
                Intelligent plant monitoring and care automation system.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-neutral-400 hover:text-white">Login</Link></li>
                <li><Link to="/signup" className="text-neutral-400 hover:text-white">Sign Up</Link></li>
                <li><a href="#features" className="text-neutral-400 hover:text-white">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-neutral-400">
                Email: support@smartgrow.example<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2025 SmartGrow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;