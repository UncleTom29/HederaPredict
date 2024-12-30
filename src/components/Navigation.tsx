import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              HederaPredict
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            {/* <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link> */}
            <Link to="/dapp" className="text-gray-300 hover:text-white transition-colors">
              DApp
            </Link>
            {/* <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            {/* <Link
              to="/pricing"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link> */}
            <Link
              to="/dapp"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              DApp
            </Link>
            {/* <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;