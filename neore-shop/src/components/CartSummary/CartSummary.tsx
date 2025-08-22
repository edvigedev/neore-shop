import { useCart } from '../../context/CartContext/CartContext';
import CartItem from '../CartItem/CartItem';
import './CartSummary.css';

export default function CartSummary() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalQuantity, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-summary-empty" data-testid="cart-summary-empty">
        <h2 data-testid="cart-summary-empty-title">Your cart is empty</h2>
        <p data-testid="cart-summary-empty-message">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-summary-header">
        <h3 className="cart-summary-header-title" data-testid="cart-summary-header-title">
          ({totalQuantity} items)
        </h3>
        <button
          onClick={clearCart}
          className="clear-cart-btn"
          data-testid="cart-summary-clear-button"
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-items-list" data-testid="cart-items-list">
        {cartItems.map((item) => (
          <CartItem
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            data-testid={`cart-item-${item.product.id}`}
          />
        ))}
      </div>

      <div className="cart-summary-footer" data-testid="cart-summary-footer">
        <div className="cart-total" data-testid="cart-total">
          <span className="total-label" data-testid="cart-total-label">
            Total:
          </span>
          <span className="total-price" data-testid="cart-total-price">
            €{totalPrice.toFixed(2)}
          </span>
        </div>

        <button className="checkout-btn" data-testid="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
