import { useState, useEffect, useRef, type ReactNode, useCallback } from 'react';
import { AuthContext } from './AuthContext.tsx';
import type { AuthResponse, AuthenticatedUser } from '../../types';

const decodeJwt = (token: string): AuthResponse | null => {
  if (!token) return null;
  try {
    const decodedUser = JSON.parse(atob(token.split('.')[1]));
    if (decodedUser && decodedUser.username === 'emilys') {
      return { ...decodedUser, role: 'admin' };
    }
    return decodedUser;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const IDLE_TIMEOUT =
  (window as Window & { __TEST_IDLE_TIMEOUT__?: number }).__TEST_IDLE_TIMEOUT__ || 30 * 60 * 1000; // 30 minutes default, configurable for tests
const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? decodeJwt(savedToken) : null;
  });

  const timeoutIdRef = useRef<number | null>(null);

  const login = (authData: AuthResponse) => {
    if (!authData.accessToken) {
      console.error('No access token provided');
      return;
    }
    const originalDecodedUser = decodeJwt(authData.accessToken);
    let userToSet = originalDecodedUser;
    if (originalDecodedUser && originalDecodedUser.username === 'emilys') {
      userToSet = {
        ...originalDecodedUser,
        role: 'admin',
      };
    }
    setToken(authData.accessToken);
    localStorage.setItem('token', authData.accessToken);
    setUser(userToSet);
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');

    // Clear user-specific data when logging out
    localStorage.removeItem('neoreShopCart');
    localStorage.removeItem('neoreShopFavorites');

    // Navigate to login page instead of reloading
    window.location.href = '/neore-shop/login';
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      console.log('User inactive, logging out.');
      logout();
    }, IDLE_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (!user) {
      return;
    }

    resetTimer();

    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user, resetTimer]);

  const value = { token, login, logout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
