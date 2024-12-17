import React from 'react';
import { Upload, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

const DataManagement: React.FC = () => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Data Management</h3>
      <div className="space-y-4">
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors">
          <Upload className="w-5 h-5" />
          Upload Supply Chain Data
        </button>
        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors">
          <Download className="w-5 h-5" />
          Export Analytics Report
        </button>
      </div>
    </motion.div>
  );
};

export default DataManagement;