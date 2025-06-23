import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { formatPrice } from "../lib/utils";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const ADMIN_ID = "admin";
const ADMIN_PWD = "admin123!";

interface Screen {
  id: string;
  theme: string;
  location: string;
  image: string;
  description: string;
  features: string[];
}

interface Booking {
  id: string;
  screenTitle: string;
  date: string;
  slot: string;
  package: string;
  status: string;
  paymentConfirmation: boolean;
  userName: string;
  userPhone: string;
  userEmail: string;
  price: number;
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: any;
}

const packages = {
  standard: {
    name: "Standard",
    pricing: [
      { label: "Weekday (2hr)", price: 1500 },
      { label: "Weekday (3hr)", price: 2000 },
      { label: "Weekend (2hr)", price: 2000 },
      { label: "Weekend (3hr)", price: 2500 },
    ],
    persons: 2,
  },
  silver: {
    name: "Silver",
    pricing: [
      { label: "Weekday (3hr)", price: 2450 },
      { label: "Weekend (3hr)", price: 2950 },
    ],
    persons: 4,
  },
  gold: {
    name: "Gold",
    pricing: [
      { label: "Weekday (3hr)", price: 3450 },
      { label: "Weekend (3hr)", price: 3950 },
    ],
    persons: 4,
  },
  diamond: {
    name: "Diamond",
    pricing: [
      { label: "Weekday (3hr)", price: 4450 },
      { label: "Weekend (3hr)", price: 4950 },
    ],
    persons: 4,
  },
};

