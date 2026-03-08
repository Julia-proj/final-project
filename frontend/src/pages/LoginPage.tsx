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
    <div className="min-h-screen flex">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-[#2A2220] flex-col justify-between p-12 xl:p-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #B8A99A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#B8A99A] mb-10 font-light">Estudio de belleza capilar</p>
          <h1 className="font-serif text-5xl xl:text-6xl text-white font-light tracking-wide leading-[1.1]">
            Keratin<br />Madrid
          </h1>
        </div>
        <div className="relative z-10">
          <div className="w-10 h-px bg-[#B8A99A] mb-7" />
          <p className="font-serif text-xl text-[#c0b8b0] font-light leading-relaxed italic">
            &ldquo;La salud del cabello<br />es el lujo más real.&rdquo;
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#6a6560] mt-6 font-light">Calle Altamirano, 11 &mdash; Madrid</p>
        </div>
        <div className="relative z-10 flex gap-5">
          <a href="https://www.instagram.com/keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.tiktok.com/@keratin_madrid" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/></svg>
          </a>
          <a href="https://wa.me/34641261559" target="_blank" rel="noopener noreferrer" className="text-[#6a6560] hover:text-[#B8A99A] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 bg-[#FAF8F5] flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-10">
            <p className="font-serif text-3xl text-[#3D3530] font-light tracking-wide">Keratin Madrid</p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8A99A] mt-2 font-light">Estudio de belleza capilar</p>
          </div>
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8B7355] mb-3 font-medium">Acceso</p>
            <h2 className="font-serif text-3xl text-[#3D3530] mb-2 font-light tracking-wide">Bienvenida de nuevo</h2>
            <p className="text-sm text-[#7a6f68]">Entra para gestionar tus citas y pedidos</p>
          </div>
          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">Email</label>
              <input id="email" type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@email.com"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A] transition-colors"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-2 font-medium">Contraseña</label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A] transition-colors"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#3d3530] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#2d2520] transition-colors disabled:opacity-50 mt-1 font-medium">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="mt-7 pt-6 border-t border-[#ede8e2] text-center">
            <p className="text-sm text-[#8B7355]">
              ¿Primera vez?{' '}
              <Link to="/register" className="text-[#3d3530] font-semibold border-b border-[#3d3530]/30 hover:border-[#3d3530] transition-colors">Crear cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
