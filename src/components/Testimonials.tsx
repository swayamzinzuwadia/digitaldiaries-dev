import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Quote } from 'lucide-react';
import { Card } from './ui/Card';

const testimonials = [
  {
    name: 'Sarah & Michael',
    location: 'New York',
    rating: 5,
    text: 'The hot air balloon experience was absolutely magical! The sunset views and champagne service made our anniversary unforgettable. Digital Diaries exceeded all our expectations.',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150',
    experience: 'Hot Air Balloon'
  },
  {
    name: 'Emma & James',
    location: 'California',
    rating: 5,
    text: 'Our beach movie night was pure romance! The sound of waves, the bonfire, and watching our favorite movie under the stars - it was like a dream come true.',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150',
    experience: 'Sandy Beach'
  },
  {
    name: 'Lisa & David',
    location: 'Florida',
    rating: 5,
    text: 'The poolside cinema was incredibly luxurious. The floating bar and ambient lighting created the perfect romantic atmosphere. We\'ll definitely be back!',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150',
    experience: 'Poolside'
  },
  {
    name: 'Rachel & Tom',
    location: 'Texas',
    rating: 5,
    text: 'Digital Diaries made our proposal night perfect! The garden setting with professional photography captured every magical moment. Highly recommended!',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150',
    experience: 'Park & Watch'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-pink-50/20 dark:to-pink-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Love Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from couples who created magical memories with Digital Diaries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location} • {testimonial.experience}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 text-pink-500/20" size={32} />
                  <p className="text-gray-600 dark:text-gray-300 italic pl-6">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center justify-end mt-4">
                  <Heart className="text-pink-500" size={16} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};