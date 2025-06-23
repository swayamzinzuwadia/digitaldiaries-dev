import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MovieScreen } from "../components/MovieScreen";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
// import { Search, Filter } from "lucide-react";
// import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface Screen {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity?: number;
  features: string[];
  packages?: any;
}

interface Booking {
  id: string;
  screenId: string;
  date: string;
  slot: string;
  status: string;
  paymentConfirmation?: boolean;
}

export const ScreensPage: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<Screen[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Dahisar");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const screensCollection = collection(db, "screens");
        const screensSnapshot = await getDocs(screensCollection);
        const screensData = screensSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Screen[];
        setScreens(screensData);
        setFilteredScreens(screensData);
      } catch (error) {
        console.log("Error fetching screens from db", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();

    // Fetch all bookings
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(db, "bookings");
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setBookings(bookingsData);
      } catch (error) {
        console.log("Error fetching bookings", error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = screens;
    filtered = filtered.filter(
      (screen) => screen.location === selectedLocation
    );
    setFilteredScreens(filtered);
  }, [selectedLocation, screens]);

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
            Discover our collection of romantic movie screening locations, each
            designed to create unforgettable moments
          </p>
        </motion.div>

        {/* Only Location Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-2xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 px-0 md:px-8">
            <div className="w-full md:w-auto flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <label className="font-medium mb-1 md:mb-0">Location:</label>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant={selectedLocation === "Dahisar" ? "primary" : "outline"}
                  size="sm"
                  className="w-1/2 md:w-auto px-3 py-1 text-sm"
                  onClick={() => setSelectedLocation("Dahisar")}
                >
                  Dahisar
                </Button>
                <Button
                  variant={selectedLocation === "Wadala" ? "primary" : "outline"}
                  size="sm"
                  className="w-1/2 md:w-auto px-3 py-1 text-sm"
                  onClick={() => setSelectedLocation("Wadala")}
                >
                  Wadala
                </Button>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <label className="font-medium mb-1 md:mb-0">Date:</label>
              <input
                type="date"
                className="px-2 py-1 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white w-full md:w-auto text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>
        </motion.div>
        <div className="mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700" />

        {/* Screens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MovieScreen
                {...screen}
                bookings={bookings}
                selectedDate={selectedDate}
                packages={screen.packages}
              />
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
              No screens found matching your criteria. Try adjusting your search
              or filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
