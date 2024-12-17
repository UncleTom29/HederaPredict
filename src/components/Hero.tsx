import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import NetworkAnimation from './NetworkAnimation';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <NetworkAnimation />
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-bold text-white mb-6"
        >
          Revolutionize Supply Chains with
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> AI and DLT Transparency!</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          Harness the power of artificial intelligence and distributed ledger technology to transform your supply chain operations.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 group">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition-all duration-300">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;