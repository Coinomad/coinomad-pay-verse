import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>; // Wrap in fragment
}