import { useState, useEffect, useMemo } from 'react';
import Card from '../Card/Card';
import './CardsContainer.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FetchingError from '../FetchingError/FetchingError';
import type { Product } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { useSearch } from '../../context/SearchContext/SearchContext';

interface ProductsResponse {
  products: Product[];
}

export default function CardsContainer() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { globalSearch } = useSearch();

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    if (!globalSearch.trim()) return data.products;

    return data.products.filter(
      (product) =>
        product.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [data?.products, globalSearch]);

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
        <ul className="cards-container-list" data-testid="cards-container-list">
          {filteredProducts.length === 0 && globalSearch.trim() && (
            <li>
              <p
                className="cards-container-list-item-empty"
                data-testid="cards-container-empty-search"
              >
                No products found matching &quot;{globalSearch}&quot;
              </p>
            </li>
          )}
          {filteredProducts.length === 0 && !globalSearch.trim() && (
            <li>
              <p
                className="cards-container-list-item-empty"
                data-testid="cards-container-empty-no-products"
              >
                No products found
              </p>
            </li>
          )}
          {filteredProducts.map((product: Product) => (
            <li key={product.id}>
              <Card product={product} />
            </li>
          ))}
        </ul>
      </section>
    </ErrorBoundary>
  );
}
