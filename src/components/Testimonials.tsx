import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Supply Chain Director',
    company: 'Global Logistics Co.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    quote: 'HederaPredict has transformed our supply chain operations. The predictive analytics have helped us reduce costs by 30%.',
  },
  {
    name: 'Michael Chen',
    role: 'Operations Manager',
    company: 'Tech Solutions Inc.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    quote: 'The transparency and real-time insights provided by HederaPredict are game-changing. We have never been more efficient.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Logistics Coordinator',
    company: 'Fresh Foods Distribution',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    quote: 'Implementing HederaPredict was the best decision we made. Our supply chain visibility has improved dramatically.',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how HederaPredict is helping businesses transform their supply chains
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;