import CardsContainer from '../../components/CardsContainer/CardsContainer';
import NavBar from '../../components/Navbar/NavBar';
import AsideHomePage from '../../components/Aside-Homepage/Aside-HomePage';
import './Homepage.css';

export default function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="home-page-container">
        <div className="home-page-title-aside-container">
          <h1 className="home-page-title">Explore high-quality products and exclusive offers!</h1>
          <AsideHomePage />
          <hr className="home-page-horizontal-divider" />
        </div>
        <CardsContainer />
      </div>
    </div>
  );
}
