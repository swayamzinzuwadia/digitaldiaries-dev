import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingModal } from './BookingModal';

interface MovieScreenProps {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  features: string[];
}

export const MovieScreen: React.FC<MovieScreenProps> = ({
  id,
  theme,
  location,
  image,
  description,
  capacity,
  features
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="aspect-[4/5] min-h-[400px]"
      >
        <Card className="h-full flex flex-col overflow-hidden">
          <div className="relative h-48 overflow-hidden rounded-lg mb-4">
            <img
              src={image}
              alt={theme}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-pink-500 text-white">
                {theme}
              </Badge>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {theme} Experience
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="mr-2" />
                {location}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users size={16} className="mr-2" />
                Up to {capacity} guests
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock size={16} className="mr-2" />
                3-hour sessions
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="mt-auto">
              <Button 
                className="w-full"
                onClick={() => setShowBookingModal(true)}
              >
                Book This Experience
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        screenId={id}
        screenTitle={`${theme} Experience`}
      />
    </>
  );
};