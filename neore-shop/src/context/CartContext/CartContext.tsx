import { createContext, useContext } from 'react';
import type { CartContextType } from '../../types';

// eslint-disable-next-line
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
