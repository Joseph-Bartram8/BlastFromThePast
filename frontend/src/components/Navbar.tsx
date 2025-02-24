import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, login, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 1 }}
      animate={isSticky ? { backgroundColor: "rgba(0, 0, 0, 0.8)", borderBottom: "2px solid rgba(255, 255, 255, 0.2)" } : {}}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 w-full text-white py-4 shadow-lg transition-all ${isSticky ? "shadow-md backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Centered Links */}
        <div className="flex-1 flex justify-center space-x-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/about" className="hover:text-gray-300 transition">About</Link>
          {isAuthenticated && <Link to="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link>}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none hover:cursor-pointer"
          >
            <FaUserCircle className="text-2xl" />
            {isAuthenticated && <span>{"John Doe"}</span>}
          </button>
          
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-md overflow-hidden"
            >
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={login}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:cursor-pointer"
                >
                  Login / Sign Up
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
