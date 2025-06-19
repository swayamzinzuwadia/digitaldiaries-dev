import React, { useEffect, useState } from 'react';
import { MovieScreen } from './MovieScreen';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'framer-motion';

interface Screen {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  features: string[];
}

// Default screens data (fallback if Firestore is not connected)
const defaultScreens: Screen[] = [
  {
    id: '1',
    theme: 'Hot Air Balloon',
    location: 'Skyline Valley',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Experience romance floating among the clouds with breathtaking aerial views.',
    capacity: 2,
    features: ['360° Views', 'Champagne Service', 'Sunset Timing', 'Professional Photos']
  },
  {
    id: '2',
    theme: 'Sandy Beach',
    location: 'Moonlight Shores',
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Watch movies under the stars with the sound of waves as your soundtrack.',
    capacity: 4,
    features: ['Ocean Breeze', 'Bonfire Setup', 'Beach Seating', 'Stargazing']
  },
  {
    id: '3',
    theme: 'Poolside',
    location: 'Villa Paradise',
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxury poolside cinema with ambient lighting and comfortable loungers.',
    capacity: 6,
    features: ['Pool Lighting', 'Floating Bar', 'Luxury Loungers', 'Poolside Service']
  },
  {
    id: '4',
    theme: 'Park & Watch',
    location: 'Central Gardens',
    image: 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Cozy outdoor movie experience surrounded by nature and fresh air.',
    capacity: 8,
    features: ['Garden Setting', 'Picnic Setup', 'Nature Sounds', 'Eco-Friendly']
  },
  {
    id: '5',
    theme: 'Grass',
    location: 'Meadow Hills',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Classic outdoor movie night on a beautiful grassy meadow under the stars.',
    capacity: 10,
    features: ['Open Field', 'Blanket Setup', 'Star Gazing', 'Meadow Picnic']
  }
];

export const MovieScreens: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>(defaultScreens);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const screensCollection = collection(db, 'screens');
        const screensSnapshot = await getDocs(screensCollection);
        
        if (!screensSnapshot.empty) {
          const screensData = screensSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Screen[];
          setScreens(screensData);
        }
      } catch (error) {
        console.log('Using default screens data');
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-transparent to-pink-50/20 dark:to-pink-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="movie-screens" className="py-20 bg-gradient-to-b from-transparent to-pink-50/20 dark:to-pink-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Choose Your Perfect Setting
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Each location offers a unique romantic atmosphere designed to create unforgettable memories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MovieScreen {...screen} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};