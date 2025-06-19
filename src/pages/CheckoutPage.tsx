import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import {
  Calendar,
  Clock,
  Package,
  CreditCard,
  QrCode,
  CheckCircle,
  Upload,
} from "lucide-react";
import { formatPrice } from "../lib/utils";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";

interface Booking {
  id: string;
  screenId: string;
  screenTitle: string;
  date: string;
  slot: string;
  package: string;
  price: number;
  status: "confirmed" | "pending" | "paid" | "cancelled";
  createdAt: any;
  paymentProof?: string;
}

export const CheckoutPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !user) {
        navigate("/bookings");
        return;
      }

      try {
        const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
        if (bookingDoc.exists()) {
          const bookingData = {
            id: bookingDoc.id,
            ...bookingDoc.data(),
          } as Booking;
          if (bookingData.userId === user.uid) {
            setBooking(bookingData);
          } else {
            navigate("/bookings");
          }
        } else {
          navigate("/bookings");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, user, navigate]);

  const handlePaymentSubmit = async () => {
    if (!booking || !paymentProof.trim()) {
      toast.error("Please paste the QR code or payment proof");
      return;
    }

    setUploading(true);
    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        paymentProof: paymentProof.trim(),
        paidAt: new Date(),
      });

      toast.success(
        "Payment proof submitted successfully! 🎉 Your booking will be confirmed by admin soon."
      );
      setBooking((prev) =>
        prev ? { ...prev, paymentProof: paymentProof.trim() } : null
      );
    } catch (error) {
      toast.error("Failed to submit payment proof");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <Button onClick={() => navigate("/bookings")}>
            Back to Bookings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete your romantic movie experience booking
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Booking Details
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Experience:
                  </span>
                  <span className="font-semibold">{booking.screenTitle}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Date:
                  </span>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-pink-500" />
                    <span className="font-semibold">{booking.date}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Time:
                  </span>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-pink-500" />
                    <span className="font-semibold">{booking.slot}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Package:
                  </span>
                  <div className="flex items-center">
                    <Package size={16} className="mr-2 text-pink-500" />
                    <span className="font-semibold">{booking.package}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Status:
                  </span>
                  <Badge
                    variant={
                      booking.status === "paid"
                        ? "success"
                        : booking.status === "confirmed"
                        ? "primary"
                        : booking.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-pink-500">
                    {formatPrice(booking.price)}
                  </span>
                </div>
                <a
                  href={`https://wa.me/919769530750?text=${encodeURIComponent(
                    `Hello, I have booked a romantic movie experience!%0A\n` +
                      `Experience: ${booking.screenTitle}\n` +
                      `Date: ${booking.date}\n` +
                      `Time: ${booking.slot}\n` +
                      `Package: ${booking.package}\n` +
                      `Status: ${booking.status}\n` +
                      `Total Amount: ${formatPrice(booking.price)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  <FaWhatsapp className="mr-2" size={20} /> Send Details via
                  WhatsApp
                </a>
              </div>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card>
              {/* Always show payment section unless admin confirms */}
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Payment Information
                </h2>

                <div className="mb-6">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <QrCode className="text-pink-500 mr-2" size={24} />
                      <h3 className="text-lg font-semibold">
                        Scan QR Code to Pay
                      </h3>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                        <QrCode size={120} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Scan this QR code with your payment app
                      </p>
                      <p className="text-lg font-bold text-pink-500 mt-2">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Upload className="inline mr-2" size={16} />
                      Paste Payment Proof / QR Code
                    </label>
                    <textarea
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      placeholder="Paste your payment confirmation code, transaction ID, or QR code data here..."
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-vertical"
                    />
                  </div>

                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={!paymentProof.trim() || uploading}
                    className="w-full"
                  >
                    {uploading ? "Submitting..." : "Submit Payment Proof"}
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    After payment, paste your transaction ID or payment
                    confirmation here. Our team will verify and confirm your
                    booking within 24 hours.
                  </p>
                </div>
              </>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
