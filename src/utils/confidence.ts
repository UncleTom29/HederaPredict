// utils/confidence.ts
import { PredictionResults } from '../components/dapp/types';

export function calculateConfidence(predictions: PredictionResults): number {
  // Calculate confidence based on prediction variance and historical accuracy
  const predictionValues = [
    predictions.expectedDisruptions,
    predictions.projectedEfficiency,
    predictions.estimatedCosts,
    predictions.riskScore
  ];

  // Calculate variance of predictions
  const mean = predictionValues.reduce((a, b) => a + b, 0) / predictionValues.length;
  const variance = predictionValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / predictionValues.length;

  // Convert variance to confidence score (0-1)
  const confidenceFromVariance = 1 / (1 + variance);

  // Adjust confidence based on risk score
  const riskAdjustment = 1 - (predictions.riskScore * 0.5);

  // Combine factors (weight can be adjusted)
  return (confidenceFromVariance * 0.7 + riskAdjustment * 0.3) * 100;
}
