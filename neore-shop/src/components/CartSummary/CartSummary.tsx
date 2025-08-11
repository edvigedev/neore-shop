import { useCart } from '../../hooks/useCart';
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
          <div key={item.product.id} className="cart-item">
            <section className="cart-item-buttons-section">
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="remove-item-btn"
                aria-label="Remove item from cart"
              >
                ×
              </button>
            </section>
            <div className="cart-item-image-section">
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                className="cart-item-image"
              />
            </div>

            <div className="cart-item-details">
              <h3>{item.product.title}</h3>
              <p className="cart-item-description">
                {item.product.description.substring(0, 50)}...
              </p>

              <div className="cart-item-price">
                <span className="cart-item-original-price">€{item.product.price}</span>
                <span className="cart-item-discounted-price">
                  Now €
                  {(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}!
                </span>
                <span className="discount-badge">
                  -{Math.round(item.product.discountPercentage)}% applied
                </span>
              </div>
            </div>

            <section className="cart-item-quantity-section">
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.product.id}`}>Qty:</label>
                <select
                  id={`quantity-${item.product.id}`}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cart-item-total">
                <span>
                  €
                  {(
                    item.product.price *
                    (1 - item.product.discountPercentage / 100) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            </section>
          </div>
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
