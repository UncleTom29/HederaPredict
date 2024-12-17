import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '499',
    description: 'Perfect for small businesses',
    features: [
      'Real-time supply chain tracking',
      'Basic analytics dashboard',
      'Email support',
      '5 team members',
      '10,000 transactions/month',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Pro',
    price: '999',
    description: 'Ideal for growing companies',
    features: [
      'Everything in Basic',
      'Advanced AI predictions',
      'Priority support',
      '15 team members',
      '50,000 transactions/month',
    ],
    color: 'from-emerald-500 to-emerald-600',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'Dedicated support team',
      'Unlimited team members',
      'Unlimited transactions',
    ],
    color: 'from-purple-500 to-purple-600',
  },
];

const PricingCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
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
      className={`bg-gray-800 rounded-xl p-8 relative ${
        plan.popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
          Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 mb-6">{plan.description}</p>
      <div className="mb-8">
        <span className="text-4xl font-bold text-white">${plan.price}</span>
        {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
      </div>
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center text-gray-300">
            <Check className="w-5 h-5 text-emerald-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg bg-gradient-to-r ${plan.color} text-white font-semibold hover:opacity-90 transition-opacity`}
      >
        Get Started
      </button>
    </motion.div>
  );
};

const Pricing = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;