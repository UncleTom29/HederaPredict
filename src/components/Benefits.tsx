import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Zap, LineChart } from 'lucide-react';

const benefits = [
  {
    title: 'Enhanced Transparency',
    description: 'Complete visibility into your supply chain operations with immutable records.',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Reduced Waste',
    description: 'Optimize resource allocation and minimize inefficiencies.',
    icon: Zap,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Faster Decision Making',
    description: 'Real-time insights enable quick, data-driven decisions.',
    icon: LineChart,
    color: 'from-orange-500 to-orange-600',
  },
];

const BenefitCard = ({ benefit, index }: { benefit: typeof benefits[0]; index: number }) => {
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
      className="bg-gray-800 rounded-xl p-8 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl" />
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-6`}>
          <benefit.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-4">{benefit.title}</h3>
        <p className="text-gray-400 text-lg">{benefit.description}</p>
      </div>
    </motion.div>
  );
};

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose HederaPredict
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Experience the advantages of blockchain-powered supply chain management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;