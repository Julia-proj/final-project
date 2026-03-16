// ============================================================
// components/ProtectedRoute.tsx — Guardia de rutas protegidas
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  // Sin token ni usuario → no logueado
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // Token existe pero getMeThunk aún no completó → esperar sin redirigir
  if (token && !user) {
    return null;
  }

  // Usuario cargado → verificar rol admin si es necesario
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
