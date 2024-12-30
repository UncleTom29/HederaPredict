import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Wallet, Upload, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '../utils/ErrorBoundary';
import { LoadingState } from '../utils/LoadingState';
import AnalyticsOverview from '../components/dapp/AnalyticsOverview';
import RecentTransactions from '../components/dapp/RecentTransactions';
import { HederaService } from '../components/dapp/hederaService';
import { usePredictionModel } from '../components/dapp/predictionService';
import { processUploadedFiles } from '../utils/dataProcessing';
import { calculateConfidence } from '../utils/confidence';
import { PredictionData } from '../components/dapp/types';
import { LedgerId } from '@hashgraph/sdk';
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
import { Button } from '../components/ui/button';
import { DAppConnector, HederaSessionEvent, HederaJsonRpcMethod, HederaChainId } from '@hashgraph/hedera-wallet-connect';
import { ProcessingProgress } from '../components/dapp/types';
import { useToast } from '../components/ui/use-toast';

interface SaveData {
  privateKey: string;
  topic: string;
  pairingString: string;
  accountIds: string[];
}

const HEDERA_TOPIC_ID = '0.0.5332178';
const WALLET_CONNECT_PROJECT_ID = '0a4f8da85fc03a4b02efcbf34fb6b818';

const DApp: React.FC = () => {
  // State management
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hederaService, setHederaService] = useState<HederaService | null>(null);
  const [connector, setConnector] = useState<DAppConnector | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pairingData, setPairingData] = useState<SaveData | null>(null);

  // Custom hooks
  const { toast } = useToast();
  const { predictionService, isLoading: modelLoading, error: modelError } = usePredictionModel();

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

   // Update analytics metrics
   const updateMetrics = useCallback((predictions: PredictionData[]) => {
    const confirmed = predictions.filter(p => p.status === 'confirmed');
    setMetrics({
      totalPredictions: predictions.length,
      averageConfidence: predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length,
      successRate: (confirmed.length / predictions.length) * 100
    });
  }, []);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        if (!WALLET_CONNECT_PROJECT_ID) {
          throw new Error('WalletConnect project ID not found');
        }

        const dAppConnector = new DAppConnector(
          {
            name: "HederaPredict",
            description: "Supply Chain Prediction DApp",
            url: window.location.origin,
            icons: [`${window.location.origin}/logo.png`]
          },
          LedgerId.TESTNET,
          WALLET_CONNECT_PROJECT_ID, 
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
          [HederaChainId.Testnet],
          { relayUrl: 'wss://relay.walletconnect.org'}
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

        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize services';
        setError(errorMessage);
        console.error('Service initialization failed:', error);
      }
    };

    initializeServices();

    return () => {
      if (connector) {
        connector.disconnectAll();
      }
    };
  }, [connector]);

 

  // Initialize Hedera service when wallet is connected
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      const initHederaService = async () => {
        try {
          const hService = new HederaService(
            walletAddress,
            import.meta.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || '', // Using Vite env variable
            HEDERA_TOPIC_ID
          );

          setHederaService(hService);

          // Subscribe to prediction updates
          hService.subscribeToPredictions((data) => {
            setPredictions(prev => {
              const newPredictions = [data, ...prev];
              updateMetrics(newPredictions);
              return newPredictions;
            });
          });
        } catch (error) {
          console.error('Hedera service initialization failed:', error);
          toast({
            title: 'Error',
            description: 'Failed to initialize Hedera service. Please reconnect your wallet.',
            variant: 'destructive'
          });
        }
      };

      initHederaService();
    }
  }, [isWalletConnected, walletAddress, updateMetrics, toast]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !hederaService || !predictionService) {
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

      setUploadProgress({ progress: 90, stage: 'Submitting to Hedera...' });
      // Submit to Hedera
      const transactionId = await hederaService.submitPrediction(predictionData);
      
      // Update local state
      setPredictions(prev => {
        const newPredictions: PredictionData[] = [{
          ...predictionData,
          status: 'confirmed' as const,
          transactionId: transactionId.toString()
        }, ...prev];
        updateMetrics(newPredictions);
        return newPredictions;
      });

      setUploadProgress({ progress: 100, stage: 'Completed' });
      toast({
        title: 'Success',
        description: 'Prediction generated and stored on Hedera.',
      });
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process prediction. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({ progress: 0, stage: '' });
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!connector) {
      setError('Wallet connector not initialized');
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
      setError(null);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const isSystemLoading = !connector || modelLoading;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(error || modelError || connectionError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || modelError || connectionError}</AlertDescription>
            </Alert>
          )}

          {!isWalletConnected ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-white mb-8">
                Connect Your Wallet to Access HederaPredict
              </h2>
              <Button
                onClick={connectWallet}
                className="px-6 py-3 bg-blue-600"
                disabled={isSystemLoading}
              >
                <Wallet className="mr-2 h-5 w-5" />
                {isSystemLoading ? 'Initializing...' : 'Connect Wallet'}
              </Button>
            </div>
          ) : (
            <Suspense fallback={<LoadingState message="Loading dashboard..." />}>
              <div className="space-y-8">
                {/* Dashboard Header */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Dashboard</CardTitle>
                      <div className="text-sm text-gray-400">
                        Connected: <span className="text-blue-400">{walletAddress}</span>
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
                      <CardDescription>Please wait while we analyze your supply chain data</CardDescription>
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
                      <CardTitle>Upload Supply Chain Data</CardTitle>
                      <CardDescription>Upload CSV files containing your supply chain metrics</CardDescription>
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
                          Drag and drop your data files here, or click to select files
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

export default DApp;