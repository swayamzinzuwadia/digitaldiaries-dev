import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, MapPin, Package, CreditCard } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  screenId: string;
  screenTitle: string;
  date: string;
  slot: string;
  package: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: any;
}

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to view your bookings.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
            My Bookings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your romantic movie experiences
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-4">No Bookings Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't made any bookings yet. Start planning your romantic movie night!
              </p>
              <Link to="/screens">
                <Button>Browse Movie Screens</Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {booking.screenTitle}
                    </h3>
                    <Badge
                      variant={
                        booking.status === 'confirmed' ? 'success' :
                        booking.status === 'pending' ? 'warning' : 'error'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={16} className="mr-2 text-pink-500" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock size={16} className="mr-2 text-pink-500" />
                      {booking.slot}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Package size={16} className="mr-2 text-pink-500" />
                      {booking.package} Package
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CreditCard size={16} className="mr-2 text-pink-500" />
                      {formatPrice(booking.price)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/checkout/${booking.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {booking.status === 'confirmed' && (
                      <Link to={`/checkout/${booking.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          Pay Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};