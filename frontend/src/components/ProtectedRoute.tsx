// ============================================================
// components/ProtectedRoute.tsx — Guardia de rutas protegidas
// ============================================================
// Envuelve páginas que requieren autenticación o rol admin.
// Si el usuario no está logueado, redirige a /login.
// Si se necesita rol admin y no lo tiene, redirige a /.
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

  // Sin token ni usuario → no logueado → redirigir a login
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // Ruta solo para admin y el usuario no es admin → redirigir a inicio
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Acceso permitido → mostrar la página
  return <>{children}</>;
}
