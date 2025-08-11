import { useCart } from '../../hooks/useCart';
import CartItem from '../CartItem/CartItem';
import './CartSummary.css';

export default function CartSummary() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalQuantity, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-summary-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-summary-header">
        <h3>({totalQuantity} items)</h3>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-items-list">
        {cartItems.map((item) => (
          <CartItem
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="cart-summary-footer">
        <div className="cart-total">
          <span className="total-label">Total:</span>
          <span className="total-price">€{totalPrice.toFixed(2)}</span>
        </div>

        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}
