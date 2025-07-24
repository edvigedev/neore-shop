import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardsContainer.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FetchingError from '../FetchingError/FetchingError';
import { useFavorites } from '../../hooks/useFavorites';
import type { Product } from '../../types';

interface ProductsResponse {
  products: Product[];
}

export default function CardsContainer() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  return (
    <section className="cards-container">
      <ul className="cards-container-list">
        {data?.products.map((product: Product) => (
          <li key={product.id}>
            <Card
              product={product}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              isFavorite={isFavorite}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
