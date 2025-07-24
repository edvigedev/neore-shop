import './Card.css';
import addToCartImage from '../../assets/add-to-cart.png';
import { Link } from 'react-router';
import type { Product } from '../../types';

interface CardProps {
  product: Product;
  addFavorite: (product: Product) => void;
  removeFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export default function Card({ product, addFavorite, removeFavorite, isFavorite }: CardProps) {
  const isCurrentFavorite = isFavorite(product.id);

  console.log(`Rendering Card: ${product.title}. Is it a favorite? ${isCurrentFavorite}`);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isCurrentFavorite) {
      removeFavorite(product);
    } else {
      addFavorite(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="no-underline-link">
      <div className="card">
        <div className="card-image-section">
          <img src={product.thumbnail} alt={product.title} />
          <section className="card-buttons-section">
            <Link to={`/cart`} className="add-to-cart no-underline-link">
              <img src={addToCartImage} alt="Add to Cart" />
            </Link>
            <button
              className={`favorite-btn ${isFavorite(product.id) ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(product.id) ? '💜' : '🤍'}
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
