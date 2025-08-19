import { useEffect, useState } from 'react';
import type { User, UsersResponse } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import { Link } from 'react-router';
import { getErrorMessage } from '../../utils/getErrorMessage';
import './Users.css';

export default function Users() {
  const [data, setData] = useState<UsersResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  return (
    <div>
      <h1 className="users-page-title"> All users </h1>
      <hr className="users-horizontal-divider" />
      <section className="users-list-section">
        <ul className="users-list-container">
          {data?.users.map((user: User) => (
            <li key={user.id} className="users-list-items">
              <Link to={`/admin/users/${user.id}`} className="users-no-underline-link">
                {user.id}. {user.firstName} {user.lastName};
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
