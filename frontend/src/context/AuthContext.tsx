import { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email: string, password: string) {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    setIsAuthenticated(true);
  }

  async function logout() {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  }

  useEffect(() => {
    async function checkAuthStatus() {
      const response = await fetch("http://localhost:8080/api/user", {
        credentials: "include",
      });
  
      setIsAuthenticated(response.ok);
    }
  
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
