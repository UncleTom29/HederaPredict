// utils/dataProcessing.ts
import { SupplyChainMetrics } from '../components/dapp/types';
import Papa from 'papaparse';
import _ from 'lodash';

interface ProcessedFile {
  metrics: SupplyChainMetrics;
  timestamp: number;
}

export async function processUploadedFiles(
  files: FileList,
  onProgress?: (progress: number, stage?: string) => void
): Promise<SupplyChainMetrics> {
  const processedFiles: ProcessedFile[] = [];
  let processedCount = 0;

  for (const file of Array.from(files)) {
    if (!file.name.endsWith('.csv')) {
      throw new Error('Only CSV files are supported');
    }

    onProgress?.(
      Math.round((processedCount / files.length) * 100),
      `Processing ${file.name}`
    );

    const processedData = await processCSVFile(file);
    processedFiles.push(processedData);
    
    processedCount++;
  }

  onProgress?.(100, 'Finalizing');
  return aggregateMetrics(processedFiles);
}

async function processCSVFile(file: File): Promise<ProcessedFile> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const metrics = calculateMetrics(results.data as CSVRow[]);
          resolve({
            metrics,
            timestamp: Date.now()
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
}

interface CSVRow {
  status: string;
  efficiency: string;
  // Add other fields as needed
}

interface SupplyChainDataRow extends CSVRow {
  cost?: number;
  plannedCost?: number;
  leadTime?: number;
  standardLeadTime?: number;
  inventory?: number;
  minInventory?: number;
  maxInventory?: number;
  quality?: number;
  defectRate?: number;
  returnRate?: number;
}

function calculateMetrics(data: CSVRow[]): SupplyChainMetrics {
  // Calculate metrics from raw data
  const disruptions = calculateDisruptions(data);
  const efficiency = calculateEfficiency(data);
  const cost = calculateCost(data);
  const leadTime = calculateLeadTime(data);
  const inventoryLevels = calculateInventory(data);
  const qualityScore = calculateQuality(data);

  return {
    disruptions,
    efficiency,
    cost,
    leadTime,
    inventoryLevels,
    qualityScore
  };
}

function calculateCost(data: SupplyChainDataRow[]): number {
  const costs = data.map(row => {
    const actualCost = parseFloat(row.cost?.toString() || '0');
    const planned = parseFloat(row.plannedCost?.toString() || '0');
    
    // If we don't have planned cost, assume it's the average of all actual costs
    const plannedCost = planned || _.mean(
      data
        .map(r => parseFloat(r.cost?.toString() || '0'))
        .filter(c => !isNaN(c))
    );

    if (isNaN(actualCost) || isNaN(plannedCost) || plannedCost === 0) {
      return 0;
    }

    // Calculate cost efficiency (1 means on budget, >1 means under budget, <1 means over budget)
    return plannedCost / actualCost;
  });

  // Remove any invalid values and calculate average cost efficiency
  const validCosts = costs.filter(c => c > 0);
  return validCosts.length > 0 ? _.mean(validCosts) : 0;
}

function calculateLeadTime(data: SupplyChainDataRow[]): number {
  const leadTimes = data.map(row => {
    const actual = parseFloat(row.leadTime?.toString() || '0');
    const standard = parseFloat(row.standardLeadTime?.toString() || '0');
    
    // If we don't have standard lead time, use the lowest lead time as the standard
    const standardLeadTime = standard || _.min(
      data
        .map(r => parseFloat(r.leadTime?.toString() || '0'))
        .filter(lt => !isNaN(lt) && lt > 0)
    );

    if (isNaN(actual) || isNaN(standardLeadTime as number) || (standardLeadTime as number) === 0) {
      return 0;
    }

    // Calculate lead time efficiency (1 means meeting standard, >1 means faster than standard)
    return (standardLeadTime ?? 0) / actual;
  });

  // Remove any invalid values and calculate average lead time efficiency
  const validLeadTimes = leadTimes.filter(lt => lt > 0);
  return validLeadTimes.length > 0 ? _.mean(validLeadTimes) : 0;
}

function calculateInventory(data: SupplyChainDataRow[]): number {
  const inventoryScores = data.map(row => {
    const level = parseFloat(row.inventory?.toString() || '0');
    const min = parseFloat(row.minInventory?.toString() || '0');
    const max = parseFloat(row.maxInventory?.toString() || '0');

    // If min/max not provided, calculate from data
    const minLevel = min || _.min(
      data
        .map(r => parseFloat(r.inventory?.toString() || '0'))
        .filter(i => !isNaN(i) && i > 0)
    ) || 0;
    
    const maxLevel = max || _.max(
      data
        .map(r => parseFloat(r.inventory?.toString() || '0'))
        .filter(i => !isNaN(i))
    ) || minLevel * 2; // If no max, assume 2x min

    if (isNaN(level) || maxLevel <= minLevel) {
      return 0;
    }

    // Calculate optimal inventory level
    const optimal = (minLevel + maxLevel) / 2;
    
    // Calculate how close the inventory is to optimal level (1 means optimal, 0 means at min or max)
    const deviation = Math.abs(level - optimal);
    const maxDeviation = optimal - minLevel;
    
    return Math.max(0, 1 - (deviation / maxDeviation));
  });

  // Remove any invalid values and calculate average inventory optimization score
  const validScores = inventoryScores.filter(score => score > 0);
  return validScores.length > 0 ? _.mean(validScores) : 0;
}

function calculateQuality(data: SupplyChainDataRow[]): number {
  const qualityScores = data.map(row => {
    // Direct quality score if available (assumed to be 0-100 or 0-1)
    const directScore = parseFloat(row.quality?.toString() || '0');
    if (!isNaN(directScore) && directScore > 0) {
      return directScore > 1 ? directScore / 100 : directScore;
    }

    // Calculate from defect and return rates if direct score not available
    const defectRate = parseFloat(row.defectRate?.toString() || '0');
    const returnRate = parseFloat(row.returnRate?.toString() || '0');

    if (isNaN(defectRate) && isNaN(returnRate)) {
      return 0;
    }

    // Convert rates to quality scores (1 - rate)
    const defectScore = isNaN(defectRate) ? 1 : Math.max(0, 1 - defectRate);
    const returnScore = isNaN(returnRate) ? 1 : Math.max(0, 1 - returnRate);

    // Combine scores (weighted average)
    const weights = {
      defect: 0.6, // Defect rate has higher impact
      return: 0.4
    };

    return (
      (defectScore * weights.defect) +
      (returnScore * weights.return)
    );
  });

  // Remove any invalid values and calculate average quality score
  const validScores = qualityScores.filter(score => score > 0);
  return validScores.length > 0 ? _.mean(validScores) : 0;
}

function calculateDisruptions(data: { status: string }[]): number {
  // Count number of disruption events
  return data.filter(row => row.status === 'disrupted').length / data.length;
}

function calculateEfficiency(data: { efficiency: string }[]): number {
  // Calculate average efficiency score
  const efficiencyScores = data.map(row => parseFloat(row.efficiency) || 0);
  return efficiencyScores.reduce((a, b) => a + b, 0) / efficiencyScores.length;
}

// Implement other metric calculation functions...

function aggregateMetrics(files: ProcessedFile[]): SupplyChainMetrics {
  // Aggregate metrics across all files
  const aggregated = files.reduce((acc, file) => ({
    disruptions: acc.disruptions + file.metrics.disruptions,
    efficiency: acc.efficiency + file.metrics.efficiency,
    cost: acc.cost + file.metrics.cost,
    leadTime: acc.leadTime + file.metrics.leadTime,
    inventoryLevels: acc.inventoryLevels + file.metrics.inventoryLevels,
    qualityScore: acc.qualityScore + file.metrics.qualityScore
  }), {
    disruptions: 0,
    efficiency: 0,
    cost: 0,
    leadTime: 0,
    inventoryLevels: 0,
    qualityScore: 0
  });

  // Average the metrics
  const count = files.length;
  return {
    disruptions: aggregated.disruptions / count,
    efficiency: aggregated.efficiency / count,
    cost: aggregated.cost / count,
    leadTime: aggregated.leadTime / count,
    inventoryLevels: aggregated.inventoryLevels / count,
    qualityScore: aggregated.qualityScore / count
  };
}