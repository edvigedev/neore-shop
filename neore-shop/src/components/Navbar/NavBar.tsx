import './NavBar.css';
import cartImage from '../../assets/cart.png';
import { Link } from 'react-router';

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/" className="no-underline-link">
        <div className="neore-logo"> Neore</div>
      </Link>
      <ul className="nav-bar-links">
        <li>My Profile</li>
        <li>Logout</li>
        <li>
          <Link to="/favorites" className="no-underline-link">
            Favorites
          </Link>
        </li>
        <li>
          <button className="cart-button">
            <img src={cartImage} alt="Cart" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
