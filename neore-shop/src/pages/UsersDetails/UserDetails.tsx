import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import './UserDetails.css';
import type { UserDetails, Carts, Product, Cart } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function UserDetails() {
  const { id } = useParams();
  const [cartsData, setCartsData] = useState<Carts>();
  const [data, setData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users/${id}`);
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }
        const result = await response.json();
        setData(result);
        //Fetching the cart per user
        const cartsResponse = await fetch(`https://dummyjson.com/carts/user/${id}`);
        if (!cartsResponse.ok) {
          throw new Error("We could not load the user's carts");
        }
        const cartsData = await cartsResponse.json();
        console.log(`API response for user ${id}:`, cartsData);
        setCartsData(cartsData);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  return (
    <div>
      <div className="user-details-page-container">
        <section className="user-details-introduction-section">
          <h1 className="user-details-page-title">
            {data?.firstName} {data?.lastName}
          </h1>
          <h3>{data?.role}</h3>
          <h3>{data?.email}</h3>
          <h3>{data?.phone}</h3>
        </section>

        <section className="user-details-carts-section">
          <h2>Carts</h2>
          {cartsData && cartsData.carts.length > 0 ? (
            <ul>
              {cartsData.carts.map((cart: Cart) => (
                <li key={cart.id} className="user-details-one-cart-section">
                  <h3>{cart.id}.</h3>
                  <p>Total Price: ${cart.total}</p>
                  <h3>Products:</h3>
                  <ul>
                    {cart.products.map((product: Product) => (
                      <li key={product.id}>
                        {product.title} (${product.price})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>This user has no carts.</p>
          )}
        </section>
      </div>
    </div>
  );
}
