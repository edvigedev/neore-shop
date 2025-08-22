import './FetchingError.css';

export default function FetchingError() {
  return (
    <div className="fetching-error-container" data-testid="fetching-error">
      <div className="fetching-error-content" data-testid="fetching-error-content">
        <h1 data-testid="fetching-error-title">Oops! Something went wrong</h1>
        <p data-testid="fetching-error-message">
          We couldn&apos;t load the data. Please try again.
        </p>
        <button onClick={() => window.location.reload()} data-testid="fetching-error-retry-button">
          Try again
        </button>
      </div>
    </div>
  );
}
