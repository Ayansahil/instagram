import { createContext, useState, useEffect } from "react";
import { register, login, getMe } from "./services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const response = await login(identifier, password);
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleRegister, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
