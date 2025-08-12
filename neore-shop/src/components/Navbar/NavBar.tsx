import './NavBar.css';
import cartImage from '../../assets/cart.png';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className="no-underline-link">
        <div className="neore-logo"> Neore</div>
      </Link>
      <ul className="nav-bar-links">
        <li>My Profile</li>
        <li onClick={handleLogout}>Logout</li>
        <li>
          <Link to="/favorites" className="no-underline-link">
            Favorites
          </Link>
        </li>
        <li>
          <Link to="/users" className="no-underline-link">
            Users
          </Link>
        </li>
        <li>
          <Link to="/cart" className="no-underline-link">
            <button className="cart-button">
              <img src={cartImage} alt="Cart" />
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
