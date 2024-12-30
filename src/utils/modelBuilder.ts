// utils/modelBuilder.ts
import * as tf from '@tensorflow/tfjs';

export async function buildAndSaveModel(): Promise<tf.LayersModel> {
  // Define model architecture
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    inputShape: [6], // 6 input metrics
    units: 12,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 8,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 4, // 4 output predictions
    activation: 'sigmoid'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError'
  });

  // Save model
  await model.save('file:///public/models/supply-chain-predictor.json');
  
  return model;
}