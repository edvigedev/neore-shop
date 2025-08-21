import { useEffect, useState, useMemo } from 'react';
import type { Product } from '../../types';
import './AdminPage.css';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../utils/getErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import { useSearch } from '../../context/SearchContext/SearchContext';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { globalSearch } = useSearch();

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    if (!globalSearch.trim()) return products;

    return products.filter(
      (product: Product) =>
        product.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [products, globalSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error: unknown) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner size="small" />;
  }
  if (error) {
    return <FetchingError />;
  }

  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>
      <p className="admin-page-description">This is where you will manage products.</p>
      <hr className="admin-page-horizontal-divider" />

      <section className="admin-page-products-section">
        {filteredProducts.length === 0 && globalSearch.trim() && (
          <p className="admin-page-no-matches">
            No products found matching &quot;{globalSearch}&quot;
          </p>
        )}
        {filteredProducts.length > 0 && (
          <ul className="admin-page-products-list">
            {filteredProducts.map((product: Product) => (
              <li key={product.id} className="admin-page-products-list-item">
                <Link to={`/admin/products/${product.id}`} className="admin-page-no-underline-link">
                  {product.id}. {product.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
