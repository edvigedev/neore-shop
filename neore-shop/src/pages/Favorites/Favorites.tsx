import FavoritesContainer from '../../components/FavoritesContainer/FavoritesContainer';
import NavBar from '../../components/Navbar/NavBar';
import './Favorites.css';

export default function Favorites() {
  return (
    <div>
      <NavBar />
      <div className="favorites-container">
        <h1 className="favorites-title">Your Favorites</h1>
      </div>
      <hr className="favorites-horizontal-divider" />
      <FavoritesContainer />
    </div>
  );
}
