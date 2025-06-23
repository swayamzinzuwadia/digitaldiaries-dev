import React, { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { BookingModal } from "./BookingModal";

interface MovieScreenProps {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  capacity?: number;
  features: string[];
  bookings?: any[];
  selectedDate?: string;
  packages?: any;
}

const timeSlots = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];

export const MovieScreen: React.FC<MovieScreenProps> = ({
  id,
  theme,
  location,
  image,
  description,
  capacity,
  features,
  bookings = [],
  selectedDate = "",
  packages,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  // Get booked slots for this screen and date
  const getBookedSlots = () => {
    if (!selectedDate || !bookings) return [];

    return bookings
      .filter(
        (booking) =>
          booking.screenId === id &&
          booking.date === selectedDate &&
          booking.status === "confirmed" &&
          booking.paymentConfirmation === true
      )
      .map((booking) => booking.slot);
  };

  const bookedSlots = getBookedSlots();

  const handleSlotClick = (slot: string) => {
    if (bookedSlots.includes(slot)) return; // Don't allow clicking on booked slots
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="aspect-[4/5] min-h-[400px]"
      >
        <Card className="h-full flex flex-col overflow-hidden">
          <div className="relative h-48 overflow-hidden rounded-lg mb-4">
            <img
              src={image}
              alt={theme}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-pink-500 text-white">
                {theme}
              </Badge>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {theme} Experience
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="mr-2" />
                {location}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users size={16} className="mr-2" />
                Up to {capacity} guests
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock size={16} className="mr-2" />
                3-hour sessions
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* UI fallback for missing packages */}
            {!packages || Object.keys(packages).length === 0 ? (
              <div className="text-center text-red-500 font-semibold my-4">
                Package information is currently unavailable for this screen.
              </div>
            ) : (
              <>
                {/* Available Slots Section */}
                {selectedDate && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Slots for{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => handleSlotClick(slot)}
                            disabled={isBooked}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                              isBooked
                                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                                : "border-pink-300 bg-pink-50 text-pink-700 hover:border-pink-500 hover:bg-pink-100 dark:border-pink-600 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:border-pink-500 dark:hover:bg-pink-900/30"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  {!selectedDate && (
                    <Button className="w-full" disabled={true}>
                      Select Date to View Slots
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Only render BookingModal if packages exist */}
      {packages && Object.keys(packages).length > 0 && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          screenId={id}
          screenTitle={`${theme} Experience`}
          location={location}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          packages={packages}
        />
      )}
    </>
  );
};
