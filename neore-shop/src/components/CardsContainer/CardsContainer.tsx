import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardsContainer.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FetchingError from '../FetchingError/FetchingError';

interface Product {
  id: number;
  thumbnail: string;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
}

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
            <Card product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
