'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from './api';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string | null;
  path?: string | null;
  children?: MenuItem[];
}

interface AuthSession {
  user: AuthUser;
  token: string;
  menus: MenuItem[];
  permissions: string[];
}

interface AuthContextValue {
  loggedUser: AuthUser | null;
  token: string | null;
  menus: MenuItem[];
  permissions: string[];
  hasPermission: (perm: string) => boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  loggedUser: null,
  token: null,
  menus: [],
  permissions: [],
  hasPermission: () => false,
  login: () => {},
  logout: () => {},
});

const SESSION_KEY = 'tc_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setSession(JSON.parse(saved));
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = (s: AuthSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const hasPermission = (perm: string) => session?.permissions.includes(perm) ?? false;

  return (
    <AuthContext.Provider value={{
      loggedUser: session?.user ?? null,
      token: session?.token ?? null,
      menus: session?.menus ?? [],
      permissions: session?.permissions ?? [],
      hasPermission,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
