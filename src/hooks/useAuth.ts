import { useState, useEffect } from 'react';
import type { AuthUser } from '../types';

const STORAGE_KEY = 'auth-user';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo, we'll create a mock user
    const mockUser: AuthUser = {
      id: crypto.randomUUID(),
      email,
      isVerified: true,
    };
    setUser(mockUser);
    return mockUser;
  };

  const signup = async (email: string, password: string) => {
    // In a real app, this would make an API call
    const mockUser: AuthUser = {
      id: crypto.randomUUID(),
      email,
      isVerified: false,
    };
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
};