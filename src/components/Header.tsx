import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, User, LogOut, Heart, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export const Header: React.FC<{ onSignInClick: () => void }> = ({
  onSignInClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, userData, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/screens", label: "Movie Screens" },
    { path: "/bookings", label: "My Bookings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Heart className="text-pink-500" size={28} />
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Digital Diaries
            </h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-pink-500"
                  : "text-gray-700 dark:text-gray-300 hover:text-pink-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {userData?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={onSignInClick}>
              <User size={16} className="mr-2" />
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-white/20"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-pink-500"
                      : "text-gray-700 dark:text-gray-300 hover:text-pink-500"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Welcome, {userData?.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
