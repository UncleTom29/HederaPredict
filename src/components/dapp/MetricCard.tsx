import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import type { Metric } from '../../utils/metrics';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  metrics: Metric[];
}

const MetricCard: React.FC<MetricCardProps> = ({ title, icon: Icon, iconColor, metrics }) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between items-center">
            <span className="text-gray-400">{metric.label}</span>
            <span className={`font-semibold ${metric.color || 'text-white'}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricCard;