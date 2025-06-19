import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Gem } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatPrice } from '../lib/utils';

const packages = [
  {
    name: 'Gold',
    price: 299,
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    features: [
      'Basic Movie Setup',
      'HD Projector & Screen',
      '2 Comfortable Chairs',
      'Basic Snacks & Drinks',
      '3-Hour Experience',
      'Romantic Lighting'
    ],
    popular: false
  },
  {
    name: 'Diamond',
    price: 499,
    icon: Gem,
    color: 'text-blue-500',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    features: [
      'Premium Movie Setup',
      '4K Ultra HD Projector',
      'Luxury Seating for 2',
      'Gourmet Snacks & Beverages',
      '3-Hour Experience',
      'Ambient Lighting Design',
      'Welcome Champagne',
      'Personalized Playlist'
    ],
    popular: true
  },
  {
    name: 'Platinum',
    price: 799,
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    features: [
      'Deluxe Movie Setup',
      'Cinema-Grade 4K Projector',
      'Premium Seating & Blankets',
      'Fine Dining Experience',
      '4-Hour Experience',
      'Professional Photography',
      'Champagne & Wine Service',
      'Custom Decoration',
      'Personal Concierge',
      'Memory Photo Album'
    ],
    popular: false
  }
];

export const Packages: React.FC = () => {
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
            Choose Your Package
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the perfect package for your romantic movie experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full text-center bg-gradient-to-br ${pkg.bgColor} ${pkg.popular ? 'ring-2 ring-pink-500' : ''}`}>
                <div className="mb-6">
                  <pkg.icon className={`mx-auto ${pkg.color} mb-4`} size={48} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-pink-500 mb-2">
                    {formatPrice(pkg.price)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    per experience
                  </p>
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={pkg.popular ? 'primary' : 'outline'}
                >
                  Choose {pkg.name}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};