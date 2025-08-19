import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FetchingError from '../../components/FetchingError/FetchingError';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './Login.css';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error(getErrorMessage(response));
      }

      const data = await response.json();
      login(data.accessToken);
      navigate('/');
      return;
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <FetchingError />;
  }

  return (
    <>
      <h1 className="login-header">Welcome!</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="username" className="login-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </>
  );
}
