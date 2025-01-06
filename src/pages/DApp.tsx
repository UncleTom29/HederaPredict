import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Wallet, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { LoadingState } from '../utils/LoadingState';
import AnalyticsOverview from '../components/dapp/AnalyticsOverview';
import RecentTransactions from '../components/dapp/RecentTransactions';
import { HederaService } from '../components/dapp/hederaService';
import { usePredictionModel } from '../components/dapp/predictionService';
import { processUploadedFiles } from '../utils/dataProcessing';
import { calculateConfidence } from '../utils/confidence';
import { PredictionData } from '../components/dapp/types';
import { ContractFactory, NETWORK_CONFIGS } from '../utils/contractFactory';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';

interface ProcessingProgress {
  progress: number;
  stage: string;
}

type NetworkType = 'bscTestnet' | 'hederaTestnet';

interface ConnectWalletProps {
  onConnect: () => Promise<void>;
  onNetworkChange: (network: NetworkType) => Promise<void>;
  selectedNetwork: NetworkType;
  isConnecting: boolean;
  error: string | null;
}

const DApp: React.FC = () => {
  // State management
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('bscTestnet');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contractFactory, setContractFactory] = useState<ContractFactory | null>(null);
  const [hederaService, setHederaService] = useState<HederaService | null>(null);

  const [uploadProgress, setUploadProgress] = useState<ProcessingProgress>({
    progress: 0,
    stage: ''
  });

  // Analytics metrics
  const [metrics, setMetrics] = useState({
    totalPredictions: 0,
    averageConfidence: 0,
    successRate: 0,
  });

  // Custom hooks
  const { toast } = useToast();
  const { predictionService, isLoading: modelLoading, error: modelError } = usePredictionModel();

  // Initialize contract factory when network changes
  useEffect(() => {
    const factory = new ContractFactory(selectedNetwork);
    setContractFactory(factory);

    // Cleanup
    return () => {
      if (hederaService) {
        setHederaService(null);
      }
    };
  }, [selectedNetwork]);

  // Update analytics metrics
  const updateMetrics = useCallback((predictions: PredictionData[]) => {
    const confirmed = predictions.filter(p => p.status === 'confirmed');
    setMetrics({
      totalPredictions: predictions.length,
      averageConfidence: predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length,
      successRate: (confirmed.length / predictions.length) * 100
    });
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!contractFactory) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const address = await contractFactory.connect();
      setWalletAddress(address);
      setIsWalletConnected(true);

      // Initialize Hedera service if on Hedera network
      if (selectedNetwork === 'hederaTestnet') {
        const hService = new HederaService(address, '26ae987089d82cb00df8e728e61f84c2b6b019209ffbbd2df2b5c8c0e6410ce6', '0.0.5332178'); // Add your Hedera config
        setHederaService(hService);

        // Subscribe to prediction updates
        hService.subscribeToPredictions((data) => {
          setPredictions(prev => {
            const newPredictions = [data, ...prev];
            updateMetrics(newPredictions);
            return newPredictions;
          });
        });
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle network change
  const handleNetworkChange = async (network: NetworkType) => {
    setSelectedNetwork(network);
    setIsWalletConnected(false);
    setWalletAddress('');
    setError(null);
    
    if (hederaService) {
      setHederaService(null);
    }
    
    const factory = new ContractFactory(network);
    setContractFactory(factory);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !contractFactory || !predictionService) {
      return;
    }
  
    setIsLoading(true);
    setUploadProgress({ progress: 0, stage: 'Initializing...' });

    try {
      // Process files
      const metrics = await processUploadedFiles(
        event.target.files,
        (progress: number, stage?: string) => {
          setUploadProgress({ progress, stage: stage || 'Processing...' });
        }
      );

      setUploadProgress({ progress: 60, stage: 'Generating prediction...' });
      // Generate prediction
      const predictionResults = await predictionService.predict(metrics);
      
      setUploadProgress({ progress: 80, stage: 'Calculating confidence...' });
      // Calculate confidence
      const confidence = calculateConfidence(predictionResults);

      // Create prediction data
      const predictionData: PredictionData = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        supplyChainMetrics: metrics,
        predictions: predictionResults,
        confidence,
        status: 'pending'
      };

      if (selectedNetwork === 'hederaTestnet' && hederaService) {
        setUploadProgress({ progress: 90, stage: 'Submitting to Hedera...' });
        const transactionId = await hederaService.submitPrediction(predictionData);
        
        setPredictions(prev => {
          const newPredictions = [{
            ...predictionData,
            status: 'confirmed' as const,
            transactionId: transactionId.toString()
          }, ...prev];
          updateMetrics(newPredictions);
          return newPredictions;
        });
      } else {
        // Handle BSC submission
        setPredictions(prev => {
          const newPredictions = [predictionData, ...prev];
          updateMetrics(newPredictions);
          return newPredictions;
        });
      }

      setUploadProgress({ progress: 100, stage: 'Completed' });
      toast({
        title: 'Success',
        description: 'Prediction generated and stored.',
      });
    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process files',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({ progress: 0, stage: '' });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(error || modelError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || modelError}</AlertDescription>
            </Alert>
          )}

          {!isWalletConnected ? (
            <ConnectWallet 
              onConnect={connectWallet}
              onNetworkChange={handleNetworkChange}
              selectedNetwork={selectedNetwork}
              isConnecting={isConnecting}
              error={error}
            />
          ) : (
            <Suspense fallback={<LoadingState message="Loading dashboard..." />}>
              <div className="space-y-8">
                {/* Dashboard Header */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Dashboard</CardTitle>
                      <div className="text-sm text-gray-400">
                        Connected to {NETWORK_CONFIGS[selectedNetwork].name}: <span className="text-blue-400">{walletAddress}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Total Predictions</h3>
                        <div className="text-3xl text-blue-500">{metrics.totalPredictions}</div>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Avg. Confidence</h3>
                        <div className="text-3xl text-green-500">{metrics.averageConfidence.toFixed(1)}%</div>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Success Rate</h3>
                        <div className="text-3xl text-purple-500">{metrics.successRate.toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload and Processing */}
                {isLoading ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Data</CardTitle>
                      <CardDescription>Please wait while we analyze your data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={uploadProgress.progress} className="w-full" />
                      <p className="text-sm text-gray-400 mt-2">
                        {uploadProgress.progress}% complete
                        {uploadProgress.stage && ` - ${uploadProgress.stage}`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Data</CardTitle>
                      <CardDescription>Upload your files for processing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <input
                          type="file"
                          multiple
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-gray-300 hover:text-gray-100"
                        >
                          Drag and drop files here, or click to select
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Analytics and Transactions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Suspense fallback={<LoadingState message="Loading transactions..." />}>
                    <RecentTransactions predictions={predictions} />
                  </Suspense>
                  <Suspense fallback={<LoadingState message="Loading analytics..." />}>
                    <AnalyticsOverview predictions={predictions} />
                  </Suspense>
                </div>
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  onNetworkChange,
  selectedNetwork,
  isConnecting,
  error
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full"
      >
        <Wallet className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Select Network</label>
          <select
            value={selectedNetwork}
            onChange={(e) => onNetworkChange(e.target.value as NetworkType)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 mb-6"
            disabled={isConnecting}
          >
            <option value="bscTestnet">BSC Testnet</option>
            <option value="hederaTestnet">Hedera Testnet</option>
          </select>
        </div>

        <p className="text-gray-300 mb-8">
          Connect your wallet to access the platform.
        </p>
        
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 
            text-white rounded-full font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>
                Connect {selectedNetwork === 'hederaTestnet' ? 'Hedera' : 'BSC'} Wallet
              </span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default DApp;