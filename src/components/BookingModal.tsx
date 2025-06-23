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
import { Calendar, Clock, Package, Star, Check, Crown, Gem } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenId: string;
  screenTitle: string;
  location: string;
  selectedSlot: string;
  selectedDate: string;
  packages: any;
}

const timeSlots = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  screenId,
  screenTitle,
  location,
  selectedSlot,
  selectedDate,
  packages,
}) => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] =
    useState<string>("gold");
  const [standardDuration, setStandardDuration] = useState<'2hr' | '3hr'>('2hr');
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

  // Helper to determine if selectedDate is a weekend
  const isWeekend = (() => {
    if (!selectedDate) return false;
    const date = new Date(selectedDate);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday=0, Saturday=6
  })();

  // Helper to get price for selected package and duration
  const getSelectedPrice = () => {
    if (!packages || !packages[selectedPackage]) return 0;
    if (selectedPackage === 'standard') {
      const pricing = packages.standard.pricing.filter((p: any) => p.label.toLowerCase().includes(standardDuration));
      // Pick weekday or weekend price
      const priceObj = pricing.find((p: any) => isWeekend ? p.label.toLowerCase().includes('weekend') : p.label.toLowerCase().includes('weekday'));
      return priceObj ? priceObj.price : 0;
    } else {
      // For other packages, pick weekend or weekday price
      const priceObj = packages[selectedPackage].pricing.find((p: any) => isWeekend ? p.label.toLowerCase().includes('weekend') : p.label.toLowerCase().includes('weekday'));
      return priceObj ? priceObj.price : 0;
    }
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
        duration: selectedPackage === 'standard' ? standardDuration : '3hr',
        price: getSelectedPrice(),
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

  const selectedPackageInfo = packages ? packages[selectedPackage] : null;
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
          <div className="flex flex-col gap-4">
            {packages && ["standard", "silver", "gold", "diamond"].map((key) => {
              const pkg = packages[key];
              if (!pkg) return null;
              // Icon and color for each package
              const iconMap: any = {
                standard: <Check className="text-gray-700 bg-gray-100 rounded-full p-1" size={32} />,
                silver: <Star className="text-yellow-500 bg-yellow-100 rounded-full p-1" size={32} />,
                gold: <Crown className="text-yellow-700 bg-yellow-200 rounded-full p-1" size={32} />,
                diamond: <Gem className="text-blue-500 bg-blue-100 rounded-full p-1" size={32} />,
              };
              const isSelected = selectedPackage === key;
              // Get price for display
              let displayPrice = 'N/A';
              if (key === 'standard' && isSelected) {
                displayPrice = `₹${getSelectedPrice()}`;
              } else if (pkg.pricing && Array.isArray(pkg.pricing)) {
                const priceObj = pkg.pricing.find((p: any) => isWeekend ? p.label?.toLowerCase().includes('weekend') : p.label?.toLowerCase().includes('weekday'));
                displayPrice = priceObj ? `₹${priceObj.price}` : 'N/A';
              }
              return (
                <div
                  key={key}
                  className={`flex flex-col w-full rounded-xl border-2 shadow-sm transition-all cursor-pointer focus:outline-none px-0
                    ${isSelected ? 'border-pink-500 bg-pink-900/10' : 'border-gray-700 bg-black/60 hover:border-pink-400'}
                  `}
                  onClick={() => setSelectedPackage(key as string)}
                >
                  <div className="flex items-center justify-between w-full px-6 py-4">
                    <div className="flex items-center gap-2">
                      {iconMap[key]}
                      <span className="font-bold text-lg capitalize text-white">{key}</span>
                    </div>
                    <div className="text-pink-400 font-bold text-2xl">{displayPrice}</div>
                  </div>
                  {key === 'standard' && isSelected && (
                    <div className="w-full px-6 pb-2 flex flex-col items-start">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Select Duration
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <span className="relative w-5 h-5">
                            <input
                              type="radio"
                              name="standardDuration"
                              value="2hr"
                              checked={standardDuration === '2hr'}
                              onChange={() => setStandardDuration('2hr')}
                              className="appearance-none w-5 h-5 rounded-full border-2 border-pink-500 bg-transparent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                            />
                            {standardDuration === '2hr' && (
                              <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-pink-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></span>
                            )}
                          </span>
                          <span className="text-xs text-white">2hr</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="relative w-5 h-5">
                            <input
                              type="radio"
                              name="standardDuration"
                              value="3hr"
                              checked={standardDuration === '3hr'}
                              onChange={() => setStandardDuration('3hr')}
                              className="appearance-none w-5 h-5 rounded-full border-2 border-pink-500 bg-transparent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                            />
                            {standardDuration === '3hr' && (
                              <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-pink-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></span>
                            )}
                          </span>
                          <span className="text-xs text-white">3hr</span>
                        </label>
                      </div>
                    </div>
                  )}
                  {/* Features/Inclusions inside each card */}
                  {pkg.inclusions && (
                    <ul className="flex flex-wrap gap-2 text-xs text-gray-200 px-6 pb-4">
                      {pkg.inclusions.map((feature: string, i: number) => (
                        <li key={i} className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 mb-1">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
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