import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import toast from "react-hot-toast";
import { formatPrice } from "../lib/utils";
import { Calendar, Clock, Package, Star } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenId: string;
  screenTitle: string;
  location: string;
  selectedSlot: string;
  selectedDate: string;
}

const packages = {
  gold: {
    name: "Gold",
    price: 1999,
    color: "bg-yellow-500",
    features: ["Basic Setup", "Movie Projector", "2 Chairs"],
  },
  diamond: {
    name: "Diamond",
    price: 2999,
    color: "bg-blue-500",
    features: [
      "Premium Setup",
      "HD Projector",
      "Luxury Seating",
      "Snacks Included",
    ],
  },
  platinum: {
    name: "Platinum",
    price: 3499,
    color: "bg-purple-500",
    features: [
      "Deluxe Setup",
      "4K Projector",
      "Premium Seating",
      "Gourmet Meal",
      "Photography Service",
    ],
  },
};

const timeSlots = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  screenId,
  screenTitle,
  location,
  selectedSlot,
  selectedDate,
}) => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] =
    useState<keyof typeof packages>("gold");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (date: string) => {
    if (!date) return;

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("screenId", "==", screenId),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);
    const booked = querySnapshot.docs.map((doc) => doc.data().slot);
  };

  const handleDateChange = (date: string) => {
    // This function is no longer used in the new implementation
  };

  const handleBooking = async () => {
    if (!user || !userData) {
      toast.error("Please sign in to book");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a slot");
      return;
    }
    setLoading(true);
    try {
      const bookingData = {
        userId: user.uid,
        userPhone: userData.phone,
        userName: userData.name,
        screenId,
        screenTitle,
        location,
        date: selectedDate,
        slot: selectedSlot,
        package: selectedPackage,
        price: packages[selectedPackage].price,
        coupon: coupon.trim() || null,
        createdAt: Timestamp.now(),
        status: "tentative",
        paymentConfirmation: false,
      };
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      toast.success("Booking confirmed! 🎉");
      onClose();
      navigate(`/checkout/${docRef.id}`);
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Sign In Required">
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please sign in to book your romantic movie experience.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  const selectedPackageInfo = packages[selectedPackage];
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${screenTitle}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto overflow-x-hidden">
        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Package className="inline mr-2" size={16} />
            Choose Package
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(packages).map(([key, pkg]) => (
              <button
                key={key}
                onClick={() => setSelectedPackage(key as keyof typeof packages)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPackage === key
                    ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${pkg.color}`} />
                    <span className="font-medium">{pkg.name}</span>
                  </div>
                  <span className="text-lg font-bold text-pink-500">
                    ₹{pkg.price}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pkg.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Coupon Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Coupon Code (optional)
          </label>
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="w-full"
          />
        </div>
        {/* Confirm Button */}
        <div>
          <Button className="w-full" onClick={handleBooking} disabled={loading}>
            {loading ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
