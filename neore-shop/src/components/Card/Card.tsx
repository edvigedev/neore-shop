import './Card.css';
import addToCartImage from '../../assets/add-to-cart.png';

interface Product {
  thumbnail: string;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
}

export default function Card({ product }: { product: Product }) {
  return (
    <div className="card">
      <div className="card-image-section">
        <img src={product.thumbnail} alt={product.title} />
        <a href={`/cart`} className="add-to-cart">
          <img src={addToCartImage} alt="Add to Cart" />
        </a>
      </div>
      <div className="card-info">
        <h3>{product.title}</h3>
        <div className="card-price">
          <h3>€{product.price}</h3>
          <h3>-{Math.round(product.discountPercentage)}%</h3>
        </div>
        <p className="card-description">{product.description.substring(0, 50)}...</p>
      </div>
    </div>
  );
}
