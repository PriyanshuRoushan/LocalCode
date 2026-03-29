import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function LogoutPage() {
  const { logout } = useAuthStore();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
}
