
// RecentTransactions.tsx
import React from 'react';
import { PredictionData } from './types';

interface Props {
  predictions: PredictionData[];
}

const RecentTransactions: React.FC<Props> = ({ predictions }) => {
  const recentPredictions = predictions.slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Predictions</h3>
      <div className="space-y-4">
        {recentPredictions.map((prediction) => (
          <div key={prediction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="text-gray-300">
              <div className="font-medium">
                Risk Score: {prediction.predictions.riskScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(prediction.timestamp).toLocaleString()}
              </div>
            </div>
            <div className={`text-${prediction.status === 'confirmed' ? 'green' : 'yellow'}-500`}>
              {prediction.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;