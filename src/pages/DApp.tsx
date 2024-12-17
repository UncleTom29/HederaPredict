import React, { useState } from 'react';
import { Wallet, Upload } from 'lucide-react';
import AnalyticsOverview from '../components/dapp/AnalyticsOverview';
import RecentTransactions from '../components/dapp/RecentTransactions';

const DApp = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    // Simulated wallet connection
    setIsWalletConnected(true);
    setWalletAddress('0.0.7938517');
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isWalletConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-8">
              Connect Your Wallet to Access HederaPredict
            </h2>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center mx-auto hover:bg-blue-700 transition-colors"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <div className="text-gray-300">
                  <span className="mr-2">Connected:</span>
                  <span className="text-blue-500">{walletAddress}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Supply Chain Health</h3>
                  <div className="text-3xl text-green-500">98%</div>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Active Predictions</h3>
                  <div className="text-3xl text-blue-500">12</div>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Data Points</h3>
                  <div className="text-3xl text-purple-500">1.2M</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Upload Supply Chain Data</h3>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-300">
                    Drag and drop your data files here, or click to select files
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Select Files
                  </button>
                </div>
              </div>

              {/* <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div className="text-gray-300">Transaction #{i}</div>
                      <div className="text-green-500">Confirmed</div>
                    </div>
                  ))}
                </div>
              </div> */}

              <div> 
                <RecentTransactions />
              </div>

            </div>

            <div>

    <AnalyticsOverview />
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DApp;