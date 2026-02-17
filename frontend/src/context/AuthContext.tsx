import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '../api/services';
import type { UserProfile } from '../types';

interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  agreed_terms: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await authService.me();
        setUser(data);
      } catch {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await authService.login(email, password);
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
  };

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
    await login(payload.email, payload.password);
  };

  const forgotPassword = async (email: string) => {
    const { data } = await authService.forgotPassword(email);
    return { message: data.message, resetToken: data.reset_token };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const { data } = await authService.resetPassword(token, newPassword);
    return data.message;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, forgotPassword, resetPassword, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
