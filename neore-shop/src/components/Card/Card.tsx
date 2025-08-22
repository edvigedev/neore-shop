import clsx from 'clsx';
import './Card.css';
import { Link } from 'react-router';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext/CartContext';
import { useFavorites } from '../../context/FavoriteContext/FavoriteContext';
import { useAuth } from '../../context/AuthContext/AuthContext';
import HeartIcon from '../../icons/HeartIcon';
import PlusIcon from '../../icons/PlusIcon';
import MinusIcon from '../../icons/MinusIcon';

interface CardProps {
  product: Product;
}

export default function Card({ product }: CardProps) {
  const { addToCart, decreaseQuantity, getCartItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { token } = useAuth();
  const isCurrentFavorite = isFavorite(product.id);

  // Check if product is in cart and get its quantity
  const cartItem = getCartItem(product.id);
  const isInCart = cartItem !== undefined;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isCurrentFavorite) {
      removeFavorite(product);
    } else {
      addFavorite(product);
    }
  };

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isInCart) {
      // If product is in cart, decrease quantity by 1
      decreaseQuantity(product.id);
    } else {
      // If product is not in cart, add it
      addToCart(product, 1);
    }
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(String(product?.price).replace(',', '.') || '0');
    const discount = parseFloat(String(product?.discountPercentage).replace(',', '.') || '0');

    if (price > 0 && discount > 0) {
      const finalPrice = price - price * (discount / 100);
      return finalPrice.toFixed(2);
    }

    return price.toFixed(2);
  };

  return (
    <Link to={`/products/${product.id}`} className="no-underline-link" data-testid="card-link">
      <div className="card" data-testid="card">
        <div className="card-image-section">
          <img src={product.thumbnail} alt={product.title} data-testid="card-image" />
          <section className="card-buttons-section">
            <button
              disabled={!token}
              className={clsx('card-action-btn', {
                favorited: isCurrentFavorite && token,
              })}
              onClick={handleFavoriteClick}
              data-tooltip={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
              data-testid="card-favorite-button"
            >
              <HeartIcon />
            </button>
            <button
              disabled={!token}
              onClick={handleCartToggle}
              className={clsx('card-action-btn', {
                'in-cart': isInCart,
              })}
              data-tooltip={isInCart ? 'Remove 1 from cart' : 'Add to cart'}
              data-testid="card-cart-button"
            >
              {isInCart ? <MinusIcon /> : <PlusIcon />}
            </button>
          </section>
        </div>
        <div className="card-info">
          <h3 className="card-title" data-testid="card-title">
            {product.title}
          </h3>
          <div className="card-price">
            <h3 className="card-initial-price" data-testid="card-initial-price">
              €{product.price}
            </h3>
            {product.discountPercentage > 0 && (
              <h3 data-testid="card-discount-percentage">
                -{Math.round(product.discountPercentage)}%
              </h3>
            )}
            <h3 className="card-discounted-price" data-testid="card-discounted-price">
              €{calculateDiscountedPrice()}
            </h3>
          </div>
          <p className="card-category" data-testid="card-category">
            {product.category}
          </p>
        </div>
      </div>
    </Link>
  );
}
