import { useState, useEffect } from 'react';
import { getErrorMessage } from '../../utils/getErrorMessage';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Aside-HomePage.css';

interface QuoteData {
  quote: string;
  author: string;
}

export default function AsideHomePage() {
  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="small" />;
  }

  if (error) {
    return null;
  }

  return (
    <aside className="home-page-aside">
      <h3> THINK BEFORE YOU SHOP!</h3>
      <p>
        &quot;{data?.quote}&quot; - {data?.author}
      </p>
    </aside>
  );
}
