// ============================================================
// App.tsx
// ============================================================
// РУС: Главный компонент — маршрутизатор.
//      Определяет какой компонент показывать по какому URL.
// ESP: Componente principal con el router. Define qué página mostrar por URL.
//
// МАРШРУТЫ:
//   /           → HomePage (публичная)
//   /login      → LoginPage (публичная)
//   /register   → RegisterPage (публичная)
//   /booking    → BookingPage (только залогиненные)
//   /admin      → AdminPage (только admin)
//   *           → redirect на /
//
// 📦 ФОРМУЛЫ:
//   BrowserRouter — оборачиваем приложение в роутер
//   Routes        — контейнер для Route
//   Route         — один маршрут (path + element)
//   Navigate      — перенаправление
// ============================================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useAppHooks';
import { getMeThunk } from './store/authSlice';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  // ── ВОССТАНОВЛЕНИЕ СЕССИИ ─────────────────────────────────
  // При загрузке страницы — если есть токен в localStorage,
  // спрашиваем бэк "кто я?" и восстанавливаем данные пользователя
  // Это нужно чтобы после F5 пользователь оставался залогиненным
  useEffect(() => {
    if (token) {
      // getMeThunk → GET /api/auth/me → возвращает { id, name, email, role }
      dispatch(getMeThunk());
    }
  }, []); // [] = запускаем ОДИН раз при монтировании компонента

  return (
    // BrowserRouter = включает react-router в приложении
    <BrowserRouter>
      {/* Navbar всегда виден (не внутри Routes) */}
      <Navbar />

      {/* pt-16 = padding-top чтобы контент не скрывался под fixed navbar */}
      <main className="pt-16 lg:pt-20">
        {/* Routes = смотрит на URL и показывает первый совпадающий Route */}
        <Routes>
          {/* ПУБЛИЧНЫЕ МАРШРУТЫ — доступны всем */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ЗАЩИЩЁННЫЙ МАРШРУТ — только для залогиненных */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute> {/* охранник проверяет токен */}
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN МАРШРУТ — только для role: 'admin' */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly> {/* adminOnly = только admin */}
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* ВСЁОСТАЛЬНОЕ → главная страница */}
          {/* path="*" = любой несуществующий URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;