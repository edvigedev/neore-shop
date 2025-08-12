import { createContext, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
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
