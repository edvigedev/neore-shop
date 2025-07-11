import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import './ProductDetails.css';
import NavBar from '../../components/Navbar/NavBar';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  images: string[];
}

export default function ProductDetails() {
  const { id } = useParams();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <NavBar />
      <div className="product-details-page-container">
        <hr className="product-details-horizontal-divider" />
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
          <h2>€{data.price}</h2>
          <h3>-{Math.round(data.discountPercentage)}% IS APPLIED</h3>
        </section>
      </div>
    </div>
  );
}
