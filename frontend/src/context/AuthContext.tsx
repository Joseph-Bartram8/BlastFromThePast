import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, signupUser, logoutUser } from "../utils/auth";

interface AuthContextType {
  isAuthenticated: boolean;
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

  async function login(email: string, password: string) {
    await loginUser(email, password);
    setIsAuthenticated(true);
  }

  async function signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    displayName: string
  ) {
    await signupUser(firstName, lastName, email, password, displayName);
    setIsAuthenticated(true);
  }

  async function logout() {
    await logoutUser();
    setIsAuthenticated(false);
    window.location.reload();
  }

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch("http://localhost:8080/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setIsAuthenticated(false);
      }
    }

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
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
