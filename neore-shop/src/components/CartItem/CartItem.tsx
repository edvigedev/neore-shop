import type { Product } from '../../types';
import './CartItem.css';

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({ product, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const itemTotal = discountedPrice * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    onUpdateQuantity(product.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  return (
    <div className="cart-item" data-testid="cart-item">
      <section className="cart-item-buttons-section">
        <button
          onClick={handleRemove}
          className="remove-item-btn"
          aria-label="Remove item from cart"
          data-testid="cart-item-remove-button"
        >
          ×
        </button>
      </section>

      <div className="cart-item-image-section">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="cart-item-image"
          data-testid="cart-item-image"
        />
      </div>

      <div className="cart-item-details">
        <h3 data-testid="cart-item-title">{product.title}</h3>
        <p className="cart-item-description" data-testid="cart-item-description">
          {product.description.substring(0, 50)}...
        </p>

        <div className="cart-item-price-section">
          <span className="cart-item-original-price" data-testid="cart-item-original-price">
            €{product.price}
          </span>
          <span className="cart-item-discounted-price" data-testid="cart-item-discounted-price">
            Now €{discountedPrice.toFixed(2)}!
          </span>
          <span id="cart-item-discount-badge" data-testid="cart-item-discount-badge">
            -{Math.round(product.discountPercentage)}% off!
          </span>
        </div>
      </div>

      <section className="cart-item-quantity-section">
        <div className="cart-item-quantity">
          <label htmlFor={`quantity-${product.id}`} data-testid="cart-item-quantity-label">
            Qty:
          </label>
          <select
            id={`quantity-${product.id}`}
            value={quantity}
            onChange={handleQuantityChange}
            data-testid="cart-item-quantity-select"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="cart-item-total">
          <span data-testid="cart-item-total">€{itemTotal.toFixed(2)}</span>
        </div>
      </section>
    </div>
  );
}
