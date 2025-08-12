import './FetchingError.css';

export default function FetchingError() {
  return (
    <div className="fetching-error-container">
      <div className="fetching-error-content">
        <h1>Oops! Something went wrong</h1>
        <p>We couldn&apos;t load the data. Please try again later.</p>
      </div>
    </div>
  );
}
