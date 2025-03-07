import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, signupUser, logoutUser } from "../utils/auth";

interface UserBio {
  display_name: string;
  store_name?: string;
  bio_description?: string;
  profile_image?: string;
  show_real_name: boolean;
  updated_at: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  is_deleted?: boolean;
  user_bio?: UserBio;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // 🔹 Fetch user data from API
  async function fetchUserData() {
    try {
      const response = await fetch("https://blastfromthepastbackend.onrender.com/api/user", {
        credentials: "include",
      });

      if (response.ok) {
        const data: UserData = await response.json();
        setUserData(data);
        sessionStorage.setItem("userData", JSON.stringify(data)); // Persist user session
        setIsAuthenticated(true);
      } else {
        setUserData(null);
        sessionStorage.removeItem("userData");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
      setIsAuthenticated(false);
    }
  }

  // 🔹 Check auth status on load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      fetchUserData();
    }
  }, []);

  // 🔹 Handle login
  async function login(email: string, password: string) {
    try {
      await loginUser(email, password);
      await fetchUserData(); // Fetch user data after login
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  // 🔹 Handle signup
  async function signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    displayName: string
  ) {
    try {
      await signupUser(firstName, lastName, email, password, displayName);
      await fetchUserData(); // Fetch user data after signup
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  // 🔹 Handle logout
  async function logout() {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUserData(null);
      sessionStorage.removeItem("userData");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
