import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardsContainer.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FetchingError from '../FetchingError/FetchingError';
import type { Product } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ProductsResponse {
  products: Product[];
}

export default function CardsContainer() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(getErrorMessage(error));
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
    <ErrorBoundary>
      <section className="cards-container">
        <ul className="cards-container-list">
          {data?.products.map((product: Product) => (
            <li key={product.id}>
              <Card product={product} />
            </li>
          ))}
        </ul>
      </section>
    </ErrorBoundary>
  );
}
