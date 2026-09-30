import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const { user, status } = useAuthStore();
  if (status !== 'ready') return null; // or a spinner
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}