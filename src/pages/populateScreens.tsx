// src/components/PopulateScreens.jsx
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { Button } from "../components/ui/Button";

const screensData = [
  {
    id: "1",
    theme: "Park and Watch",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Car parked indoors, seats replaced with bed and TV.",
    features: ["Indoor Parking", "Bed", "TV"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 }, // 1500+950
        weekend: { "3hr": 2950 }, // 2000+950
        inclusions: [
          "Foil tag", "Balloon 🎈", "Cake 🎂", "Candle 🕯"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 }, // 1500+1950
        weekend: { "3hr": 3950 }, // 2000+1950
        inclusions: [
          "LED tag", "Balloon 🎈", "Cake 🎂", "Fog machine or Bubble machine", "Candle 🕯 set up", "🌼flowers"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 }, // 1500+2950
        weekend: { "3hr": 4950 }, // 2000+2950
        inclusions: [
          "Marry me proposal 💍 round set up", "Balloon 🎈", "Cake 🎂", "Walking in cloud", "Candles 🕯", "Flower 🌼", "Teepee setup", "Love ❤ bulb", "Light", "Wall ceiling balloon"
        ]
      },
      extraGuest: { "5-12": 400, "12+": 600 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "2",
    theme: "Cine Love",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    features: ["Grass", "Indoor", "Cozy Setup"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag", "Balloon 🎈", "Cake 🎂", "Candle 🕯"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag", "Balloon 🎈", "Cake 🎂", "Fog machine or Bubble machine", "Candle 🕯 set up", "🌼flowers"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal 💍 round set up", "Balloon 🎈", "Cake 🎂", "Walking in cloud", "Candles 🕯", "Flower 🌼", "Teepee setup", "Love ❤ bulb", "Light", "Wall ceiling balloon"
        ]
      },
      extraGuest: { "5-12": 400, "12+": 600 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "3",
    theme: "Sandy Screen",
    location: "Wadala",
    image:
      "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A sandy beach themed screen for a relaxed vibe.",
    features: ["Sand", "Beach Seating", "Stargazing"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag", "Balloon 🎈", "Cake 🎂", "Candle 🕯"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag", "Balloon 🎈", "Cake 🎂", "Fog machine or Bubble machine", "Candle 🕯 set up", "🌼flowers"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal 💍 round set up", "Balloon 🎈", "Cake 🎂", "Walking in cloud", "Candles 🕯", "Flower 🌼", "Teepee setup", "Love ❤ bulb", "Light", "Wall ceiling balloon"
        ]
      },
      extraGuest: { "5-12": 400, "12+": 600 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "4",
    theme: "Baywatch",
    location: "Wadala West",
    image: "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Greece-inspired romantic outdoor screening with floating elements.",
    features: ["Greece theme", "Floating hamper", "Floating lotus"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 2450, "3hr": 2950 },
        weekend: { "2hr": 2950, "3hr": 3450 },
        inclusions: ["Movie (OTT)", "Standard setup"]
      },
      silver: {
        persons: 2,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: ["LED Tag", "Fog Machine", "Cake", "Candle", "Floating basket", "Floating lotus"]
      },
      gold: {
        persons: 2,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: ["Marry Me setup", "Floating hamper", "Cake", "Candle", "Walking in cloud", "Lotus"]
      },
      extraGuest: { "any": 800 },
      complimentaryHamper: ["Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"]
    }
  },
  {
    id: "5",
    theme: "Dhoom",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Seating in a car with a TV and table.",
    features: ["Car Seating", "TV", "Table"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Candle"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Fog machine", "Candle setup", "Heart pathway"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal round ring setup or LED tag (B'dy, Anni, Better together, Bride to be)",
          "Balloon", "Cake", "Walking in cloud", "Candle setup", "Heart pathway"
        ]
      },
      extraGuest: { "5-12": 299, "12+": 499 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "6",
    theme: "Cine love",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Grassy indoor theme for cine lovers.",
    features: ["Grass", "Indoor", "Cozy Setup"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Candle"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Fog machine", "Candle setup", "Heart pathway"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal round ring setup or LED tag (B'dy, Anni, Better together, Bride to be)",
          "Balloon", "Cake", "Walking in cloud", "Candle setup", "Heart pathway"
        ]
      },
      extraGuest: { "5-12": 299, "12+": 499 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "7",
    theme: "Go Filmy",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A filmy themed screen for movie buffs.",
    features: ["Filmy Decor", "Movie Posters", "Cozy Setup"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Candle"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Fog machine", "Candle setup", "Heart pathway"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal round ring setup or LED tag (B'dy, Anni, Better together, Bride to be)",
          "Balloon", "Cake", "Walking in cloud", "Candle setup", "Heart pathway"
        ]
      },
      extraGuest: { "5-12": 299, "12+": 499 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "8",
    theme: "Cozy Nest",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Pool theme for a cozy nest experience.",
    features: ["Pool", "Ambient Lighting", "Loungers"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Candle"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Fog machine", "Candle setup", "Heart pathway"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal round ring setup or LED tag (B'dy, Anni, Better together, Bride to be)",
          "Balloon", "Cake", "Walking in cloud", "Candle setup", "Heart pathway"
        ]
      },
      extraGuest: { "5-12": 299, "12+": 499 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
  {
    id: "9",
    theme: "Fly High",
    location: "Dahisar",
    image:
      "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Hot air balloon themed screen for a unique date.",
    features: ["Hot Air Balloon", "Aerial Views", "Champagne Service"],
    packages: {
      standard: {
        persons: 2,
        weekday: { "2hr": 1500, "3hr": 2000 },
        weekend: { "2hr": 2000, "3hr": 2500 },
        inclusions: ["Basic setup", "Movie", "Complimentary hamper"]
      },
      silver: {
        persons: 4,
        weekday: { "3hr": 2450 },
        weekend: { "3hr": 2950 },
        inclusions: [
          "Foil tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Candle"
        ]
      },
      gold: {
        persons: 4,
        weekday: { "3hr": 3450 },
        weekend: { "3hr": 3950 },
        inclusions: [
          "LED tag (B'dy, Anni, better together, bride to be)",
          "Balloon", "Cake", "Fog machine", "Candle setup", "Heart pathway"
        ]
      },
      diamond: {
        persons: 4,
        weekday: { "3hr": 4450 },
        weekend: { "3hr": 4950 },
        inclusions: [
          "Marry me proposal round ring setup or LED tag (B'dy, Anni, Better together, Bride to be)",
          "Balloon", "Cake", "Walking in cloud", "Candle setup", "Heart pathway"
        ]
      },
      extraGuest: { "5-12": 299, "12+": 499 },
      complimentaryHamper: [
        "Dry Snacks", "Chocolates", "Juice", "Mineral Water", "Popcorn"
      ]
    }
  },
];

// Helper to transform packages to include a pricing array
function transformPackages(packages: any): any {
  const packageKeys = ["standard", "silver", "gold", "diamond"];
  const result: any = {};
  for (const key of packageKeys) {
    if (!packages[key]) continue;
    const pkg = { ...packages[key] };
    const pricing = [];
    if (pkg.weekday) {
      for (const duration in pkg.weekday) {
        pricing.push({
          label: `Weekday (${duration})`,
          price: pkg.weekday[duration],
        });
      }
    }
    if (pkg.weekend) {
      for (const duration in pkg.weekend) {
        pricing.push({
          label: `Weekend (${duration})`,
          price: pkg.weekend[duration],
        });
      }
    }
    pkg.pricing = pricing;
    result[key] = pkg;
  }
  return result;
}

const updateAllScreensPackages = async () => {
  const screensCollection = collection(db, "screens");
  const screensSnapshot = await getDocs(screensCollection);
  await Promise.all(
    screensSnapshot.docs.map((docSnap) => {
      const screen = screensData.find((s) => s.id === docSnap.id);
      if (screen && screen.packages) {
        // Transform packages before writing
        const transformedPackages = transformPackages(screen.packages);
        return setDoc(doc(db, "screens", docSnap.id), {
          ...docSnap.data(),
          packages: transformedPackages,
        }, { merge: true });
      }
      return Promise.resolve();
    })
  );
  console.log("All screens' packages updated!");
};

const PopulateScreens = () => {
  useEffect(() => {
    const populate = async () => {
      const existingDocs = await getDocs(collection(db, "screens"));
      if (!existingDocs.empty) {
        console.log("Screens collection already populated.");
        return;
      }
      await Promise.all(
        screensData.map((screen) =>
          setDoc(doc(db, "screens", screen.id), {
            ...screen,
            packages: transformPackages(screen.packages),
          })
        )
      );
      console.log("Screens populated!");
    };
    populate();
  }, []);

  return (
    <div className="my-4 text-center">
      <Button onClick={updateAllScreensPackages}>
        Update All Screens Packages (Cleanup)
      </Button>
    </div>
  );
};

export default PopulateScreens;
