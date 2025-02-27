import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.displayName
      );
      navigate({ to: "/" });
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="p-3 rounded bg-neutral-900 text-white border border-gray-600"
        />
        
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="p-3 rounded bg-neutral-900 text-white border border-gray-600"
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-3 rounded bg-neutral-900 text-white border border-gray-600"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="p-3 rounded bg-neutral-900 text-white border border-gray-600"
        />
        
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={formData.displayName}
          onChange={handleChange}
          required
          className="p-3 rounded bg-neutral-900 text-white border border-gray-600"
        />

        <button type="submit" className="bg-blue-500 px-4 py-3 rounded text-white hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}
