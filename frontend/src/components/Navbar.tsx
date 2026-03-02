// ============================================================
// components/Navbar.tsx
// ============================================================
// РУС: Навигационная панель. Меняется в зависимости от того,
//      залогинен пользователь или нет, и какая у него роль.
// ESP: Barra de navegación que cambia según el estado de auth.
//
// 3 СОСТОЯНИЯ:
//   1. Не залогинен → показываем "Login" и "Registro"
//   2. Залогинен (user) → показываем имя + "Reservar" + "Salir"
//   3. Залогинен (admin) → всё то же + "Admin Panel"
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 📦 навигация
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // состояние мобильного меню
  const dispatch = useAppDispatch(); // для вызова logout action
  const navigate = useNavigate();   // для программного перехода

  // Читаем текущего пользователя из Redux
  // Если null → не залогинен
  const user = useAppSelector((state) => state.auth.user);

  // ── LOGOUT ───────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logout());    // очищает state.auth и localStorage
    navigate('/');         // идём на главную
    setMenuOpen(false);    // закрываем мобильное меню
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── LOGO ─────────────────────────────────── */}
          {/* Link = <a> из react-router-dom (без перезагрузки страницы) */}
          <Link
            to="/"
            className="font-serif text-xl lg:text-2xl font-medium text-[#3D3D3D] tracking-wide"
          >
            Keratin Madrid
          </Link>

          {/* ── DESKTOP NAV ──────────────────────────── */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-[#666666] hover:text-[#B8A99A] font-light tracking-wide transition-colors text-sm">
              Inicio
            </Link>
            <Link to="/#servicios" className="text-[#666666] hover:text-[#B8A99A] font-light tracking-wide transition-colors text-sm">
              Servicios
            </Link>
            <Link to="/#precios" className="text-[#666666] hover:text-[#B8A99A] font-light tracking-wide transition-colors text-sm">
              Precios
            </Link>
            <Link to="/#homecare" className="text-[#666666] hover:text-[#B8A99A] font-light tracking-wide transition-colors text-sm">
              Homecare
            </Link>
            <Link to="/#formaciones" className="text-[#666666] hover:text-[#B8A99A] font-light tracking-wide transition-colors text-sm">
              Para Profesionales
            </Link>
          </div>

          {/* ── AUTH BUTTONS ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              // ЗАЛОГИНЕН: показываем имя + кнопки
              <>
                <span className="text-sm text-[#666666] font-light">
                  Hola, <span className="font-medium text-[#3D3D3D]">{user.name}</span>
                </span>
                <Link
                  to="/booking"
                  className="btn-primary text-xs"
                >
                  RESERVAR CITA
                </Link>
                {/* Кнопка Admin — только для admin */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-xs font-medium text-[#9A8B7A] border border-[#B8A99A] rounded hover:bg-[#B8A99A] hover:text-white transition-colors tracking-widest"
                  >
                    ADMIN
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#666666] hover:text-[#B8A99A] transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              // НЕ ЗАЛОГИНЕН: показываем Login и Registro
              <>
                <Link
                  to="/login"
                  className="text-sm text-[#666666] hover:text-[#B8A99A] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs"
                >
                  REGISTRO
                </Link>
              </>
            )}
          </div>

          {/* ── HAMBURGER (MOBILE) ───────────────────── */}
          <button
            className="lg:hidden text-[#3D3D3D] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {/* Иконка гамбургера — три полоски или крестик */}
            <div className="w-6 space-y-1.5">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────── */}
        {menuOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-[#E8E4E0]">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-[#666666] hover:text-[#B8A99A] py-1">Inicio</Link>
            <Link to="/#servicios" onClick={() => setMenuOpen(false)} className="block text-[#666666] hover:text-[#B8A99A] py-1">Servicios</Link>
            <Link to="/#precios" onClick={() => setMenuOpen(false)} className="block text-[#666666] hover:text-[#B8A99A] py-1">Precios</Link>
            <Link to="/#homecare" onClick={() => setMenuOpen(false)} className="block text-[#666666] hover:text-[#B8A99A] py-1">Homecare</Link>
            <Link to="/#formaciones" onClick={() => setMenuOpen(false)} className="block text-[#666666] hover:text-[#B8A99A] py-1">Para Profesionales</Link>

            <div className="pt-3 border-t border-[#E8E4E0] space-y-2">
              {user ? (
                <>
                  <p className="text-sm text-[#666666]">Hola, <strong>{user.name}</strong></p>
                  <Link to="/booking" onClick={() => setMenuOpen(false)} className="block btn-primary text-center text-xs">RESERVAR CITA</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-center text-sm text-[#9A8B7A]">Panel Admin</Link>
                  )}
                  <button onClick={handleLogout} className="block text-sm text-[#666666] hover:text-[#B8A99A]">Salir</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-[#666666] py-1">Entrar</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block btn-primary text-center text-xs">REGISTRO</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}