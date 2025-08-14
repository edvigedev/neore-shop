import clsx from 'clsx';
import './Card.css';
import addToCartImage from '../../assets/add-to-cart.png';
import { Link } from 'react-router';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext/CartContext';
import { useFavorites } from '../../context/FavoriteContext/FavoriteContext';
import { useAuth } from '../../context/AuthContext/AuthContext';

interface CardProps {
  product: Product;
}

export default function Card({ product }: CardProps) {
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { token } = useAuth();
  const isCurrentFavorite = isFavorite(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isCurrentFavorite) {
      removeFavorite(product);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    addToCart(product, 1);
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
    <Link to={`/products/${product.id}`} className="no-underline-link">
      <div className="card">
        <div className="card-image-section">
          <img src={product.thumbnail} alt={product.title} />
          <section className="card-buttons-section">
            <button onClick={handleAddToCart} className="add-to-cart">
              <img src={addToCartImage} alt="Add to Cart" />
            </button>
            <button
              disabled={!token}
              className={clsx('favorite-btn', { favorited: isCurrentFavorite })}
              onClick={handleFavoriteClick}
              aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isCurrentFavorite ? '💜' : '🤍'}
            </button>
          </section>
        </div>
        <div className="card-info">
          <h3>{product.title}</h3>
          <div className="card-price">
            <h3 className="card-initial-price">€{product.price}</h3>
            <h3 className="card-discounted-price">€{calculateDiscountedPrice()}</h3>
            <h3>-{Math.round(product.discountPercentage)}%</h3>
          </div>
          <p className="card-description">{product.description.substring(0, 40)}...</p>
        </div>
      </div>
    </Link>
  );
}
