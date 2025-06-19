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
}) => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] =
    useState<keyof typeof packages>("gold");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
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
    setBookedSlots(booked);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot("");
    checkAvailability(date);
  };

  const handleBooking = async () => {
    if (!user || !userData) {
      toast.error("Please sign in to book");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toast.error("Please select date and time");
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
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
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

        {/* Date Selection */}
        <div>
          <Input
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={minDate}
            required
          />
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Clock className="inline mr-2" size={16} />
              Choose Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedSlot(slot)}
                    disabled={isBooked}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSlot === slot
                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                        : isBooked
                        ? "border-red-300 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {slot}
                    {isBooked && (
                      <span className="block text-xs text-red-500 mt-1">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedSlot && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Booking Summary
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Screen:</span>
                <span className="font-medium">{screenTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{location}</span>
              </div>
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-medium">{selectedPackageInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-pink-500 pt-2 border-t">
                <span>Total:</span>
                <span>₹{selectedPackageInfo.price}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedSlot || loading}
            className="flex-1"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
