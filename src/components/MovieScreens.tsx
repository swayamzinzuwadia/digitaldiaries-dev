import React, { useEffect, useState } from "react";
import { MovieScreen } from "./MovieScreen";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";

interface Screen {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  features: string[];
}

export const MovieScreens: React.FC = () => {
  const [screens, setScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreens = async () => {
      const snapshot = await getDocs(collection(db, "screens"));
      const screensData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScreens(screensData);
      setLoading(false);
    };
    fetchScreens();
  }, []);

  // Pick 3 random screens to show
  const getRandomScreens = (screens: any[], count: number) => {
    if (screens.length <= count) return screens;
    const shuffled = [...screens].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const displayScreens = getRandomScreens(screens, 3);

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
    <section
      id="movie-screens"
      className="py-20 bg-gradient-to-b from-transparent to-pink-50/20 dark:to-pink-900/10"
    >
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
            Each location offers a unique romantic atmosphere designed to create
            unforgettable memories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayScreens.map((screen, index) => (
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
