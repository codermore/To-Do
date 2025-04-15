import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);

  console.log('isAuthenticated -->', isAuthenticated);

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
