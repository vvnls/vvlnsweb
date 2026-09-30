import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RequireAdmin() {
  const { user, status } = useAuthStore();
  if (status !== 'ready') return null;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}