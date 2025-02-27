import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

// Import routes
import { Route as HomeRoute } from "../routes/index";
import { Route as AboutRoute } from "../routes/about";
import { Route as DashboardRoute } from "../routes/dashboard";
import { Route as SignupRoute } from "../routes/signup";
import { logoutUser } from "../utils/auth";

export default function Navbar() {
  const { isAuthenticated, login } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const routerState = useRouterState();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [routerState.location.href]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      setDropdownOpen(false);
    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 1 }}
      animate={isSticky ? { backgroundColor: "#212121", borderBottom: "2px solid rgba(255, 255, 255, 0.2)" } : {}}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 w-full text-white py-4 shadow-lg transition-all ${isSticky ? "shadow-md backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Centered Links */}
        <div className="flex-1 flex justify-center space-x-6">
          <Link to={HomeRoute.fullPath} className="hover:text-gray-300 transition">Home</Link>
          <Link to={AboutRoute.fullPath} className="hover:text-gray-300 transition">About</Link>
          {isAuthenticated && <Link to={DashboardRoute.fullPath} className="hover:text-gray-300 transition">Dashboard</Link>}
        </div>

        {/* Profile / Login Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none hover:cursor-pointer"
          >
            <FaUserCircle className="text-2xl" />
            {isAuthenticated && <span>John Doe</span>}
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-[#212121] shadow-lg rounded-md p-4 border border-gray-600"
            >
              {isAuthenticated ? (
                <button
                onClick={async () => {
                  await logoutUser();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:cursor-pointer rounded"
              >
                Logout
              </button>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col space-y-3">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-neutral-900 text-white border border-gray-600"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-neutral-900 text-white border border-gray-600"
                  />
                  <button 
                    type="submit" 
                    className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 cursor-pointer"
                  >
                    Login
                  </button>
                  <Link
                    to={SignupRoute.fullPath}
                    className="text-sm text-gray-400 hover:text-gray-200 text-center"
                  >
                    Don't have an account? Sign up here!
                  </Link>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
