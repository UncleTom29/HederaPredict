// types.ts


export interface PredictionData {
  id: string;
  timestamp: number;
  supplyChainMetrics: SupplyChainMetrics;
  predictions: PredictionResults;
  confidence: number;
  status: 'pending' | 'confirmed' | 'failed';
  transactionId?: string;
}

export interface SupplyChainMetrics {
    disruptions: number;
    efficiency: number;
    cost: number;
    leadTime: number;
    inventoryLevels: number;
    qualityScore: number;
  }
  
  export interface PredictionResults {
    expectedDisruptions: number;
    projectedEfficiency: number;
    estimatedCosts: number;
    riskScore: number;
    recommendations: string[];
  }

  export interface ProcessingProgress {
    progress: number;
    stage?: string;
  }