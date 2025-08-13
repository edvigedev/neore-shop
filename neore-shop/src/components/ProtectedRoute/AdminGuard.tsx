import { useAuth } from '../../context/AuthContext/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  // If we don't have the user object yet but we have a token,
  if (token && !user) {
    return <LoadingSpinner />;
  }

  // If we don't have a token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user is not an admin, redirect to home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
