import { useAuth } from '../../context/AuthContext/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();

  // Now that loading is finished, we can safely check the final data.
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
