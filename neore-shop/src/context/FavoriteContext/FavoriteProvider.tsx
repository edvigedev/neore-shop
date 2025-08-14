import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { FavoriteContext } from './FavoriteContext';

const FAVORITES_KEY = 'neoreShopFavorites';

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    //When my app starts, look in the browser's storage for a drawer labeled neoreShopFavorites.
    // If you find it, take out the contents, turn it back into a list, and that's our starting list of favorites.
    const savedNote = window.localStorage.getItem(FAVORITES_KEY);
    return savedNote ? JSON.parse(savedNote) : [];
  });

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (productToAdd: Product) => {
    setFavorites((currentFavorites) => {
      return [...currentFavorites, productToAdd];
    });
  };

  const removeFavorite = (productToRemove: Product) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((product) => product.id !== productToRemove.id)
    );
  };

  const isFavorite = (productId: number) => {
    const result = favorites.some((fav) => {
      return fav.id === productId;
    });

    return result;
  };

  const value = { favorites, addFavorite, removeFavorite, isFavorite };
  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};
