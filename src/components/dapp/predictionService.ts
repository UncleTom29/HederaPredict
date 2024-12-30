// src/components/dapp/usePredictionModel.ts
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { SupplyChainMetrics, PredictionResults } from './types';

export class TensorflowPredictionService {
  private model: tf.LayersModel | null = null;

  async initialize(): Promise<void> {
    try {
      // Create a simple model instead of loading from file
      const model = tf.sequential();
      
      model.add(tf.layers.dense({
        inputShape: [6],
        units: 12,
        activation: 'relu'
      }));
      
      model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
      }));
      
      model.add(tf.layers.dense({
        units: 4,
        activation: 'sigmoid'
      }));

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
      });

      this.model = model;
    } catch (error) {
      console.error('Failed to initialize prediction model:', error);
      throw new Error('Failed to initialize prediction model');
    }
  }

  async predict(metrics: SupplyChainMetrics): Promise<PredictionResults> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      // Convert metrics to tensor
      const inputTensor = tf.tensor2d([[
        metrics.disruptions,
        metrics.efficiency,
        metrics.cost,
        metrics.leadTime,
        metrics.inventoryLevels,
        metrics.qualityScore
      ]]);

      // Make prediction
      const prediction = await this.model.predict(inputTensor) as tf.Tensor;
      const values = await prediction.array() as number[][];

      // Cleanup
      inputTensor.dispose();
      prediction.dispose();

      // Return prediction results
      return {
        expectedDisruptions: values[0][0],
        projectedEfficiency: values[0][1],
        estimatedCosts: values[0][2],
        riskScore: values[0][3],
        recommendations: this.generateRecommendations(values[0])
      };
    } catch (error) {
      console.error('Prediction failed:', error);
      throw new Error('Failed to generate prediction');
    }
  }

  private generateRecommendations(predictions: number[]): string[] {
    const recommendations: string[] = [];

    // Generate recommendations based on prediction values
    if (predictions[0] > 0.7) {
      recommendations.push('High risk of disruptions detected. Consider diversifying suppliers.');
    }
    if (predictions[1] < 0.5) {
      recommendations.push('Efficiency metrics below target. Review process bottlenecks.');
    }
    if (predictions[2] > 0.8) {
      recommendations.push('Potential cost savings identified. Optimize resource allocation.');
    }
    if (predictions[3] > 0.6) {
      recommendations.push('Elevated risk detected. Implement additional monitoring measures.');
    }

    return recommendations;
  }
}

// Custom hook for using the prediction model
export function usePredictionModel() {
  const [predictionService, setPredictionService] = useState<TensorflowPredictionService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        const service = new TensorflowPredictionService();
        await service.initialize();
        setPredictionService(service);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize model');
      } finally {
        setIsLoading(false);
      }
    };

    initializeModel();
  }, []);

  return { predictionService, isLoading, error };
}