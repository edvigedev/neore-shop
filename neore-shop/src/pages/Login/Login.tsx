import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
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
      setError('Both username and password are required');
      setLoading(false);
      return;
    }

    if (username !== 'emilys' || password !== 'emilyspass') {
      setError('Incorrect username or password');
      setLoading(false);
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
      login(data);
      navigate('/');
      return;
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1 className="login-header" data-testid="login-header">
        Welcome!
      </h1>
      <form onSubmit={handleLogin} className="login-form" data-testid="login-form">
        {error && (
          <div className="login-error" data-testid="login-error">
            {error}
          </div>
        )}
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
          data-testid="login-username-input"
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
          data-testid="login-password-input"
        />
        <button type="submit" className="login-button" data-testid="login-submit-button">
          Login
        </button>
        <button
          type="button"
          onClick={handleGuestLogin}
          className="login-button guest-button"
          data-testid="login-guest-button"
        >
          Continue as Guest
        </button>
      </form>
    </>
  );
}
