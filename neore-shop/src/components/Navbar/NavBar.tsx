import './NavBar.css';
import cartImage from '../../assets/cart.png';

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <div className="neore-logo"> Neore</div>
      <ul className="nav-bar-links">
        <li>My Profile</li>
        <li>Logout</li>
        <li>
          <button className="cart-button">
            <img src={cartImage} alt="Cart" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
