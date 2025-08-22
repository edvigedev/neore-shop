import './NavBar.css';
import cartImage from '../../assets/cart.png';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext/CartContext';
import SearchFilter from '../SearchFilter/SearchFilter';
import { useSearch } from '../../context/SearchContext/SearchContext';

export default function NavBar() {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { setGlobalSearch } = useSearch();

  const handleSearch = (query: string) => {
    setGlobalSearch(query);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-bar" data-testid="navbar">
      <Link to="/" className="no-underline-link" data-testid="navbar-logo-link">
        <div className="neore-logo"> Neore</div>
      </Link>
      <SearchFilter
        placeholder="Search"
        onSearch={handleSearch}
        className="nav-search-input"
        data-testid="navbar-search-input"
      />
      <ul className="nav-bar-links">
        <li onClick={handleLogout} className="no-underline-link" data-testid="navbar-logout-li">
          {token ? 'Logout' : 'Login'}
        </li>
        <li>
          {user && (
            <Link to="/favorites" className="no-underline-link" data-testid="navbar-favorites-link">
              Favorites
            </Link>
          )}
        </li>
        <li>
          {user?.role === 'admin' && (
            <Link to="/admin/users" className="no-underline-link" data-testid="navbar-users-link">
              Users
            </Link>
          )}
        </li>
        <li>
          {user?.role === 'admin' && (
            <Link to="/admin" className="no-underline-link" data-testid="navbar-admin-link">
              Admin Dashboard
            </Link>
          )}
        </li>
        <li>
          {user && (
            <Link to="/cart" className="no-underline-link" data-testid="navbar-cart-link">
              <button className="cart-button" data-testid="navbar-cart-button">
                <img src={cartImage} alt="Cart" />
              </button>
              <span className="cart-count" data-testid="navbar-cart-count">
                {totalQuantity}
              </span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
