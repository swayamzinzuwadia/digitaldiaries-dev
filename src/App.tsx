import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ScreensPage } from "./pages/ScreensPage";
import { BookingsPage } from "./pages/BookingsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { Modal } from "./components/ui/Modal";
import { AuthModal } from "./components/AuthModal";

function App() {
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
            <Header onSignInClick={() => setShowAuthModal(true)} />
            <Modal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              title="Welcome to Digital Diaries"
            >
              <AuthModal onSuccess={() => setShowAuthModal(false)} />
            </Modal>
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/screens" element={<ScreensPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
