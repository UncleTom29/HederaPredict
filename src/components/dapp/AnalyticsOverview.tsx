// AnalyticsOverview.tsx
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PredictionData } from './types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Select,
  // SelectContent,
  // SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Props {
  predictions: PredictionData[];
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | 'ALL';

const AnalyticsOverview: React.FC<Props> = ({ predictions }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      '1D': 24 * 60 * 60 * 1000,
      '1W': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000,
      '3M': 90 * 24 * 60 * 60 * 1000,
      'ALL': Infinity
    };

    return predictions.filter(p => now - p.timestamp < ranges[timeRange]);
  }, [predictions, timeRange]);

  const chartData = useMemo(() => {
    return filteredData
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(p => ({
        timestamp: new Date(p.timestamp).toLocaleDateString(),
        disruptions: (p.predictions.expectedDisruptions * 100).toFixed(1),
        efficiency: (p.predictions.projectedEfficiency * 100).toFixed(1),
        cost: (p.predictions.estimatedCosts * 100).toFixed(1),
        risk: (p.predictions.riskScore * 100).toFixed(1),
        confidence: p.confidence.toFixed(1)
      }));
  }, [filteredData]);

  const metrics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const latest = filteredData[0];
    const average = filteredData.reduce((acc, curr) => ({
      risk: acc.risk + curr.predictions.riskScore,
      efficiency: acc.efficiency + curr.predictions.projectedEfficiency,
      disruptions: acc.disruptions + curr.predictions.expectedDisruptions,
      confidence: acc.confidence + curr.confidence
    }), { risk: 0, efficiency: 0, disruptions: 0, confidence: 0 });

    const count = filteredData.length;

    return {
      current: {
        risk: (latest.predictions.riskScore * 100).toFixed(1),
        efficiency: (latest.predictions.projectedEfficiency * 100).toFixed(1),
        disruptions: (latest.predictions.expectedDisruptions * 100).toFixed(1),
        confidence: latest.confidence.toFixed(1)
      },
      average: {
        risk: ((average.risk / count) * 100).toFixed(1),
        efficiency: ((average.efficiency / count) * 100).toFixed(1),
        disruptions: ((average.disruptions / count) * 100).toFixed(1),
        confidence: (average.confidence / count).toFixed(1)
      }
    };
  }, [filteredData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Supply Chain Performance Metrics</CardDescription>
          </div>
          <div className="flex space-x-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>{selectedMetric}</SelectValue>
              </SelectTrigger>
              {/* <SelectContent>
                <SelectItem key="all">All Metrics</SelectItem>
                <SelectItem key="disruptions">Disruptions</SelectItem>
                <SelectItem key="efficiency">Efficiency</SelectItem>
                <SelectItem key="cost">Cost</SelectItem>
                <SelectItem key="risk">Risk</SelectItem>
              </SelectContent> */}
            </Select>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue>{timeRange}</SelectValue>
              </SelectTrigger>
              {/* <SelectContent>
                <SelectItem key="1D">1D</SelectItem>
                <SelectItem key="1W">1W</SelectItem>
                <SelectItem key="1M">1M</SelectItem>
                <SelectItem key="3M">3M</SelectItem>
                <SelectItem key="ALL">ALL</SelectItem>
              </SelectContent> */}
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDisruptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  {(selectedMetric === 'all' || selectedMetric === 'disruptions') && (
                    <Area
                      type="monotone"
                      dataKey="disruptions"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorDisruptions)"
                      name="Disruptions (%)"
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'efficiency') && (
                    <Area
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorEfficiency)"
                      name="Efficiency (%)"
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'cost') && (
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorCost)"
                      name="Cost Optimization (%)"
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'risk') && (
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#colorRisk)"
                      name="Risk Score (%)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            {metrics && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Risk Score</div>
                      <div className="text-2xl text-amber-500">{metrics.current.risk}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-2xl text-blue-500">{metrics.current.efficiency}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Disruptions</div>
                      <div className="text-2xl text-red-500">{metrics.current.disruptions}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-2xl text-green-500">{metrics.current.confidence}%</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Period Averages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Avg Risk Score</div>
                      <div className="text-2xl text-amber-500">{metrics.average.risk}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Avg Efficiency</div>
                      <div className="text-2xl text-blue-500">{metrics.average.efficiency}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Avg Disruptions</div>
                      <div className="text-2xl text-red-500">{metrics.average.disruptions}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Avg Confidence</div>
                      <div className="text-2xl text-green-500">{metrics.average.confidence}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;