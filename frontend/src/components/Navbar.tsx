import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { LucideSearch } from "lucide-react";
import { logoutUser } from "../utils/auth";
import { useSearchResults } from "../hooks/useSearchResults"; // ✅ make sure this path matches

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchActive(false);
        setShowDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logoutUser();
    sessionStorage.removeItem("userData");
    setUserData(null);
    setDropdownOpen(false);
    window.location.reload();
  }

  const results = useSearchResults(searchQuery.trim());

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate({ to: "/searchResults", search: { q: searchQuery } });
      setShowDropdown(false);
      setSearchActive(false);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 py-4 transition-all"
      initial={{
        backgroundColor: isHomePage ? "transparent" : "#595B61",
        borderBottom: isHomePage ? "0px solid transparent" : "2px solid rgba(255, 255, 255, 0.2)",
      }}
      animate={{
        backgroundColor: isHomePage && !isScrolled ? "transparent" : "#595B61",
        borderBottom: isHomePage && !isScrolled ? "0px solid transparent" : "2px solid rgba(255, 255, 255, 0.2)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between px-6 z-50 relative">
        {/* Burger Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            <FaBars />
          </button>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-300"
            >
              <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Home</Link>
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">About</Link>
              <Link to="/mapPage" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Map</Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Dashboard</Link>
              )}
            </motion.div>
          )}
        </div>

        {/* Centered Title */}
        <Link to="/" className="text-xl font-bold font-[Krona_One] text-white absolute left-1/2 transform -translate-x-1/2">
          The Toy Portal
        </Link>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4 relative">
          {(isScrolled || !isHomePage) && (
            <motion.div
              animate={{ width: searchActive ? "200px" : "40px" }}
              className="relative overflow-visible transition-all duration-300"
            >
              {!searchActive ? (
                <button
                  onClick={() => setSearchActive(true)}
                  className="text-white"
                >
                  <LucideSearch />
                </button>
              ) : (
                <>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {showDropdown && (
                    <div className="absolute top-full mt-1 bg-white shadow-lg border border-gray-200 w-full rounded-md z-50 max-h-48 overflow-auto">
                      {results?.results && results.results.length > 0 ? (
                        results.results.slice(0, 3).map((user) => (
                          <div
                            key={user.display_name}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                            onClick={() => {
                              navigate({ to: "/searchResults", search: { q: user.display_name } });
                              setSearchActive(false);
                              setShowDropdown(false);
                            }}
                          >
                            {user.display_name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 italic">No results found</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Auth Section */}
          <div ref={dropdownRef} className="relative z-50">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {isAuthenticated ? userData?.user_bio?.display_name || "User" : "Join The Community"}
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md py-4 border border-gray-300"
              >
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col items-center px-4">
                    <p className="text-sm text-gray-600 mb-2">Login or sign up to join our community!</p>
                    <Link to="/login" className="bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition">Login</Link>
                    <Link to="/signup" className="text-blue-500 mt-2 hover:underline">Don't have an account? Sign up here!</Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
