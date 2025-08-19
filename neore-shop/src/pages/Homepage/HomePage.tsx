import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import CardsContainer from '../../components/CardsContainer/CardsContainer';
import AsideHomePage from '../../components/Aside-Homepage/Aside-HomePage';
import './Homepage.css';

export default function HomePage() {
  return (
    <div>
      <div className="home-page-container">
        <div className="home-page-title-aside-container">
          <h1 className="home-page-title">Explore high-quality products and exclusive offers!</h1>
          <ErrorBoundary>
            <AsideHomePage />
          </ErrorBoundary>
          <hr className="home-page-horizontal-divider" />
        </div>
        <ErrorBoundary>
          <CardsContainer />
        </ErrorBoundary>
      </div>
    </div>
  );
}
