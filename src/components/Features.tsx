import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Shield, Clock, Camera, Utensils } from 'lucide-react';
import { Card } from './ui/Card';

const features = [
  {
    icon: Heart,
    title: 'Romantic Ambiance',
    description: 'Carefully curated settings designed to spark romance and create intimate moments.',
    color: 'text-pink-500'
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'High-definition projectors, surround sound, and luxury seating for the ultimate experience.',
    color: 'text-yellow-500'
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Exclusive private screenings ensuring complete privacy for you and your partner.',
    color: 'text-green-500'
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Choose from multiple time slots throughout the day to fit your perfect schedule.',
    color: 'text-blue-500'
  },
  {
    icon: Camera,
    title: 'Memory Capture',
    description: 'Professional photography services available to capture your special moments.',
    color: 'text-purple-500'
  },
  {
    icon: Utensils,
    title: 'Gourmet Dining',
    description: 'Exquisite dining options from romantic picnics to fine dining experiences.',
    color: 'text-orange-500'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-pink-50/20 to-transparent dark:from-pink-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Why Choose Digital Diaries?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We combine cutting-edge technology with romantic touches to create unforgettable experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <div className="mb-4">
                  <feature.icon className={`mx-auto ${feature.color}`} size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};