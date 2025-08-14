// src/context/FavoriteContext.tsx (Corrected & Final Version)

import { createContext, useContext } from 'react';
import type { Product } from '../../types';

// You can define the type for your context value here or in types.ts
export interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

// 1. Create the context with a default value of `undefined`
export const FavoriteContext = createContext<FavoritesContextType | undefined>(undefined);

// 2. Create the custom hook that components will use
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoriteContext);
  // 3. Check if the context is available, and throw a helpful error if not
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
