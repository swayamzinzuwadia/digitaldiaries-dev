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
  capacity: number;
  features: string[];
}

interface Booking {
  id: string;
  screenId: string;
  date: string;
  slot: string;
  status: string;
  paymentConfirmation?: boolean;
}

export const defaultScreens: Screen[] = [
  // Wadala Screens
  {
    id: "1",
    theme: "Baywatch",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Screen with a pool for a unique movie experience.",
    capacity: 6,
    features: ["Pool", "Ambient Lighting", "Loungers"],
  },
  {
    id: "2",
    theme: "Sandy Screen",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A sandy beach themed screen for a relaxed vibe.",
    capacity: 4,
    features: ["Sand", "Beach Seating", "Stargazing"],
  },
  {
    id: "3",
    theme: "Park N Watch",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Car parked indoors, seats replaced with bed and TV.",
    capacity: 2,
    features: ["Indoor Parking", "Bed", "TV"],
  },
  {
    id: "4",
    theme: "Cine Lovers",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    capacity: 4,
    features: ["Grass", "Indoor", "Cozy Setup"],
  },
  // Dahisar Screens
  {
    id: "5",
    theme: "Cine Lovers",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    capacity: 4,
    features: ["Grass", "Indoor", "Cozy Setup"],
  },
  {
    id: "6",
    theme: "Cozy Nest",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Pool theme for a cozy nest experience.",
    capacity: 6,
    features: ["Pool", "Ambient Lighting", "Loungers"],
  },
  {
    id: "7",
    theme: "Fly High",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Hot air balloon themed screen for a unique date.",
    capacity: 2,
    features: ["Hot Air Balloon", "Aerial Views", "Champagne Service"],
  },
  {
    id: "8",
    theme: "DHOOM",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Seating in a car with a TV and table.",
    capacity: 2,
    features: ["Car Seating", "TV", "Table"],
  },
];

export const ScreensPage: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>(defaultScreens);
  const [filteredScreens, setFilteredScreens] =
    useState<Screen[]>(defaultScreens);
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

        if (screensSnapshot.empty) {
          // Populate Firestore with defaultScreens
          await Promise.all(
            defaultScreens.map((screen) =>
              setDoc(doc(db, "screens", screen.id), screen)
            )
          );
          // Fetch again after seeding
          const seededSnapshot = await getDocs(screensCollection);
          const screensData = seededSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Screen[];
          setScreens(screensData);
          setFilteredScreens(screensData);
        } else {
          const screensData = screensSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Screen[];
          setScreens(screensData);
          setFilteredScreens(screensData);
        }
      } catch (error) {
        console.log("Using default screens data");
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
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center"
        >
          <div className="flex gap-4 items-center">
            <label className="font-medium">Location:</label>
            <div className="flex gap-2">
              <Button
                variant={selectedLocation === "Dahisar" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation("Dahisar")}
              >
                Dahisar
              </Button>
              <Button
                variant={selectedLocation === "Wadala" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation("Wadala")}
              >
                Wadala
              </Button>
            </div>
            <label className="font-medium ml-6">Date:</label>
            <input
              type="date"
              className="px-3 py-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white ml-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              maxLength={10}
            />
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
              <MovieScreen
                {...screen}
                bookings={bookings}
                selectedDate={selectedDate}
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
