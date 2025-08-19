import { createContext, useContext } from 'react';
import type { AuthenticatedUser, AuthResponse } from '../../types';

interface AuthContextType {
  token: string | null;
  user: AuthenticatedUser | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
