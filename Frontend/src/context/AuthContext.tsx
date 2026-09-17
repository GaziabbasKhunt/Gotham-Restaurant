import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, registerUser, getCurrentUser, LoginPayload, RegisterPayload } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gotham_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and check authenticated user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('gotham_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res.data?.user) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            // Token invalid or user no longer exists
            localStorage.removeItem('gotham_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('gotham_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginPayload): Promise<void> => {
    const res = await loginUser(credentials);
    if (res.data?.token && res.data?.user) {
      localStorage.setItem('gotham_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    const res = await registerUser(payload);
    if (res.data?.token && res.data?.user) {
      localStorage.setItem('gotham_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('gotham_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
