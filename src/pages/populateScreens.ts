// src/components/PopulateScreens.jsx
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";

const screensData = [
  {
    id: "1",
    theme: "Baywatch",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Screen with a pool for a unique movie experience.",
    features: ["Pool", "Ambient Lighting", "Loungers"],
  },
  {
    id: "2",
    theme: "Sandy Screen",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A sandy beach themed screen for a relaxed vibe.",
    features: ["Sand", "Beach Seating", "Stargazing"],
  },
  {
    id: "3",
    theme: "Park N Watch",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Car parked indoors, seats replaced with bed and TV.",
    features: ["Indoor Parking", "Bed", "TV"],
  },
  {
    id: "4",
    theme: "Cine Lovers",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    features: ["Grass", "Indoor", "Cozy Setup"],
  },
  {
    id: "5",
    theme: "Cine Lovers",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    features: ["Grass", "Indoor", "Cozy Setup"],
  },
  {
    id: "6",
    theme: "Cozy Nest",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Pool theme for a cozy nest experience.",
    features: ["Pool", "Ambient Lighting", "Loungers"],
  },
  {
    id: "7",
    theme: "Fly High",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Hot air balloon themed screen for a unique date.",
    features: ["Hot Air Balloon", "Aerial Views", "Champagne Service"],
  },
  {
    id: "8",
    theme: "DHOOM",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Seating in a car with a TV and table.",
    features: ["Car Seating", "TV", "Table"],
  },
];

const PopulateScreens = () => {
  useEffect(() => {
    const populate = async () => {
      const existingDocs = await getDocs(collection(db, "screens"));
      if (!existingDocs.empty) {
        console.log("Screens collection already populated.");
        return;
      }

      screensData.forEach(async (screen) => {
        await setDoc(doc(db, "screens", screen.id), screen);
      });

      console.log("Screens populated!");
    };

    populate();
  }, []);

  return null;
};

export default PopulateScreens;
