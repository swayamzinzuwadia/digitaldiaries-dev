import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './ui/Card';

const faqs = [
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 2-3 weeks in advance, especially for weekend dates and popular packages. However, we do accept last-minute bookings based on availability.'
  },
  {
    question: 'What happens if it rains?',
    answer: 'For outdoor experiences, we provide covered alternatives or can reschedule your booking at no extra cost. Indoor experiences like poolside venues have weather protection.'
  },
  {
    question: 'Can I customize my movie selection?',
    answer: 'Absolutely! You can choose from our curated romantic movie collection or bring your own favorite films. We support most digital formats and streaming services.'
  },
  {
    question: 'Are food and drinks included?',
    answer: 'It depends on your package. Gold includes basic snacks, Diamond includes gourmet options, and Platinum features fine dining. All packages include beverages.'
  },
  {
    question: 'Can I add extra guests?',
    answer: 'Each experience has a maximum capacity. You can add guests up to the limit for an additional fee. Contact us for group pricing and arrangements.'
  },
  {
    question: 'Do you provide photography services?',
    answer: 'Professional photography is included in our Platinum package and available as an add-on for other packages. We capture all your special moments.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, digital payments, and bank transfers. A 50% deposit is required to confirm your booking, with the balance due on the day of your experience.'
  },
  {
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Yes, you can cancel or reschedule up to 48 hours before your experience for a full refund. Cancellations within 48 hours are subject to a 50% fee.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our romantic movie experiences
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="cursor-pointer" onClick={() => toggleFAQ(index)}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="text-pink-500 flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-pink-500 flex-shrink-0" size={24} />
                  )}
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};