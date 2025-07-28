import { useState, useEffect } from 'react';
import type { Product } from '../types';

const FAVORITES_KEY = 'neoreShopFavorites';

export const useFavorites = () => {
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

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
