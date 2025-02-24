import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export default function Home() {
  const validRoutes: Record<string, string> = {
    "Action Figures": "/action-figures",
    "Die-Cast Models": "/die-cast-models",
    "Board Games": "/board-games",
  };

  return (
    <div className="bg-[#212121] text-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-20 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center w-full max-w-3xl px-4"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to the Vintage Toy Portal</h1>
        <p className="text-base sm:text-lg text-gray-300 mb-10">
          Your gateway to all things vintage toys in the UK.
        </p>
      </motion.div>

      <div className="w-full flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Discover Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 items-center justify-center">
          {["Action Figures", "Die-Cast Models", "Board Games"].map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <Link
                to={validRoutes[category]}
                className="block w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden hover:bg-gray-700 transition-all"
              >
                <span className="text-md sm:text-lg font-semibold text-gray-300 group-hover:text-white text-center">
                  {category}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
