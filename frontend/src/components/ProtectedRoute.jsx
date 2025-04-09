import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
    const { user, isAuthenticated, loading } = useAuth();

    console.log("isAuthenticated -->", isAuthenticated)

    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/" replace />
    return <Outlet />
}

export default ProtectedRoute