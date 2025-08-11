import clsx from 'clsx';
import './Card.css';
import addToCartImage from '../../assets/add-to-cart.png';
import { Link } from 'react-router';
import type { Product } from '../../types';
import { useCart } from '../../hooks/useCart';

interface CardProps {
  product: Product;
  addFavorite: (product: Product) => void;
  removeFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export default function Card({ product, addFavorite, removeFavorite, isFavorite }: CardProps) {
  const { addToCart } = useCart();
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
            <h3>€{product.price}</h3>
            <h3>-{Math.round(product.discountPercentage)}%</h3>
          </div>
          <p className="card-description">{product.description.substring(0, 50)}...</p>
        </div>
      </div>
    </Link>
  );
}
