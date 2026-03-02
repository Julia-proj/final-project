// ============================================================
// components/ProtectedRoute.tsx
// ============================================================
// РУС: "Охранник" — проверяет, может ли пользователь зайти на страницу.
//      Если нет — перенаправляет на /login или /.
// ESP: Guarda de ruta. Si no estás autenticado/autorizado, te redirige.
//
// АНАЛОГИЯ: Клуб с охраной.
//   Обычные страницы = открытая улица (всем можно)
//   /booking = клуб (нужен билет = токен)
//   /admin = VIP зона (нужна особая карта = роль admin)
//
// 📦 ФОРМУЛА: <Navigate to="/login" /> из react-router-dom
// ============================================================

import { Navigate } from 'react-router-dom'; // 📦 перенаправление
import { useAppSelector } from '../hooks/useAppHooks'; // наш типизированный хук

// Props компонента
interface ProtectedRouteProps {
  children: React.ReactNode; // то что рендерим если доступ разрешён
  adminOnly?: boolean;       // ? = опционально, по умолчанию false
}

// 📦 ФОРМУЛА компонента с props
export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {

  // Читаем текущего пользователя из Redux state
  // useAppSelector = типизированный useSelector
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  // ── ПРОВЕРКА 1: Есть ли токен/пользователь? ──────────────
  // Если нет — не залогинен → идём на страницу логина
  if (!token && !user) {
    // Navigate = компонент-перенаправление из react-router-dom
    // replace = заменяем в истории браузера (нельзя нажать "Назад" и вернуться)
    return <Navigate to="/login" replace />;
  }

  // ── ПРОВЕРКА 2: Нужна роль admin? ────────────────────────
  if (adminOnly && user?.role !== 'admin') {
    // user?.role = "если user существует, возьми role"
    // Если не admin → на главную
    return <Navigate to="/" replace />;
  }

  // ── ВСЁОК: показываем защищённую страницу ────────────────
  // children = то что было внутри <ProtectedRoute>...</ProtectedRoute>
  return <>{children}</>;
}
