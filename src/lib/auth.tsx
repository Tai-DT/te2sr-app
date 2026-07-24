'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, getToken, setToken, ApiError } from './api-client';
import type { User } from './types';

export type { User } from './types';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: (credential: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'te2sr_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  // Bootstrap from a cached session, then revalidate against the backend.
  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch { /* ignore */ }
    }
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      })
      .catch((err) => {
        // Only drop the session on an explicit auth failure — keep it on network errors.
        if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
          clearToken();
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = useCallback((token: string, u: User) => {
    setToken(token);
    setUser(u);
    if (typeof window !== 'undefined') localStorage.setItem(USER_KEY, JSON.stringify(u));
    setIsAuthModalOpen(false);
    if (u.role === 'admin') router.push('/admin');
  }, [router]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { token, user: u } = await api.login(email, password);
      persistSession(token, u);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Đăng nhập thất bại.' };
    }
  }, [persistSession]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const { token, user: u } = await api.register(name, email, password);
      persistSession(token, u);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Đăng ký thất bại.' };
    }
  }, [persistSession]);

  const loginWithGoogle = useCallback(async (credential: string): Promise<AuthResult> => {
    try {
      const { token, user: u } = await api.google(credential);
      persistSession(token, u);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Đăng nhập Google thất bại.' };
    }
  }, [persistSession]);

  const logout = useCallback(() => {
    clearToken();
    if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY);
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
