import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import './ProductDetails.css';
import NavBar from '../../components/Navbar/NavBar';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext/CartContext';
import addToCartImage from '../../assets/add-to-cart.png';

export default function ProductDetails() {
  const { id } = useParams();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to get the product details');
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
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  if (!data) {
    return <FetchingError />;
  }

  const rating = data.rating;

  function getStarRating(rating: number) {
    // Round to the nearest half
    const roundedRating = Math.round(rating * 2) / 2;
    let stars = '';

    // Appends full stars
    for (let i = 0; i < Math.floor(roundedRating); i++) {
      stars += '★';
    }

    // Appends empty stars
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars += '☆';
    }

    return stars;
  }

  const finalRating = getStarRating(rating);

  const calculateDiscountedPrice = () => {
    const price = parseFloat(String(data?.price).replace(',', '.') || '0');
    const discount = parseFloat(String(data?.discountPercentage).replace(',', '.') || '0');

    if (price > 0 && discount > 0) {
      const finalPrice = price - price * (discount / 100);
      return finalPrice.toFixed(2);
    }

    return price.toFixed(2);
  };

  return (
    <div>
      <NavBar />
      <div className="product-details-page-container">
        <button onClick={() => addToCart(data, 1)} className="product-details-add-to-cart">
          <img src={addToCartImage} alt="Add to Cart" />
        </button>
        <img src={data.images[0]} alt={data.title} />
        <section className="product-details-introduction-section">
          <h1 className="product-details-page-title">{data.title}</h1>
          <aside className="product-details-rating-section">
            <h3>RATING</h3>
            <span>{finalRating}</span>
          </aside>
          <p>{data.description}</p>
        </section>
        <section className="product-details-price-section">
          <h2 className="product-details-initial-price">€{data.price}</h2>
          <h2 className="product-details-discounted-price">
            Now it&apos;s €{calculateDiscountedPrice()}!
          </h2>
          <h3>-{Math.round(data.discountPercentage)}% DISCOUNT!</h3>
        </section>
      </div>
    </div>
  );
}
