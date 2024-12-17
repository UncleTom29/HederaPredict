import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({
  name,
  role,
  company,
  image,
  quote,
  index,
}) => {
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
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full mb-6 border-2 border-blue-500"
        />
        <p className="text-gray-300 text-lg mb-6 italic">{quote}</p>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
          <p className="text-gray-400">{role}</p>
          <p className="text-gray-400">{company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;