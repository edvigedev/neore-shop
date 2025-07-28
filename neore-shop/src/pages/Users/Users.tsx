import { useEffect, useState } from 'react';
import type { User, UsersResponse } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import { Link } from 'react-router';
import './Users.css';
import NavBar from '../../components/Navbar/NavBar';

export default function Users() {
  const [data, setData] = useState<UsersResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  return (
    <div>
      <NavBar />
      <h1 className="users-page-title"> All users </h1>
      <ul className="users-list-container">
        {data?.users.map((user: User) => (
          <li key={user.id} className="users-list-links">
            <Link to={`/users/${user.id}`} className="users-no-underline-link">
              {user.id}. {user.firstName} {user.lastName};
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
