import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, LineChart, BarChart, TrendingUp } from 'lucide-react';

const steps = [
  {
    title: 'Data Collection',
    description: 'Gather supply chain data from multiple sources in real-time',
    icon: Database,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Integrity Verification',
    description: `Validate and secure data using Hedera's distributed ledger`,
    icon: LineChart,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Predictive Insights',
    description: 'Generate AI-powered predictions and recommendations',
    icon: BarChart,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Optimization',
    description: 'Implement data-driven improvements across your supply chain',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600',
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      {index < steps.length - 1 && (
        <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-gray-800 to-transparent -translate-y-1/2 hidden lg:block" />
      )}
      <div className="bg-gray-800 rounded-xl p-6 relative z-10">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
          <step.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
        <p className="text-gray-400">{step.description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            How HederaPredict Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform combines blockchain technology with AI to deliver powerful supply chain insights
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;