import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerChildren } from '../../utils/animations';
import { textColors } from '../../utils/colors';

interface Prediction {
  label: string;
  value: string;
  color: string;
  progress: number;
}

const predictions: Prediction[] = [
  {
    label: 'Demand Forecast',
    value: '+12% Expected',
    color: textColors.success,
    progress: 75,
  },
  {
    label: 'Supply Risk',
    value: 'Medium',
    color: textColors.warning,
    progress: 45,
  },
  {
    label: 'Cost Optimization',
    value: 'High Potential',
    color: textColors.info,
    progress: 85,
  },
];

const AIPredictions: React.FC = () => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-white mb-6">AI Predictions</h3>
      <motion.div variants={staggerChildren} className="space-y-4">
        {predictions.map((prediction) => (
          <motion.div
            key={prediction.label}
            variants={fadeInUp}
            className="bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{prediction.label}</span>
              <span className={prediction.color}>{prediction.value}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className={`${prediction.color.replace('text', 'bg')} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${prediction.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AIPredictions;