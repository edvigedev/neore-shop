import FavoritesContainer from '../../components/FavoritesContainer/FavoritesContainer';
import './Favorites.css';

export default function Favorites() {
  return (
    <div>
      <div className="favorites-container">
        <h1 className="favorites-title">Your Favorites</h1>
        <hr className="favorites-horizontal-divider" />
        <FavoritesContainer />
      </div>
    </div>
  );
}
