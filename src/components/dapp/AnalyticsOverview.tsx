import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', disruptions: 65, efficiency: 78, cost: 85 },
  { name: 'Feb', disruptions: 59, efficiency: 82, cost: 82 },
  { name: 'Mar', disruptions: 45, efficiency: 85, cost: 78 },
  { name: 'Apr', disruptions: 42, efficiency: 87, cost: 75 },
  { name: 'May', disruptions: 38, efficiency: 89, cost: 72 },
  { name: 'Jun', disruptions: 35, efficiency: 91, cost: 70 }
];


const AnalyticsOverview = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Analytics Overview</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="disruptions" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorDisruptions)" 
              name="Disruptions"
            />
            <Area 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorEfficiency)" 
              name="Efficiency"
            />
            <Area 
              type="monotone" 
              dataKey="cost" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorCost)" 
              name="Cost Savings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Disruptions</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Efficiency</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-300">Cost Savings</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;