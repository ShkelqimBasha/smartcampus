import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartcampus_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('smartcampus_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('smartcampus_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Gabim në verifikimin e përdoruesit:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartcampus_token', res.data.token);
      localStorage.setItem('smartcampus_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartcampus_token', res.data.token);
      localStorage.setItem('smartcampus_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartcampus_token');
    localStorage.removeItem('smartcampus_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isProfessor = user?.role === 'PROFESSOR';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isProfessor,
        isStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth duhet të përdoret brenda një AuthProvider');
  }
  return context;
};

