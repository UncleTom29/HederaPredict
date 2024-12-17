import React from "react";
import { motion } from "framer-motion";



const WalletConnect: React.FC = () => {

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-8">
          Connect Your Wallet to Access the DApp
        </h1>
        <button
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all duration-300"
        >
          Connect Wallet
        </button>
      </motion.div>
    </div>
  );
};

export default WalletConnect;
