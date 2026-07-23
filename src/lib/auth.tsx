'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  avatar?: string;
  authProvider?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: 'client' | 'admin') => void;
  loginWithGoogleBackend: (credential?: string, email?: string, role?: 'client' | 'admin') => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('te2sr_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = (email: string, role: 'client' | 'admin' = 'client') => {
    const name = email.split('@')[0];
    const newUser: User = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role,
      authProvider: 'Standard Login',
    };
    setUser(newUser);
    localStorage.setItem('te2sr_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);

    if (role === 'admin') {
      router.push('/admin');
    }
  };

  const loginWithGoogleBackend = async (credential?: string, email?: string, role: 'client' | 'admin' = 'client'): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, email, role }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('te2sr_user', JSON.stringify(data.user));
        setIsAuthModalOpen(false);

        if (data.user.role === 'admin') {
          router.push('/admin');
        }
        return true;
      }
    } catch (err) {
      console.error('Google Backend Login Error:', err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('te2sr_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogleBackend,
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
