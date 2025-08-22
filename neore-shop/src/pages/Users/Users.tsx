import { useEffect, useState, useMemo } from 'react';
import type { User, UsersResponse } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import { Link } from 'react-router';
import { getErrorMessage } from '../../utils/getErrorMessage';
import './Users.css';
import { useSearch } from '../../context/SearchContext/SearchContext';

export default function Users() {
  const [data, setData] = useState<UsersResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { globalSearch } = useSearch();

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    if (!globalSearch.trim()) return data.users;

    return data.users.filter(
      (user: User) =>
        user.firstName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.lastName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.username.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [data?.users, globalSearch]);

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
      <h1 className="users-page-title" data-testid="users-page-title">
        {' '}
        All users{' '}
      </h1>
      <hr className="users-horizontal-divider" />
      <section className="users-list-section" data-testid="users-list-section">
        {filteredUsers.length === 0 && globalSearch.trim() && (
          <p className="users-no-matches" data-testid="users-no-matches">
            No users found matching &quot;{globalSearch}&quot;
          </p>
        )}
        <ul className="users-list-container" data-testid="users-list-container">
          {filteredUsers.map((user: User) => (
            <li key={user.id} className="users-list-items" data-testid="users-list-items">
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