export const AdminPanel: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    userName: "",
    userPhone: "",
    userEmail: "",
    location: "",
    screenId: "",
    date: "",
    slot: "",
    package: "gold",
    paymentConfirmation: false,
  });
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<
    "requests" | "cancelled" | "users" | "confirmed"
  >("confirmed");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (loggedIn) {
      fetchBookings();
      fetchScreens();
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [loggedIn]);

  const fetchScreens = async () => {
    const snapshot = await getDocs(collection(db, "screens"));
    setScreens(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Screen))
    );
  };

  const fetchBookings = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "bookings"));
    setBookings(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking))
    );
    setLoading(false);
  };

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User))
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_ID && password === ADMIN_PWD) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleConfirmPayment = async (bookingId: string) => {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "confirmed",
      paymentConfirmation: true,
    });
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId: string) => {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "cancelled",
    });
    fetchBookings();
  };

  const handleRestoreBooking = async (bookingId: string) => {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "tentative",
    });
    fetchBookings();
  };

  const handleUndoPaymentConfirmation = async (bookingId: string) => {
    await updateDoc(doc(db, "bookings", bookingId), {
      paymentConfirmation: false,
      status: "tentative",
    });
    fetchBookings();
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if user exists by phone or email
      const usersRef = collection(db, "users");
      const userQuery = query(
        usersRef,
        where("phone", "==", newBooking.userPhone)
      );
      const emailQuery = query(
        usersRef,
        where("email", "==", newBooking.userEmail)
      );
      const [userSnapshot, emailSnapshot] = await Promise.all([
        getDocs(userQuery),
        getDocs(emailQuery),
      ]);

      let userId;
      if (userSnapshot.empty && emailSnapshot.empty) {
        // Create new user
        const newUserRef = doc(collection(db, "users"));
        await setDoc(newUserRef, {
          name: newBooking.userName,
          phone: newBooking.userPhone,
          email: newBooking.userEmail,
          createdAt: new Date(),
        });
        userId = newUserRef.id;
      } else {
        userId = !userSnapshot.empty
          ? userSnapshot.docs[0].id
          : emailSnapshot.docs[0].id;
      }

      // Get screen details
      const screenDoc = await getDoc(doc(db, "screens", newBooking.screenId));
      const screenData = screenDoc.data();

      // Create booking
      await addDoc(collection(db, "bookings"), {
        userId,
        userName: newBooking.userName,
        userPhone: newBooking.userPhone,
        userEmail: newBooking.userEmail,
        screenId: newBooking.screenId,
        screenTitle: screenData?.theme,
        location: screenData?.location,
        date: newBooking.date,
        slot: newBooking.slot,
        package: newBooking.package,
        price: packages[newBooking.package as keyof typeof packages].pricing[0].price,
        status: newBooking.paymentConfirmation ? "confirmed" : "tentative",
        paymentConfirmation: newBooking.paymentConfirmation,
        createdAt: new Date(),
      });

      setShowBookingModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-2 sm:px-4 max-w-full sm:max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button
            onClick={() => setShowBookingModal(true)}
            className="w-full sm:w-auto"
          >
            Create New Booking
          </Button>
        </div>

        {/* Location and Date Filter */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="font-medium">Filter by Location:</label>
          <select
            className="px-3 py-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            {Array.from(new Set(screens.map((s) => s.location))).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <label className="font-medium">Pick a Day:</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            maxLength={10}
          />
          {selectedDate && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-2"
              onClick={() => setSelectedDate("")}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors w-full sm:w-auto ${
              activeTab === "confirmed"
                ? "border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-900/10"
                : "border-transparent text-gray-500 bg-transparent"
            }`}
            onClick={() => setActiveTab("confirmed")}
          >
            Confirmed Bookings
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors w-full sm:w-auto ${
              activeTab === "requests"
                ? "border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-900/10"
                : "border-transparent text-gray-500 bg-transparent"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Booking Requests
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors w-full sm:w-auto ${
              activeTab === "cancelled"
                ? "border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-900/10"
                : "border-transparent text-gray-500 bg-transparent"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled Bookings
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors w-full sm:w-auto ${
              activeTab === "users"
                ? "border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-900/10"
                : "border-transparent text-gray-500 bg-transparent"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-8">
            {activeTab === "requests" && (
              <Card>
                <h2 className="text-xl font-bold mb-4">Booking Requests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 hidden sm:table-header-group">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Customer Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings
                        .filter((booking) => booking.status !== "cancelled")
                        .filter(
                          (booking) =>
                            !(
                              booking.status === "confirmed" &&
                              booking.paymentConfirmation === true
                            )
                        )
                        .filter((booking) => {
                          if (selectedLocation === "All") return true;
                          return booking.location === selectedLocation;
                        })
                        .filter((booking) => {
                          if (!selectedDate) return true;
                          return booking.date === selectedDate;
                        })
                        .map((booking) => (
                          <tr
                            key={booking.id}
                            className="block sm:table-row hover:bg-gray-50 dark:hover:bg-gray-800 mb-4 rounded-lg shadow-sm border w-full sm:mb-0 sm:rounded-none sm:shadow-none sm:border-0 sm:w-auto"
                          >
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Customer Details
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {booking.userName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {booking.userPhone}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Experience
                              </div>
                              {booking.screenTitle}
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Date & Time
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{booking.date}</span>
                                <span className="text-sm text-gray-500">
                                  {booking.slot}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Package
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm capitalize">
                                  {booking.package}
                                </span>
                                <span className="text-sm font-medium text-pink-600">
                                  {formatPrice(booking.price)}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Status
                              </div>
                              <div className="space-y-1">
                                <Badge
                                  variant={
                                    booking.status === "confirmed"
                                      ? "success"
                                      : booking.status === "tentative"
                                      ? "error"
                                      : booking.status === "cancelled"
                                      ? "error"
                                      : "secondary"
                                  }
                                >
                                  {booking.status.charAt(0).toUpperCase() +
                                    booking.status.slice(1)}
                                </Badge>
                                <Badge
                                  variant={
                                    booking.paymentConfirmation
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {booking.paymentConfirmation
                                    ? "Paid"
                                    : "Payment Pending"}
                                </Badge>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Action
                              </div>
                              {!booking.paymentConfirmation && (
                                <Button
                                  onClick={() =>
                                    handleConfirmPayment(booking.id)
                                  }
                                  size="sm"
                                  variant="primary"
                                  className="w-full sm:w-auto mb-2 sm:mb-0"
                                >
                                  Confirm Payment
                                </Button>
                              )}
                              {booking.paymentConfirmation && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={() =>
                                      handleUndoPaymentConfirmation(booking.id)
                                    }
                                    size="sm"
                                    variant="warning"
                                    className="w-full sm:w-auto"
                                  >
                                    Undo Payment Confirmation
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    size="sm"
                                    variant="error"
                                    className="w-full sm:w-auto"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                              {!booking.paymentConfirmation && (
                                <Button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  size="sm"
                                  variant="error"
                                  className="w-full sm:w-auto mt-2 sm:mt-0"
                                >
                                  Cancel
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
            {activeTab === "confirmed" && (
              <Card>
                <h2 className="text-xl font-bold mb-4">Confirmed Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 hidden sm:table-header-group">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Customer Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings
                        .filter(
                          (booking) =>
                            booking.status === "confirmed" &&
                            booking.paymentConfirmation === true
                        )
                        .filter((booking) => {
                          if (selectedLocation === "All") return true;
                          return booking.location === selectedLocation;
                        })
                        .filter((booking) => {
                          if (!selectedDate) return true;
                          return booking.date === selectedDate;
                        })
                        .map((booking) => (
                          <tr
                            key={booking.id}
                            className="block sm:table-row hover:bg-gray-50 dark:hover:bg-gray-800 mb-4 rounded-lg shadow-sm border w-full sm:mb-0 sm:rounded-none sm:shadow-none sm:border-0 sm:w-auto"
                          >
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Customer Details
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {booking.userName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {booking.userPhone}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Experience
                              </div>
                              {booking.screenTitle}
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Date & Time
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{booking.date}</span>
                                <span className="text-sm text-gray-500">
                                  {booking.slot}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Package
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm capitalize">
                                  {booking.package}
                                </span>
                                <span className="text-sm font-medium text-pink-600">
                                  {formatPrice(booking.price)}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Status
                              </div>
                              <Badge variant="success">Confirmed</Badge>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <Button
                                onClick={() =>
                                  handleUndoPaymentConfirmation(booking.id)
                                }
                                size="sm"
                                variant="warning"
                                className="w-full sm:w-auto"
                              >
                                Undo Payment Confirmation
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
            {activeTab === "cancelled" && (
              <Card>
                <h2 className="text-xl font-bold mb-4">Cancelled Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 hidden sm:table-header-group">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Customer Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings
                        .filter((booking) => booking.status === "cancelled")
                        .filter((booking) => {
                          if (selectedLocation === "All") return true;
                          return booking.location === selectedLocation;
                        })
                        .filter((booking) => {
                          if (!selectedDate) return true;
                          return booking.date === selectedDate;
                        })
                        .map((booking) => (
                          <tr
                            key={booking.id}
                            className="block sm:table-row hover:bg-gray-50 dark:hover:bg-gray-800 mb-4 rounded-lg shadow-sm border w-full sm:mb-0 sm:rounded-none sm:shadow-none sm:border-0 sm:w-auto"
                          >
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Customer Details
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {booking.userName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {booking.userPhone}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Experience
                              </div>
                              {booking.screenTitle}
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Date & Time
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{booking.date}</span>
                                <span className="text-sm text-gray-500">
                                  {booking.slot}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Package
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm capitalize">
                                  {booking.package}
                                </span>
                                <span className="text-sm font-medium text-pink-600">
                                  {formatPrice(booking.price)}
                                </span>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Status
                              </div>
                              <div className="space-y-1">
                                <Badge variant="error">Cancelled</Badge>
                              </div>
                            </td>
                            <td className="block sm:table-cell px-4 py-4 w-full sm:w-auto">
                              <div className="sm:hidden text-xs font-semibold text-gray-500 mb-1">
                                Action
                              </div>
                              <Button
                                onClick={() => handleRestoreBooking(booking.id)}
                                size="sm"
                                variant="success"
                                className="w-full sm:w-auto"
                              >
                                Restore
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
            {activeTab === "users" && (
              <Card>
                <h2 className="text-xl font-bold mb-4">All Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.phone}</td>
                          <td className="px-4 py-3">
                            {user.createdAt
                              ? user.createdAt.seconds
                                ? new Date(
                                    user.createdAt.seconds * 1000
                                  ).toLocaleString()
                                : user.createdAt.toString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Create New Booking"
        >
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <select
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              value={newBooking.location}
              onChange={(e) =>
                setNewBooking((prev) => ({
                  ...prev,
                  location: e.target.value,
                  screenId: "",
                }))
              }
              required
            >
              <option value="">Select Location</option>
              {Array.from(new Set(screens.map((s) => s.location))).map(
                (loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                )
              )}
            </select>
            <Input
              label="Customer Name"
              value={newBooking.userName}
              onChange={(e) =>
                setNewBooking((prev) => ({ ...prev, userName: e.target.value }))
              }
              required
              className="bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <Input
              label="Phone Number"
              value={newBooking.userPhone}
              onChange={(e) =>
                setNewBooking((prev) => ({
                  ...prev,
                  userPhone: e.target.value,
                }))
              }
              required
              className="bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <Input
              label="Email ID"
              type="email"
              value={newBooking.userEmail}
              onChange={(e) =>
                setNewBooking((prev) => ({
                  ...prev,
                  userEmail: e.target.value,
                }))
              }
              required
              className="bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <select
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              value={newBooking.screenId}
              onChange={(e) =>
                setNewBooking((prev) => ({ ...prev, screenId: e.target.value }))
              }
              required
              disabled={!newBooking.location}
            >
              <option value="">
                {!newBooking.location
                  ? "Select location first"
                  : "Select Experience"}
              </option>
              {screens
                .filter((s) => s.location === newBooking.location)
                .map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.theme}
                  </option>
                ))}
            </select>
            <Input
              type="date"
              label="Date"
              value={newBooking.date}
              onChange={(e) =>
                setNewBooking((prev) => ({ ...prev, date: e.target.value }))
              }
              min={new Date().toISOString().split("T")[0]}
              required
              className="bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <select
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              value={newBooking.slot}
              onChange={(e) =>
                setNewBooking((prev) => ({ ...prev, slot: e.target.value }))
              }
              required
            >
              <option value="">Select Time Slot</option>
              {["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"].map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <select
              className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              value={newBooking.package}
              onChange={(e) =>
                setNewBooking((prev) => ({ ...prev, package: e.target.value }))
              }
              required
            >
              {Object.entries(packages).map(([key, pkg]) => (
                <option key={key} value={key}>
                  {pkg.name} - {formatPrice(pkg.pricing[0].price)}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="paymentConfirmation"
                checked={newBooking.paymentConfirmation}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    paymentConfirmation: e.target.checked,
                  }))
                }
              />
              <label htmlFor="paymentConfirmation">Payment Received</label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
};
