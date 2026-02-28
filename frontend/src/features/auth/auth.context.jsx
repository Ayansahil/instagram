import { createContext, useState, useEffect } from "react";
import { register, login, getMe, logout, updateUser } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {
      // Ignore API errors — clear client state regardless
    } finally {
      setUser(null);
    }
  };

  const handleUpdateUser = async (payload) => {
    setLoading(true);
    try {
      const res = await updateUser(payload);
      if (res?.user) setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, handleRegister, handleLogin, handleLogout, handleUpdateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}