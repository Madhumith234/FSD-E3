import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
