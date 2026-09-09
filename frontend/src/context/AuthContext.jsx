import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res?.success && res?.data) {
            setUser(res.data);
          }
        } catch {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    if (res?.success && res?.data) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res?.success && res?.data) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res?.success && res?.data) {
        setUser(res.data);
      }
    } catch {
      // Ignored
    }
  };

  const verifyEmail = async ({ token: verifyToken, otp, email }) => {
    const res = await authService.verifyEmail({ token: verifyToken, otp, email });
    if (res?.success && res?.data?.token) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const resendVerification = async (identifier) => {
    return await authService.resendVerification(identifier);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
