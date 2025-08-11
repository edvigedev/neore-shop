import CartSummary from '../../components/CartSummary/CartSummary';
import NavBar from '../../components/Navbar/NavBar';
import './Cart.css';

export default function Cart() {
  return (
    <div className="cart-page">
      <NavBar />
      <div className="cart-page-container">
        <h1>My Cart</h1>
        <CartSummary />
      </div>
    </div>
  );
}
