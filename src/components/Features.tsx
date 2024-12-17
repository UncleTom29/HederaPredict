import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Brain, Truck } from 'lucide-react';

const features = [
  {
    title: 'Real-Time Data Integrity',
    description: 'Ensure data accuracy and transparency across your supply chain with blockchain-backed verification.',
    icon: Database,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'AI-Powered Disruption Prediction',
    description: 'Anticipate and mitigate supply chain disruptions with advanced machine learning algorithms.',
    icon: Brain,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Optimized Logistics Solutions',
    description: 'Streamline operations and reduce costs with intelligent routing and resource allocation.',
    icon: Truck,
    color: 'from-orange-500 to-orange-600',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
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
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Powerful Features for Modern Supply Chains
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform your supply chain with cutting-edge technology and predictive analytics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;