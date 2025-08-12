import { useAppContext } from '../../context/AppContext';
import Card from '../Card/Card';
import './FavoritesContainer.css';

export default function FavoritesContainer() {
  const { favorites } = useAppContext();

  return (
    <section className="favorites-cards-container">
      {favorites.length === 0 ? (
        <p> You have not added any favorite yet </p>
      ) : (
        <ul className="favorites-cards-container-list">
          {favorites.map((product) => (
            <li key={product.id}>
              <Card product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
