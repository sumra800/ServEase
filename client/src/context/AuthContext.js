import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and verify user
    const token = localStorage.getItem('servEaseToken');
    const storedUser = localStorage.getItem('servEaseUser');
    
    if (token && storedUser) {
      // Verify token is still valid by fetching current user
      authAPI.getCurrentUser()
        .then((response) => {
          if (response.success) {
            setCurrentUser(response.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('servEaseToken');
            localStorage.removeItem('servEaseUser');
          }
        })
        .catch(() => {
          // Token invalid or expired, clear storage
          localStorage.removeItem('servEaseToken');
          localStorage.removeItem('servEaseUser');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await authAPI.login(email, password, role);
      
      if (response.success) {
        // Store token and user
        localStorage.setItem('servEaseToken', response.token);
        localStorage.setItem('servEaseUser', JSON.stringify(response.user));
        setCurrentUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Store token and user
        localStorage.setItem('servEaseToken', response.token);
        localStorage.setItem('servEaseUser', JSON.stringify(response.user));
        setCurrentUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      // Handle validation errors
      if (error.message.includes('errors')) {
        throw new Error('Please check all fields and try again');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('servEaseToken');
    localStorage.removeItem('servEaseUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

