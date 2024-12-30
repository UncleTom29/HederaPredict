// modelGenerator.ts

import * as tf from '@tensorflow/tfjs';
import { writeFileSync } from 'fs';

async function generateAndSaveModel() {
  // Create a sequential model
  const model = tf.sequential();

  // Input layer - takes 6 features:
  // disruptions, efficiency, cost, leadTime, inventoryLevels, qualityScore
  model.add(tf.layers.dense({
    inputShape: [6],
    units: 32,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));

  // Hidden layers
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));

  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));

  // Output layer - predicts 4 values:
  // expectedDisruptions, projectedEfficiency, estimatedCosts, riskScore
  model.add(tf.layers.dense({
    units: 4,
    activation: 'sigmoid',
    kernelInitializer: 'glorotNormal'
  }));

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  // Save model architecture and weights
  const modelJson = model.toJSON();
  const modelConfig = {
    modelTopology: modelJson,
    weightsManifest: [{
      paths: ['supply-chain-weights.bin'],
      weights: await Promise.all(model.getWeights().map(w => w.data()))
    }]
  };

  // Save the model configuration
  writeFileSync(
    'public/models/supply-chain-predictor.json',
    JSON.stringify(modelConfig, null, 2)
  );

  return model;
}

// Generate and save the model
generateAndSaveModel();