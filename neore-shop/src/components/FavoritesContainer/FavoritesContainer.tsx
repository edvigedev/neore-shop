import { useFavorites } from '../../hooks/useFavorites';
import Card from '../Card/Card';
import './FavoritesContainer.css';

export default function FavoritesContainer() {
  const { addFavorite, isFavorite, favorites, removeFavorite } = useFavorites();

  return (
    <section className="favorites-cards-container">
      {favorites.length === 0 ? (
        <p> You have not added any favorite yet </p>
      ) : (
        <ul className="favorites-cards-container-list">
          {favorites.map((product) => (
            <li key={product.id}>
              <Card
                product={product}
                addFavorite={addFavorite}
                isFavorite={isFavorite}
                removeFavorite={removeFavorite}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
