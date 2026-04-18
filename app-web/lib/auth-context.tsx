'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from './api';

interface AuthContextValue {
  loggedUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  loggedUser: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('tc_user');
      if (saved) setLoggedUser(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem('tc_user');
    }
  }, []);

  const login = (user: AuthUser) => {
    sessionStorage.setItem('tc_user', JSON.stringify(user));
    setLoggedUser(user);
  };

  const logout = () => {
    sessionStorage.removeItem('tc_user');
    setLoggedUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
