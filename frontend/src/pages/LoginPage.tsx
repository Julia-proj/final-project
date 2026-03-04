// РУС: Страница входа. Форма с email и password.
// ESP: Página de login. Formulario que llama al backend.
// ✅ ТОЧКА 4: Фикс перекрытия на мобильном
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { loginThunk, clearError } from '../store/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk(form)).unwrap();
      navigate('/');
    } catch { /* ошибка в state.auth.error */ }
  };

  return (
    // ✅ ФИКС: min-h-screen + py-8 + px-4 — не перекрывается на mobile
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        <div className="text-center mb-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-3">Acceso</p>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-1">Bienvenida de nuevo</h1>
          <p className="text-[#666666] text-xs md:text-sm">Entra para gestionar tus reservas</p>
        </div>

        {/* ✅ ФИКС: padding уменьшен для mobile */}
        <div className="bg-white border border-[#e8e2da] p-5 md:p-6">
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="email" className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Email</label>
              <input id="email" type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@email.com"
                className="w-full border border-[#e8e2da] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label htmlFor="password" className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Contraseña</label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="w-full border border-[#e8e2da] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <p className="text-center text-xs text-[#666666] mt-4">
            ¿Primera vez?{' '}
            <Link to="/register" className="text-[#B8A99A] hover:text-[#9A8B7A] font-medium">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
