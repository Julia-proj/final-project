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
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-4 font-light">Nueva cuenta</p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D] mb-2 font-light tracking-wide">Crear tu cuenta</h1>
          <p className="text-[#666666] text-base font-light">Únete a Keratin Madrid</p>
        </div>

        <div className="bg-white border border-[#e8e2da] p-8">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-light">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Nombre</label>
              <input id="name" type="text" name="name" value={form.name}
                onChange={handleChange} required placeholder="Tu nombre"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Email</label>
              <input id="email" type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@email.com"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-3 font-light">Contraseña</label>
              <input id="password" type="password" name="password" value={form.password}
                onChange={handleChange} required minLength={6} placeholder="Mínimo 6 caracteres"
                className="w-full border border-[#e8e2da] px-5 py-3.5 text-base bg-white focus:outline-none focus:border-[#B8A99A]"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#B8A99A] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors disabled:opacity-50 mt-2 font-light">
              {loading ? 'Creando...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className="text-center text-sm text-[#666666] mt-6 font-light">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#B8A99A] hover:text-[#9A8B7A] font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
