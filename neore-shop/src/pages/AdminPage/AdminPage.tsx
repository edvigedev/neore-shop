import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import './AdminPage.css';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error: unknown) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>
      <p className="admin-page-description">This is where you will manage products.</p>
      <hr className="admin-page-horizontal-divider" />

      <section className="admin-page-products-section">
        {products.length > 0 && (
          <ul className="admin-page-products-list">
            {products.map((product: Product) => (
              <li key={product.id} className="admin-page-products-list-item">
                {product.id}. {product.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
