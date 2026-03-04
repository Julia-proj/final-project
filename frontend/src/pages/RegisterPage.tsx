// РУС: Страница регистрации. Поля: name, email, password.
// ESP: Página de registro.
// ✅ ТОЧКА 4: Фикс перекрытия на мобильном
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks';
import { registerThunk, clearError } from '../store/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await dispatch(registerThunk(form)).unwrap();
      navigate('/');
    } catch { /* ошибка в state.auth.error */ }
  };

  return (
    // ✅ ФИКС: min-h-screen + py-8 — не перекрывается
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        <div className="text-center mb-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-3">Nueva cuenta</p>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-1">Crear tu cuenta</h1>
          <p className="text-[#666666] text-xs md:text-sm">Únete a Keratin Madrid</p>
        </div>

        <div className="bg-white border border-[#e8e2da] p-5 md:p-6">
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="name" className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Nombre</label>
              <input id="name" type="text" name="name" value={form.name}
                onChange={handleChange} required placeholder="Tu nombre"
                className="w-full border border-[#e8e2da] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label htmlFor="email" className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Email</label>
              <input id="email" type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@email.com"
                className="w-full border border-[#e8e2da] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label htmlFor="password" className="text-[11px] tracking-widest uppercase text-[#8B7355] mb-1 block">Contraseña</label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange} required minLength={6} placeholder="Mínimo 6 caracteres"
                className="w-full border border-[#e8e2da] px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Creando...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className="text-center text-xs text-[#666666] mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#B8A99A] hover:text-[#9A8B7A] font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
