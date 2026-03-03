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
import FloatingCTA from './components/FloatingCTA';
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

  useEffect(() => {
    if (token) {
      dispatch(getMeThunk());
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <FloatingCTA />  {/* ← ДОБАВЛЕНО: плавающая кнопка, видна на всех страницах */}

      <main className="pt-16 lg:pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
