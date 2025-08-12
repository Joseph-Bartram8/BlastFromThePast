import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, Facebook, Apple, CircleUserRound } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  // Redirect to home if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Container */}
      <div className="bg-white rounded-lg shadow-lg flex w-3/4 max-w-4xl overflow-hidden">
        
        {/* Left Side - Login Form */}
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 text-black"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-gray-700 transition"
            >
              <LogIn size={18} className="text-white" /> {/* Icon color changed to white */}
              <span>Sign in</span>
            </button>
          </form>

          {/* Social Login Buttons */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">OR CONTINUE WITH</p>
            <div className="flex justify-center mt-3 space-x-4">
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2 shadow-md hover:bg-gray-100 transition">
                <CircleUserRound size={20} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Google</span>
              </button>
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2 shadow-md hover:bg-gray-100 transition">
                <Apple size={20} className="text-gray-700" />
                <span className="text-gray-700 text-sm">Apple</span>
              </button>
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2 shadow-md hover:bg-gray-100 transition">
                <Facebook size={20} className="text-blue-500" />
                <span className="text-gray-700 text-sm">Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Redirect */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Welcome Section */}
        <div className="w-1/2 bg-blue-100 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Welcome to ToyBox</h2>
            <p className="text-gray-600 text-sm">Where imagination meets play</p>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👀</span>
              </div>
              <div className="w-12 h-12 bg-pink-300 rounded-md"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
