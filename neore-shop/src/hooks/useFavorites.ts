import { useState, useEffect } from 'react';

interface Product {
  id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === product.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.id === productId);
  };

  return { favorites, toggleFavorite, isFavorite };
};
