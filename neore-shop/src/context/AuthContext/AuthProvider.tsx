import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext.tsx';
import type { User } from '../../types';

const decodeJwt = (token: string): User | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const [user, setUser] = useState<User | null>(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? decodeJwt(savedToken) : null;
  });

  const login = (newToken: string) => {
    const originalDecodedUser = decodeJwt(newToken);
    let userToSet = originalDecodedUser;
    if (originalDecodedUser && originalDecodedUser.username === 'emilys') {
      userToSet = {
        ...originalDecodedUser,
        role: 'admin',
      };
    }
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(userToSet);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = { token, login, logout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
