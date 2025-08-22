import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import './ProductDetails.css';
import NavBar from '../../components/Navbar/NavBar';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext/CartContext';
import { useFavorites } from '../../context/FavoriteContext/FavoriteContext';
import { useAuth } from '../../context/AuthContext/AuthContext';
import clsx from 'clsx';
import HeartIcon from '../../icons/HeartIcon';
import PlusIcon from '../../icons/PlusIcon';
import MinusIcon from '../../icons/MinusIcon';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function ProductDetails() {
  const { id } = useParams();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, decreaseQuantity, getCartItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { token } = useAuth();
  const isCurrentFavorite = data ? isFavorite(data.id) : false;

  // Check if product is in cart
  const cartItem = data ? getCartItem(data.id) : undefined;
  const isInCart = cartItem !== undefined;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!data) {
      return;
    }

    if (isCurrentFavorite) {
      removeFavorite(data);
    } else {
      addFavorite(data);
    }
  };

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!data) {
      return;
    }

    if (isInCart) {
      // If product is in cart, decrease quantity by 1
      decreaseQuantity(data.id);
    } else {
      // If product is not in cart, add it
      addToCart(data, 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
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
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  // Validate that all required data fields are present
  // This prevents crashes when API returns incomplete data (e.g., empty {} response)
  if (
    !data ||
    !data.title ||
    !data.price ||
    !data.images ||
    data.images.length === 0 ||
    !data.description
  ) {
    return <FetchingError />;
  }

  const rating = data.rating || 0; // Default to 0 if rating is missing

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
    const price = parseFloat(String(data.price).replace(',', '.') || '0');
    const discount = parseFloat(String(data.discountPercentage).replace(',', '.') || '0');

    if (price > 0 && discount > 0) {
      const finalPrice = price - price * (discount / 100);
      return finalPrice.toFixed(2);
    }

    return price.toFixed(2);
  };

  return (
    <div data-testid="product-details-page">
      <NavBar />
      <div className="product-details-page-container" data-testid="product-details-page-container">
        <div
          className="product-details-image-container"
          data-testid="product-details-image-container"
        >
          <img
            src={data.images[0]}
            alt={data.title}
            className="product-details-image"
            data-testid="product-details-image"
          />

          <section
            className="product-details-buttons-container"
            data-testid="product-details-buttons-container"
          >
            <button
              disabled={!token}
              className={clsx('product-action-btn', { favorited: isCurrentFavorite && token })}
              onClick={handleFavoriteClick}
              data-tooltip={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
              data-testid="product-details-favorite-button"
            >
              <HeartIcon />
            </button>
            <button
              disabled={!token}
              onClick={handleCartToggle}
              className={clsx('product-action-btn', {
                'in-cart': isInCart,
              })}
              data-tooltip={isInCart ? 'Remove 1 from cart' : 'Add to cart'}
              data-testid="product-action-btn"
            >
              {isInCart ? <MinusIcon /> : <PlusIcon />}
            </button>
          </section>
        </div>

        <section
          className="product-details-introduction-section"
          data-testid="product-details-introduction-section"
        >
          <h1 className="product-details-page-title" data-testid="product-details-page-title">
            {data.title}
          </h1>
          <aside
            className="product-details-rating-section"
            data-testid="product-details-rating-section"
          >
            <h3 data-testid="product-details-rating-title">Rating</h3>
            <span data-testid="product-details-rating-stars">{finalRating}</span>
          </aside>
          <p data-testid="product-details-description">{data.description}</p>
        </section>
        <section
          className="product-details-price-section"
          data-testid="product-details-price-section"
        >
          <h2 className="product-details-initial-price" data-testid="product-details-initial-price">
            €{data.price}
          </h2>
          {data.discountPercentage && data.discountPercentage > 0 && (
            <span
              className="product-details-discount-percentage"
              data-testid="product-details-discount-percentage"
            >
              -{Math.round(data.discountPercentage)}%
            </span>
          )}
          <h2
            className="product-details-discounted-price"
            data-testid="product-details-discounted-price"
          >
            {data.discountPercentage && data.discountPercentage > 0
              ? `Now it's €${calculateDiscountedPrice()}!`
              : `€${data.price}`}
          </h2>
        </section>
      </div>
    </div>
  );
}
