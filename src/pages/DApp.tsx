import React, { useState, useEffect } from 'react';
import { Wallet, Upload } from 'lucide-react';
import AnalyticsOverview from '../components/dapp/AnalyticsOverview';
import RecentTransactions from '../components/dapp/RecentTransactions';
import { DAppConnector, HederaSessionEvent, HederaJsonRpcMethod, HederaChainId } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const DApp = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connector, setConnector] = useState<DAppConnector | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const projectId = '0a4f8da85fc03a4b02efcbf34fb6b818';
        if (!projectId) {
          throw new Error('WalletConnect project ID not found');
        }

        const core = new Core({
          projectId,
          relayUrl: 'wss://relay.walletconnect.org',
        });

        await Web3Wallet.init({
          core,
          metadata: {
            name: "HederaPredict",
            description: "Supply Chain Prediction DApp",
            url: window.location.origin,
            icons: ["https://your-icon-url.com/icon.png"]
          }
        });

        const dAppConnector = new DAppConnector(
          {
            name: "HederaPredict",
            description: "Supply Chain Prediction DApp",
            url: window.location.origin,
            icons: ["https://your-icon-url.com/icon.png"]
          },
          LedgerId.TESTNET,
          projectId, 
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
          [HederaChainId.Testnet],
          { relayUrl: 'wss://relay.walletconnect.org' }
        );

        await dAppConnector.init();
        setConnector(dAppConnector);
        setConnectionError(null);

        // Check for existing sessions
        const existingSessions = dAppConnector.walletConnectClient?.session.getAll() || [];
        if (existingSessions.length > 0) {
          const lastSession = existingSessions[existingSessions.length - 1];
          const accountId = lastSession.namespaces.hedera?.accounts[0].split(':')[2];
          if (accountId) {
            setWalletAddress(accountId);
            setIsWalletConnected(true);
          }
        }

      } catch (error) {
        console.error('Error initializing DAppConnector:', error);
        setConnectionError(error instanceof Error ? error.message : 'Failed to initialize wallet connection');
      }
    };

    init();

    return () => {
      if (connector) {
        connector.disconnectAll();
      }
    };
  }, []);


  const connectWallet = async () => {
    if (!connector) {
      setConnectionError('Wallet connector not initialized');
      return;
    }

    try {
      const session = await connector.openModal();
      if (!session.namespaces.hedera?.accounts?.[0]) {
        throw new Error('No Hedera account found in session');
      }
      const accountId = session.namespaces.hedera.accounts[0].split(':')[2];
      setWalletAddress(accountId);
      setIsWalletConnected(true);
      setConnectionError(null);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };


  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isWalletConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-8">
              Connect Your Wallet to Access HederaPredict
            </h2>
            {connectionError && (
              <div className="text-red-500 mb-4">{connectionError}</div>
            )}
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center mx-auto hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!connector}
            >
              <Wallet className="mr-2 h-5 w-5" />
              {!connector ? 'Initializing...' : 'Connect Wallet'}
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