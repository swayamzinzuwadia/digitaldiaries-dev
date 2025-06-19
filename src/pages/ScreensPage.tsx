import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MovieScreen } from '../components/MovieScreen';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface Screen {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  features: string[];
}

const defaultScreens: Screen[] = [
  {
    id: '1',
    theme: 'Hot Air Balloon',
    location: 'Skyline Valley',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Experience romance floating among the clouds with breathtaking aerial views and champagne service.',
    capacity: 2,
    features: ['360° Views', 'Champagne Service', 'Sunset Timing', 'Professional Photos']
  },
  {
    id: '2',
    theme: 'Sandy Beach',
    location: 'Moonlight Shores',
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Watch movies under the stars with the sound of waves as your romantic soundtrack.',
    capacity: 4,
    features: ['Ocean Breeze', 'Bonfire Setup', 'Beach Seating', 'Stargazing']
  },
  {
    id: '3',
    theme: 'Poolside',
    location: 'Villa Paradise',
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxury poolside cinema with ambient lighting and comfortable loungers for the perfect date night.',
    capacity: 6,
    features: ['Pool Lighting', 'Floating Bar', 'Luxury Loungers', 'Poolside Service']
  },
  {
    id: '4',
    theme: 'Park & Watch',
    location: 'Central Gardens',
    image: 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Cozy outdoor movie experience surrounded by nature and fresh air in a beautiful garden setting.',
    capacity: 8,
    features: ['Garden Setting', 'Picnic Setup', 'Nature Sounds', 'Eco-Friendly']
  },
  {
    id: '5',
    theme: 'Grass',
    location: 'Meadow Hills',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Classic outdoor movie night on a beautiful grassy meadow under the stars with cozy blanket setup.',
    capacity: 10,
    features: ['Open Field', 'Blanket Setup', 'Star Gazing', 'Meadow Picnic']
  },
  {
    id: '6',
    theme: 'Rooftop Terrace',
    location: 'City Heights',
    image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Urban romance with city skyline views and sophisticated ambiance for modern couples.',
    capacity: 4,
    features: ['City Views', 'Modern Setup', 'Wine Service', 'Urban Ambiance']
  }
];

export const ScreensPage: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>(defaultScreens);
  const [filteredScreens, setFilteredScreens] = useState<Screen[]>(defaultScreens);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
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
          setFilteredScreens(screensData);
        }
      } catch (error) {
        console.log('Using default screens data');
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  useEffect(() => {
    let filtered = screens;

    if (searchTerm) {
      filtered = filtered.filter(screen =>
        screen.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCapacity) {
      filtered = filtered.filter(screen => screen.capacity >= selectedCapacity);
    }

    setFilteredScreens(filtered);
  }, [searchTerm, selectedCapacity, screens]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Movie Screens
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our collection of romantic movie screening locations, each designed to create unforgettable moments
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search screens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedCapacity === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCapacity(null)}
            >
              All
            </Button>
            <Button
              variant={selectedCapacity === 2 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCapacity(2)}
            >
              Intimate (2)
            </Button>
            <Button
              variant={selectedCapacity === 4 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCapacity(4)}
            >
              Small Group (4+)
            </Button>
            <Button
              variant={selectedCapacity === 8 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCapacity(8)}
            >
              Large Group (8+)
            </Button>
          </div>
        </motion.div>

        {/* Screens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MovieScreen {...screen} />
            </motion.div>
          ))}
        </div>

        {filteredScreens.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No screens found matching your criteria. Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};