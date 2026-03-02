// ============================================================
// pages/RegisterPage.tsx
// ============================================================
// РУС: Страница регистрации. Та же логика что и Login,
//      но 3 поля: name, email, password.
// ESP: Página de registro. Igual que login pero con campo de nombre.
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

  // Если уже залогинен → на главную
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerThunk(form)).unwrap();
      navigate('/'); // после регистрации → на главную
    } catch {
      // Ошибка уже в state.auth.error
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 mb-4 bg-[#B8A99A]/10 rounded-full">
            <span className="text-[#B8A99A] text-xs tracking-[0.3em] uppercase font-medium">
              Nueva cuenta
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#3D3D3D] mb-2">
            Crear tu cuenta
          </h1>
          <p className="text-[#666666] font-light text-sm">
            Únete a Keratin Madrid
          </p>
        </div>

        {/* ФОРМА */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NOMBRE */}
            <div>
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="input-field"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="input-field"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Creando cuenta...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className="text-center text-sm text-[#666666] mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#B8A99A] hover:text-[#9A8B7A] font-medium">
              Entrar
            </Link>
          </p>
        </div>

        <div className="gold-divider mt-8" />
      </div>
    </div>
  );
}
